import { Router } from "express";
import db from "../db";
import protect from "../middleware/authMiddleware";
import asyncHandler from "../middleware/asyncHandler";

const router = Router();

const sanitizeItems = (
  items: unknown
): Array<{ product: string; quantity: number }> => {
  if (!Array.isArray(items)) return [];
  return (items as Array<{ product?: string; productId?: string; quantity?: number }>)
    .map((i) => ({
      product: String(i.product ?? i.productId ?? ""),
      quantity: Math.max(1, Math.min(50, Number(i.quantity) || 1)),
    }))
    .filter((i) => i.product);
};

router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const user = await db.users.getCart(String(req.user.id));
    res.json({ success: true, items: user?.cart ?? [] });
  })
);

router.put(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const items = sanitizeItems(req.body?.items);
    const user = await db.users.replaceCart(String(req.user.id), items);
    res.json({ success: true, items: user?.cart ?? [] });
  })
);

router.delete(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    await db.users.clearCart(String(req.user.id));
    res.json({ success: true, items: [] });
  })
);

export default router;
