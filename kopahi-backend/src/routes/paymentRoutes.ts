import { Router } from "express";
import crypto from "crypto";
import db from "../db";
import prisma from "../config/db";
import protect from "../middleware/authMiddleware";
import asyncHandler from "../middleware/asyncHandler";
import razorpay from "../utils/razorpay";

const router = Router();

const paymentsConfigured = (): boolean =>
  !!razorpay && !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;

/* Create Razorpay order from a Kopahi order id */
router.post(
  "/razorpay/order",
  protect,
  asyncHandler(async (req, res) => {
    if (!paymentsConfigured()) {
      return res
        .status(503)
        .json({ success: false, message: "Payments are not configured on this server" });
    }

    const { orderId } = req.body || {};
    const order = await db.orders.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (String((order as { userId: string }).userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const totalPaise = Math.round(
      Number((order as unknown as { totalPrice: number | string }).totalPrice) * 100
    );
    const rOrder = await razorpay!.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: String(order.id),
    });

    res.json({
      success: true,
      razorpayOrder: rOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  })
);

/* Verify Razorpay signature & mark order paid */
router.post(
  "/razorpay/verify",
  protect,
  asyncHandler(async (req, res) => {
    if (!paymentsConfigured()) {
      return res.status(503).json({ success: false, message: "Payments are not configured" });
    }

    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body || {};
    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment fields" });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const order = await db.orders.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (String((order as { userId: string }).userId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updated = await prisma.order.update({
      where: { id: String(orderId) },
      data: { paymentStatus: "Paid", paidAt: new Date() },
      include: { items: true },
    });

    res.json({ success: true, order: updated });
  })
);

export default router;
