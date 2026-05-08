import { Router } from "express";
import db from "../db";
import protect from "../middleware/authMiddleware";
import asyncHandler from "../middleware/asyncHandler";

const router = Router();

router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const user = await db.users.getWishlist(String(req.user.id));
    res.json({ success: true, items: user?.wishlist ?? [] });
  })
);

router.post(
  "/:productId",
  protect,
  asyncHandler(async (req, res) => {
    const product = await db.products.findById(String(req.params.productId));
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const user = await db.users.addToWishlist(String(req.user.id), String(req.params.productId));
    res.json({ success: true, items: user?.wishlist ?? [] });
  })
);

router.delete(
  "/:productId",
  protect,
  asyncHandler(async (req, res) => {
    const user = await db.users.removeFromWishlist(
      String(req.user.id),
      String(req.params.productId)
    );
    res.json({ success: true, items: user?.wishlist ?? [] });
  })
);

export default router;
