import { Router } from "express";
import db from "../db";
import protect from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";
import asyncHandler from "../middleware/asyncHandler";

const router = Router();

const slugify = (name: string): string =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const categories = await db.categories.list();
    res.json({ success: true, count: categories.length, categories });
  })
);

router.post(
  "/",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { name, image } = req.body || {};
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    const category = await db.categories.create({
      name,
      slug: slugify(name),
      image: image || "",
    });
    res.status(201).json({ success: true, message: "Category created", category });
  })
);

router.put(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const updates: { name?: string; slug?: string; image?: string } = {};
    if (req.body?.name) {
      updates.name = req.body.name;
      updates.slug = slugify(req.body.name);
    }
    if (req.body?.image !== undefined) updates.image = req.body.image;
    const category = await db.categories.updateById(String(req.params.id), updates);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, category });
  })
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const category = await db.categories.deleteById(String(req.params.id));
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  })
);

export default router;
