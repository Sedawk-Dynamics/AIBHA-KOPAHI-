import { Router } from "express";
import db from "../db";
import protect from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";
import asyncHandler from "../middleware/asyncHandler";
import { recordAudit } from "../utils/auditLogger";

const router = Router();

const slugify = (s: string): string =>
  String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { count, page, pages, items } = await db.blog.listPublished({
      page: req.query.page as string,
      pageSize: req.query.pageSize as string,
    });
    res.json({ success: true, page, pages, count, posts: items });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const post = await db.blog.findBySlug(String(req.params.slug));
    if (!post || !(post as { published: boolean }).published) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, post });
  })
);

router.post(
  "/",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (!data.title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!data.slug) data.slug = `${slugify(data.title)}-${Date.now().toString(36)}`;
    const post = await db.blog.create(data);
    if (!post) {
      return res.status(500).json({ success: false, message: "Could not create post" });
    }
    await recordAudit(req, {
      action: "blog.create",
      targetType: "BlogPost",
      targetId: String(post.id),
      metadata: { title: post.title },
    });
    res.status(201).json({ success: true, post });
  })
);

router.put(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const post = await db.blog.updateById(String(req.params.id), req.body);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    await recordAudit(req, {
      action: "blog.update",
      targetType: "BlogPost",
      targetId: String(req.params.id),
    });
    res.json({ success: true, post });
  })
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const post = await db.blog.deleteById(String(req.params.id));
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    await recordAudit(req, {
      action: "blog.delete",
      targetType: "BlogPost",
      targetId: String(req.params.id),
    });
    res.json({ success: true, message: "Post deleted" });
  })
);

export default router;
