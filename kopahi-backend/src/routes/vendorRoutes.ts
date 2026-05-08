import { Router } from "express";
import db from "../db";
import protect from "../middleware/authMiddleware";
import { vendorOrAdmin } from "../middleware/adminMiddleware";
import asyncHandler from "../middleware/asyncHandler";

const router = Router();

router.use(protect, vendorOrAdmin);

router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const products = await db.products.findByVendor(String(req.user.id));
    res.json({ success: true, count: products.length, products });
  })
);

router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const products = await db.products.findByVendor(String(req.user.id));
    const inStock = products.filter((p) => Number((p as { stock: number }).stock || 0) > 0).length;
    res.json({
      success: true,
      totalProducts: products.length,
      inStock,
      outOfStock: products.length - inStock,
    });
  })
);

export default router;
