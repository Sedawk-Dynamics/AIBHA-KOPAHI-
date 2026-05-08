import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { Request, Response } from "express";
import db from "../db";
import generateToken from "../utils/generateToken";
import asyncHandler from "../middleware/asyncHandler";
import { validatePassword } from "../utils/passwordPolicy";
import { sendEmail, escapeHtml } from "../utils/sendEmail";
import logger from "../utils/logger";

const HOUR = 60 * 60 * 1000;

const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

const FRONTEND_URL = (): string => process.env.FRONTEND_URL || "http://localhost:3000";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, role, businessName } = req.body || {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Name, email and password are required" });
  }

  const policy = validatePassword(password);
  if (!policy.ok) return res.status(400).json({ success: false, message: policy.reason });

  const exists = await db.users.findByEmail(email);
  if (exists) {
    return res
      .status(409)
      .json({ success: false, message: "An account with this email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const allowedRole = role === "vendor" ? "vendor" : "user";

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenHash = hashToken(verificationToken);

  const user = await db.users.create({
    name,
    email: String(email).toLowerCase(),
    password: hashed,
    phone: phone || "",
    role: allowedRole,
    businessName: allowedRole === "vendor" ? businessName || "" : "",
    emailVerificationToken: verificationTokenHash,
    emailVerificationExpires: new Date(Date.now() + 24 * HOUR),
  });

  if (!user) {
    return res.status(500).json({ success: false, message: "Could not create user" });
  }

  const verifyUrl = `${FRONTEND_URL()}/verify-email/${verificationToken}`;
  try {
    await sendEmail({
      to: user.email as string,
      subject: "Verify your Kopahi account",
      html: `
        <h2>Welcome to Kopahi, ${escapeHtml(user.name as string)}</h2>
        <p>Confirm your email so we can secure your account:</p>
        <p><a href="${verifyUrl}">Verify email</a></p>
        <p>Or copy this link: ${escapeHtml(verifyUrl)}</p>
        <p>This link expires in 24 hours.</p>
      `,
    });
  } catch (err) {
    logger.error("verification_email_failed", {
      userId: String(user.id),
      err: (err as Error).message,
      requestId: req.id,
    });
  }

  res.status(201).json({
    success: true,
    message: "Registered successfully — please check your email to verify",
    token: generateToken({ id: String(user.id), role: user.role as string }, "30d"),
    user,
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, remember } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  const user = await db.users.findByEmailWithPassword(email);
  if (!user || !(await bcrypt.compare(password, (user as { password: string }).password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const tokenLifetime = remember ? "30d" : "12h";

  // Strip the password before responding.
  const { password: _omitted, ...publicUser } = user as { password: string } & Record<string, unknown>;
  void _omitted;

  res.json({
    success: true,
    message: "Login successful",
    token: generateToken(
      { id: String((user as { id: string }).id), role: (user as { role: string }).role },
      tokenLifetime
    ),
    expiresIn: tokenLifetime,
    user: publicUser,
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const updates: Record<string, unknown> = {};
  (["name", "phone", "businessName"] as const).forEach((k) => {
    if (req.body && req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const user = await db.users.updateById(String(req.user.id), updates);
  res.json({ success: true, user });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current and new password are required",
    });
  }
  const policy = validatePassword(newPassword);
  if (!policy.ok) return res.status(400).json({ success: false, message: policy.reason });

  const user = await db.users.findByIdWithPassword(String(req.user.id));
  if (!user || !(await bcrypt.compare(currentPassword, (user as { password: string }).password))) {
    return res
      .status(401)
      .json({ success: false, message: "Current password is incorrect" });
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await db.users.updatePassword(String((user as { id: string }).id), hashed);
  res.json({ success: true, message: "Password updated" });
});

export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body || {};
  // Always return the same response — never confirm whether an email exists.
  const ack = {
    success: true,
    message: "If that email is registered, a reset link has been sent",
  };
  if (!email) return res.json(ack);

  const user = await db.users.findByEmail(email);
  if (!user) return res.json(ack);

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expires = new Date(Date.now() + 1 * HOUR);

  await db.users.setPasswordResetToken(String((user as { id: string }).id), tokenHash, expires);

  const resetUrl = `${FRONTEND_URL()}/reset-password/${token}`;
  try {
    await sendEmail({
      to: (user as { email: string }).email,
      subject: "Reset your Kopahi password",
      html: `
        <h2>Password reset requested</h2>
        <p>Click the link below to choose a new password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    });
  } catch (err) {
    logger.error("password_reset_email_failed", {
      userId: String((user as { id: string }).id),
      err: (err as Error).message,
      requestId: req.id,
    });
  }

  res.json(ack);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Token and new password are required" });
  }
  const policy = validatePassword(password);
  if (!policy.ok) return res.status(400).json({ success: false, message: policy.reason });

  const user = await db.users.findByPasswordResetToken(hashToken(token));
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired reset token" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await db.users.clearPasswordResetToken(String((user as { id: string }).id), hashed);

  res.json({ success: true, message: "Password reset successful — please sign in" });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ success: false, message: "Token is required" });

  const user = await db.users.findByEmailVerificationToken(hashToken(token));
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired verification link" });
  }
  const updated = await db.users.markEmailVerified(String((user as { id: string }).id));
  res.json({ success: true, message: "Email verified", user: updated });
});

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const user = await db.users.findById(String(req.user.id));
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if ((user as { emailVerified: boolean }).emailVerified) {
    return res.json({ success: true, message: "Email is already verified" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  await db.users.setEmailVerificationToken(
    String((user as { id: string }).id),
    hashToken(token),
    new Date(Date.now() + 24 * HOUR)
  );
  const verifyUrl = `${FRONTEND_URL()}/verify-email/${token}`;
  try {
    await sendEmail({
      to: (user as { email: string }).email,
      subject: "Verify your Kopahi account",
      html: `<p>Verify your email: <a href="${verifyUrl}">${escapeHtml(verifyUrl)}</a></p>`,
    });
  } catch (err) {
    logger.error("verification_email_failed", {
      userId: String((user as { id: string }).id),
      err: (err as Error).message,
      requestId: req.id,
    });
  }
  res.json({ success: true, message: "Verification email sent" });
});
