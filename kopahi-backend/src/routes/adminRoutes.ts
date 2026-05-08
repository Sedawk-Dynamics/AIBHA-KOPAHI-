import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db";
import protect from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";
import asyncHandler from "../middleware/asyncHandler";
import { recordAudit } from "../utils/auditLogger";
import { validatePassword } from "../utils/passwordPolicy";

const router = Router();

router.use(protect, adminOnly);

const createInternalUser = async (
  req: import("express").Request,
  res: import("express").Response,
  role: "vendor" | "admin"
) => {
  const { name, email, password, phone, businessName } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }
  if (role === "vendor" && !businessName) {
    return res
      .status(400)
      .json({ success: false, message: "businessName is required for vendor accounts" });
  }
  const policy = validatePassword(password);
  if (!policy.ok) {
    return res.status(400).json({ success: false, message: policy.reason });
  }
  const exists = await db.users.findByEmail(email);
  if (exists) {
    return res
      .status(409)
      .json({ success: false, message: "An account with this email already exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await db.users.create({
    name,
    email: String(email).toLowerCase(),
    password: hashed,
    phone: phone || "",
    role,
    businessName: role === "vendor" ? businessName : "",
  });
  if (!user) {
    return res
      .status(500)
      .json({ success: false, message: `Could not create ${role} account` });
  }
  // Manually-onboarded users skip the email-verify gate.
  await db.users.updateById(String(user.id), { emailVerified: true });

  await recordAudit(req, {
    action: role === "vendor" ? "admin.user_create_vendor" : "admin.user_create_admin",
    targetType: "User",
    targetId: String(user.id),
    metadata: { email: user.email, role, businessName: businessName || null },
  });

  return res.status(201).json({
    success: true,
    user: { ...user, emailVerified: true },
  });
};

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

router.post(
  "/users/create-vendor",
  asyncHandler(async (req, res) => {
    await createInternalUser(req, res, "vendor");
  })
);

router.post(
  "/users/create-admin",
  asyncHandler(async (req, res) => {
    await createInternalUser(req, res, "admin");
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
