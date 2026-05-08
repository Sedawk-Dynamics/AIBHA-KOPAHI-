import { Router, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import db from "../db";
import prisma from "../config/db";
import protect from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";
import asyncHandler from "../middleware/asyncHandler";
import { recordAudit } from "../utils/auditLogger";
import logger from "../utils/logger";
import { HttpError } from "../middleware/errorMiddleware";
import { deepShape } from "../db/_shape";

const router = Router();

const ALLOWED_STATUS = [
  "Placed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;
type OrderStatus = (typeof ALLOWED_STATUS)[number];

/*
 * Validate a coupon code against a subtotal. Returns the coupon + discount,
 * or { error } if invalid.
 */
type CouponValidation =
  | { error: string }
  | { coupon: { id: string; code: string; percentDiscount: number; description?: string; maxDiscount: number; minSubtotal: number; usageLimit: number; usedCount: number; active: boolean; expiresAt: Date | null }; discount: number };

async function resolveCoupon(code: string, subtotal: number): Promise<CouponValidation | null> {
  if (!code) return null;
  const coupon = (await db.coupons.findByCode(code)) as
    | (CouponValidation & { coupon?: never })
    | null
    | (Record<string, unknown> & {
        id: string;
        code: string;
        percentDiscount: number;
        description?: string;
        maxDiscount: Prisma.Decimal | number | string;
        minSubtotal: Prisma.Decimal | number | string;
        usageLimit: number;
        usedCount: number;
        active: boolean;
        expiresAt: Date | null;
      });
  if (!coupon || "error" in coupon) return { error: "Invalid coupon code" };
  if (!coupon.active) return { error: "This coupon is no longer active" };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
    return { error: "This coupon has expired" };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
    return { error: "This coupon has reached its usage limit" };
  const minSubtotal = Number(coupon.minSubtotal ?? 0);
  if (subtotal < minSubtotal)
    return { error: `Minimum order ₹${minSubtotal} required for this coupon` };

  let discount = Math.round((subtotal * Number(coupon.percentDiscount)) / 100);
  const maxDiscount = Number(coupon.maxDiscount ?? 0);
  if (maxDiscount && discount > maxDiscount) discount = maxDiscount;
  return {
    coupon: {
      id: String(coupon.id),
      code: coupon.code as string,
      percentDiscount: Number(coupon.percentDiscount),
      description: coupon.description as string | undefined,
      maxDiscount,
      minSubtotal,
      usageLimit: Number(coupon.usageLimit ?? 0),
      usedCount: Number(coupon.usedCount ?? 0),
      active: !!coupon.active,
      expiresAt: coupon.expiresAt ?? null,
    },
    discount,
  };
}

/* Public: validate a coupon for a given subtotal (used by cart UI) */
router.post(
  "/coupon/validate",
  asyncHandler(async (req, res) => {
    const { code, subtotal } = req.body || {};
    if (!code) return res.status(400).json({ success: false, message: "Coupon code required" });
    const result = await resolveCoupon(code, Number(subtotal) || 0);
    if (!result || "error" in result) {
      return res
        .status(400)
        .json({ success: false, message: (result as { error: string })?.error || "Invalid coupon" });
    }
    res.json({
      success: true,
      coupon: {
        code: result.coupon.code,
        percentDiscount: result.coupon.percentDiscount,
        description: result.coupon.description,
      },
      discount: result.discount,
    });
  })
);

/*
 * Place order — auth required, server computes prices from DB inside a
 * single Prisma transaction. Replaces the old N-sequential decrement +
 * manual-rollback dance with a real atomic operation.
 */
router.post(
  "/",
  protect,
  asyncHandler(async (req: Request, res: Response) => {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order must contain at least one item" });
    }
    if (!shippingAddress || !shippingAddress.address) {
      return res
        .status(400)
        .json({ success: false, message: "Shipping address is required" });
    }

    const productIds: string[] = items
      .map((i: { product?: string }) => (i.product ? String(i.product) : ""))
      .filter(Boolean);

    try {
      const order = await prisma.$transaction(async (tx) => {
        // 1. Lock-friendly: re-read product state inside the txn.
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            images: true,
          },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));

        // 2. Validate items, compute prices.
        const computed: Array<{
          productId: string;
          name: string;
          image: string;
          price: Prisma.Decimal;
          quantity: number;
        }> = [];
        let itemsPrice = 0;
        for (const i of items as Array<{ product: string; quantity?: number }>) {
          const product = productMap.get(String(i.product));
          if (!product) {
            throw new HttpError(400, `Product not found: ${i.product}`);
          }
          const qty = Math.max(1, Math.min(50, Number(i.quantity) || 1));
          if ((product.stock ?? 0) < qty) {
            throw new HttpError(
              409,
              `Insufficient stock for ${product.name} (have ${product.stock}, need ${qty})`
            );
          }
          itemsPrice += Number(product.price) * qty;
          computed.push({
            productId: product.id,
            name: product.name,
            image: product.images?.[0] || "",
            price: product.price,
            quantity: qty,
          });
        }

        // 3. Coupon resolution.
        let discount = 0;
        let appliedCouponId: string | null = null;
        let appliedCouponCode = "";
        if (couponCode) {
          const result = await resolveCoupon(String(couponCode), itemsPrice);
          if (!result || "error" in result) {
            throw new HttpError(
              400,
              (result as { error?: string })?.error || "Invalid coupon"
            );
          }
          discount = result.discount;
          appliedCouponId = result.coupon.id;
          appliedCouponCode = result.coupon.code;
        }

        // 4. Conditional decrement for each line — atomic within txn.
        for (const line of computed) {
          const r = await tx.product.updateMany({
            where: { id: line.productId, stock: { gte: line.quantity } },
            data: { stock: { decrement: line.quantity } },
          });
          if (r.count === 0) {
            throw new HttpError(
              409,
              "Stock changed while placing your order — please retry"
            );
          }
        }

        // 5. Coupon usage increment.
        if (appliedCouponId) {
          await tx.coupon.update({
            where: { id: appliedCouponId },
            data: { usedCount: { increment: 1 } },
          });
        }

        // 6. Final price math.
        const discountedSubtotal = Math.max(0, itemsPrice - discount);
        const shippingPrice = discountedSubtotal >= 999 ? 0 : 99;
        const taxPrice = Math.round(discountedSubtotal * 0.05);
        const totalPrice = discountedSubtotal + shippingPrice + taxPrice;

        // 7. Create order + items in one nested write.
        return tx.order.create({
          data: {
            userId: String(req.user.id),
            shippingAddress: shippingAddress as never,
            paymentMethod: paymentMethod === "Online" ? "Online" : "COD",
            paymentStatus: "Pending",
            orderStatus: "Placed",
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            couponCode: appliedCouponCode,
            couponDiscount: discount,
            items: { create: computed },
          },
          include: { items: true },
        });
      });

      // Outside the txn: clear cart, audit, respond.
      try {
        await prisma.cartItem.deleteMany({ where: { userId: String(req.user.id) } });
      } catch (err) {
        logger.warn("cart_clear_after_order_failed", {
          userId: String(req.user.id),
          err: (err as Error).message,
          requestId: req.id,
        });
      }
      await recordAudit(req, {
        action: "order.create",
        targetType: "Order",
        targetId: String(order.id),
      });

      res
        .status(201)
        .json({ success: true, message: "Order placed", order: deepShape(order) });
    } catch (err) {
      if (err instanceof HttpError) {
        return res.status(err.status).json({ success: false, message: err.message });
      }
      throw err;
    }
  })
);

