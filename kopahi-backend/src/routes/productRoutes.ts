import { Router, Request, Response } from "express";
import db from "../db";
import upload from "../utils/uploadCloudinary";
import protect from "../middleware/authMiddleware";
import { adminOnly, vendorOrAdmin } from "../middleware/adminMiddleware";
import asyncHandler from "../middleware/asyncHandler";
import escapeRegex from "../utils/escapeRegex";
import { recordAudit } from "../utils/auditLogger";

const router = Router();

const slugify = (name: string): string =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/* Upload single product image — vendors and admins */
router.post("/upload", protect, vendorOrAdmin, upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }
  const url = upload.usingCloudinary
    ? (req.file as Express.Multer.File & { path: string }).path
    : `/uploads/products/${req.file.filename}`;
  res.json({ success: true, image: url, url });
});

/* List products (paginated, searchable, category filter) */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = { isActive: true };
    if (req.query.keyword) {
      filter.name = { contains: escapeRegex(req.query.keyword), mode: "insensitive" };
    }
    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }

    const { count, page, pages, items } = await db.products.list(filter, {
      page: req.query.page as string,
      pageSize: req.query.pageSize as string,
    });

    res.json({ success: true, page, pages, count, products: items });
  })
);

/* Featured products */
router.get(
  "/featured/list",
  asyncHandler(async (_req, res) => {
    const products = await db.products.findFeatured(8);
    res.json({ success: true, products });
  })
);

/* Single product */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await db.products.findById(String(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  })
);

/* Create product — vendors and admins. Vendors are auto-attached as owner. */
router.post(
  "/",
  protect,
  vendorOrAdmin,
  asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (!data.slug && data.name) data.slug = `${slugify(data.name)}-${Date.now()}`;
    if (req.user.role === "vendor") data.vendorId = String(req.user.id);
    // Map old `vendor` field name if frontend still sends it
    if (data.vendor && !data.vendorId) {
      data.vendorId = String(data.vendor);
      delete data.vendor;
    }
    const product = await db.products.create(data);
    if (!product) {
      return res.status(500).json({ success: false, message: "Could not create product" });
    }
    await recordAudit(req, {
      action: "product.create",
      targetType: "Product",
      targetId: String(product.id),
      metadata: { name: product.name },
    });
    res.status(201).json({ success: true, message: "Product created", product });
  })
);

/* Update product — admin always; vendor only on their own product */
router.put(
  "/:id",
  protect,
  vendorOrAdmin,
  asyncHandler(async (req, res) => {
    const product = await db.products.findById(String(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (
      req.user.role === "vendor" &&
      String((product as { vendorId?: string }).vendorId || "") !== String(req.user.id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "You can only edit your own products" });
    }
    const updates = { ...req.body };
    if (req.user.role === "vendor") delete updates.vendorId;
    delete updates.vendor;
    const updated = await db.products.updateById(String(req.params.id), updates);
    await recordAudit(req, {
      action: "product.update",
      targetType: "Product",
      targetId: String(req.params.id),
      metadata: { changedKeys: Object.keys(updates) },
    });
    res.json({ success: true, message: "Product updated", product: updated });
  })
);

/* Delete product — admin always; vendor only on their own */
router.delete(
  "/:id",
  protect,
  vendorOrAdmin,
  asyncHandler(async (req, res) => {
    const existing = await db.products.findById(String(req.params.id));
    if (!existing) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (
      req.user.role === "vendor" &&
      String((existing as { vendorId?: string }).vendorId || "") !== String(req.user.id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "You can only delete your own products" });
    }
    await db.products.deleteById(String(req.params.id));
    await recordAudit(req, {
      action: "product.delete",
      targetType: "Product",
      targetId: String(req.params.id),
      metadata: { name: existing.name },
    });
    res.json({ success: true, message: "Product deleted" });
  })
);

export default router;
// Also support adminOnly export for admin-only legacy paths
export { adminOnly };
