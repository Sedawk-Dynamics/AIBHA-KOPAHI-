import { Router } from "express";
import db from "../db";
import protect from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";
import asyncHandler from "../middleware/asyncHandler";
import { recordAudit } from "../utils/auditLogger";

const router = Router();

router.use(protect, adminOnly);

router.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    const [totalUsers, totalVendors, totalProducts, totalOrders, leads, revenue] =
      await Promise.all([
        db.users.count({ role: "user" }),
        db.users.count({ role: "vendor" }),
        db.products.count(),
        db.orders.count(),
        db.leads.count(),
        db.orders.totalPaidRevenue(),
      ]);

    res.json({
      success: true,
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      leads,
      revenue,
    });
  })
);

router.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await db.users.list();
    res.json({ success: true, count: users.length, users });
  })
);

router.get(
  "/orders",
  asyncHandler(async (_req, res) => {
    const orders = await db.orders.listAll();
    res.json({ success: true, count: orders?.length ?? 0, orders });
  })
);

router.get(
  "/leads",
  asyncHandler(async (_req, res) => {
    const leads = await db.leads.list();
    res.json({ success: true, count: leads.length, leads });
  })
);

router.get(
  "/audit",
  asyncHandler(async (req, res) => {
    const logs = await db.audit.list({
      page: req.query.page as string,
      pageSize: req.query.pageSize as string,
      action: req.query.action as string | undefined,
    });
    res.json({ success: true, count: logs.length, logs });
  })
);

router.delete(
  "/product/:id",
  asyncHandler(async (req, res) => {
    const product = await db.products.deleteById(String(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    await recordAudit(req, {
      action: "admin.product_delete",
      targetType: "Product",
      targetId: String(req.params.id),
      metadata: { name: product.name },
    });
    res.json({ success: true, message: "Product deleted" });
  })
);

router.delete(
  "/user/:id",
  asyncHandler(async (req, res) => {
    if (String(req.user.id) === String(String(req.params.id))) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot delete your own account" });
    }
    const user = await db.users.deleteById(String(req.params.id));
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await recordAudit(req, {
      action: "admin.user_delete",
      targetType: "User",
      targetId: String(req.params.id),
      metadata: { email: user.email, role: user.role },
    });
    res.json({ success: true, message: "User deleted" });
  })
);

export default router;