/* My orders */
router.get(
  "/mine",
  protect,
  asyncHandler(async (req, res) => {
    const orders = await db.orders.findByUser(String(req.user.id));
    res.json({ success: true, count: orders?.length ?? 0, orders });
  })
);

/* All orders — admin */
router.get(
  "/",
  protect,
  adminOnly,
  asyncHandler(async (_req, res) => {
    const orders = await db.orders.listAll();
    res.json({ success: true, count: orders?.length ?? 0, orders });
  })
);

/* Single order — owner or admin */
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await db.orders.findByIdWithUser(String(req.params.id));
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (
      req.user.role !== "admin" &&
      String((order as { userId: string }).userId) !== String(req.user.id)
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    res.json({ success: true, order });
  })
);

/* Update status — admin */
router.put(
  "/:id/status",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { orderStatus } = req.body || {};
    if (!ALLOWED_STATUS.includes(orderStatus as OrderStatus)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }
    const previous = await db.orders.findById(String(req.params.id));
    if (!previous) return res.status(404).json({ success: false, message: "Order not found" });

    const order = await db.orders.setStatus(
      String(req.params.id),
      orderStatus,
      orderStatus === "Delivered" ? new Date() : undefined
    );

    await recordAudit(req, {
      action: "order.status_change",
      targetType: "Order",
      targetId: String(req.params.id),
      metadata: {
        from: (previous as { orderStatus: string }).orderStatus,
        to: orderStatus,
      },
    });

    res.json({ success: true, message: "Order status updated", order });
  })
);

/* Mark paid — admin (or webhook) */
router.put(
  "/:id/pay",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const order = await db.orders.markPaid(String(req.params.id));
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    await recordAudit(req, {
      action: "order.mark_paid",
      targetType: "Order",
      targetId: String(req.params.id),
    });
    res.json({ success: true, message: "Payment marked as paid", order });
  })
);

/* Cancel — owner or admin. Restores stock atomically. */
router.put(
  "/:id/cancel",
  protect,
  asyncHandler(async (req, res) => {
    const existing = await db.orders.findById(String(req.params.id));
    if (!existing) return res.status(404).json({ success: false, message: "Order not found" });

    if (
      req.user.role !== "admin" &&
      String((existing as { userId: string }).userId) !== String(req.user.id)
    ) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const status = (existing as { orderStatus: string }).orderStatus;
    if (["Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${status.toLowerCase()} order`,
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      const cancelled = await tx.order.update({
        where: { id: String(req.params.id) },
        data: { orderStatus: "Cancelled" },
        include: { items: true },
      });
      for (const line of cancelled.items) {
        if (!line.productId) continue;
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { increment: line.quantity } },
        });
      }
      return cancelled;
    });

    await recordAudit(req, {
      action: "order.cancel",
      targetType: "Order",
      targetId: String(req.params.id),
    });
    res.json({ success: true, message: "Order cancelled", order: deepShape(order) });
  })
);

export default router;
