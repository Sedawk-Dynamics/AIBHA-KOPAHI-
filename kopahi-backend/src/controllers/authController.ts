import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { Request, Response } from "express";
import db from "../db";
import generateToken from "../utils/generateToken";
import asyncHandler from "../middleware/asyncHandler";
import { validatePassword } from "../utils/passwordPolicy";
import { sendEmail, escapeHtml } from "../utils/sendEmail";
import { recordAudit } from "../utils/auditLogger";
import logger from "../utils/logger";

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;

// v9 hardening: bcrypt cost factor. 12 ≈ 250ms verify on a mid-tier server.
// Lowered in test env so suites stay fast.
const BCRYPT_COST = process.env.NODE_ENV === "test" ? 4 : 12;

// Account lockout policy: 5 wrong-password attempts within the failed-attempts
// counter window locks the account for LOCKOUT_DURATION_MS. The counter only
// resets on successful sign-in OR password reset OR lockout expiry.
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION_MS = 15 * MIN;

const DEMO_EMAILS = new Set([
  "admin@kopahi.com",
  "vendor@kopahi.com",
  "customer@kopahi.com",
]);
const isDemoEmail = (email: string): boolean =>
  process.env.ENABLE_DEMO === "true" && DEMO_EMAILS.has(email.toLowerCase());

const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

const FRONTEND_URL = (): string => process.env.FRONTEND_URL || "http://localhost:3000";

const sendVerificationEmail = async (
  req: Request,
  user: { id: string; name: string; email: string },
  rawToken: string
): Promise<void> => {
  const verifyUrl = `${FRONTEND_URL()}/verify-email/${rawToken}`;
  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your Kopahi account",
      html: `
        <h2>Welcome to Kopahi, ${escapeHtml(user.name)}</h2>
        <p>Confirm your email so we can secure your account:</p>
        <p><a href="${verifyUrl}">Verify email</a></p>
        <p>Or copy this link: ${escapeHtml(verifyUrl)}</p>
        <p>This link expires in 24 hours.</p>
      `,
    });
  } catch (err) {
    logger.error("verification_email_failed", {
      userId: user.id,
      err: (err as Error).message,
      requestId: req.id,
    });
  }
};

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // Customer signup only — `role` is intentionally NOT read from the body.
  // Vendors must use POST /api/auth/register-vendor.
  const { name, email, password, phone } = req.body || {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Name, email and password are required" });
  }

  const policy = validatePassword(password);
  if (!policy.ok) return res.status(400).json({ success: false, message: policy.reason });

  // v9 anti-enumeration: identical response whether the email is new or
  // already registered. Existing accounts don't get a verification email
  // re-sent (would leak existence via mailbox inspection), and no audit log
  // entry is written (would let an attacker probe via the admin audit view).
  const ack = {
    success: true,
    message:
      "Account created — please check your email for a verification link.",
  };
  const exists = await db.users.findByEmail(email);
  if (exists) {
    return res.status(201).json(ack);
  }

  const hashed = await bcrypt.hash(password, BCRYPT_COST);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await db.users.create({
    name,
    email: String(email).toLowerCase(),
    password: hashed,
    phone: phone || "",
    role: "user",
    emailVerificationToken: hashToken(verificationToken),
    emailVerificationExpires: new Date(Date.now() + 24 * HOUR),
  });

  if (!user) {
    return res.status(500).json({ success: false, message: "Could not create user" });
  }

  await sendVerificationEmail(
    req,
    { id: String(user.id), name: user.name as string, email: user.email as string },
    verificationToken
  );

  await recordAudit(req, {
    action: "user.signup",
    targetType: "User",
    targetId: String(user.id),
    metadata: { role: "user" },
  });

  res.status(201).json(ack);
});

export const registerVendor = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, businessName, phone, gstNumber } = req.body || {};

  if (!name || !email || !password || !businessName || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password, businessName and phone are required",
    });
  }

  const policy = validatePassword(password);
  if (!policy.ok) return res.status(400).json({ success: false, message: policy.reason });

  const ack = {
    success: true,
    message:
      "Vendor account created — please check your email for a verification link.",
  };
  const exists = await db.users.findByEmail(email);
  if (exists) {
    return res.status(201).json(ack);
  }

  const hashed = await bcrypt.hash(password, BCRYPT_COST);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await db.users.create({
    name,
    email: String(email).toLowerCase(),
    password: hashed,
    phone: String(phone),
    role: "vendor",
    businessName: String(businessName),
    gstNumber: gstNumber ? String(gstNumber).toUpperCase() : "",
    emailVerificationToken: hashToken(verificationToken),
    emailVerificationExpires: new Date(Date.now() + 24 * HOUR),
  });

  if (!user) {
    return res.status(500).json({ success: false, message: "Could not create vendor" });
  }

  await sendVerificationEmail(
    req,
    { id: String(user.id), name: user.name as string, email: user.email as string },
    verificationToken
  );

  await recordAudit(req, {
    action: "vendor.signup",
    targetType: "User",
    targetId: String(user.id),
    metadata: { businessName, gstNumber: gstNumber || null },
  });

  res.status(201).json(ack);
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, remember } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  // Generic credential error — never differentiates "user doesn't exist" vs
  // "wrong password" vs other shapes. Same wording everywhere.
  const GENERIC_INVALID = "Invalid email or password.";

  const lowered = String(email).toLowerCase();
  const user = (await db.users.findByEmailWithPassword(email)) as
    | (Record<string, unknown> & {
        id: string;
        email: string;
        role: string;
        password: string;
        emailVerified: boolean;
        lockedUntil: Date | null;
        failedLoginAttempts: number;
      })
    | null;

  if (!user) {
    await recordAudit(req, {
      action: "auth.signin_failed",
      metadata: { email: lowered, reason: "unknown_email" },
    });
    return res.status(401).json({ success: false, message: GENERIC_INVALID });
  }

  // 1. Lockout gate (skip for demo accounts when ENABLE_DEMO=true so the
  //    three role chips on /login keep working without manual unlock).
  if (
    !isDemoEmail(user.email) &&
    user.lockedUntil &&
    user.lockedUntil > new Date()
  ) {
    return res.status(423).json({
      success: false,
      code: "ACCOUNT_LOCKED",
      message:
        "Account temporarily locked due to too many failed attempts. Try again in a few minutes.",
    });
  }

  // 2. Verify password.
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    if (!isDemoEmail(user.email)) {
      const attempts = await db.users.incrementFailedAttempts(user.id);
      await recordAudit(req, {
        action: "auth.signin_failed",
        targetType: "User",
        targetId: user.id,
        metadata: { reason: "wrong_password", attempts },
      });
      if (attempts >= LOCKOUT_THRESHOLD) {
        const until = new Date(Date.now() + LOCKOUT_DURATION_MS);
        await db.users.lockAccount(user.id, until);
        await recordAudit(req, {
          action: "auth.account_locked",
          targetType: "User",
          targetId: user.id,
          metadata: { until: until.toISOString(), attempts },
        });
        return res.status(423).json({
          success: false,
          code: "ACCOUNT_LOCKED",
          message:
            "Account locked for 15 minutes due to too many failed attempts.",
        });
      }
    }
    return res.status(401).json({ success: false, message: GENERIC_INVALID });
  }

  // 3. Email-verification gate for ALL roles (v9 §4.1 §17). Demo seed
  //    accounts are pre-verified, so this does not break the chip flow.
  if (!user.emailVerified) {
    return res.status(403).json({
      success: false,
      code: "EMAIL_NOT_VERIFIED",
      message:
        "Please verify your email before signing in. Check your inbox for the verification link.",
    });
  }

  // 4. Successful sign-in: clear lockout counters, stamp lastSignInAt/IP,
  //    audit-log.
  const clientIp =
    typeof req.ip === "string" && req.ip.length > 0 ? req.ip : null;
  await db.users.recordSuccessfulSignIn(user.id, clientIp);

  await recordAudit(req, {
    action: "auth.signin",
    targetType: "User",
    targetId: user.id,
    metadata: { role: user.role, remember: !!remember },
  });

  const tokenLifetime = remember ? "30d" : "12h";

  // Strip the password + lockout internals before responding.
  const {
    password: _omitted,
    failedLoginAttempts: _attempts,
    lockedUntil: _locked,
    ...publicUser
  } = user as typeof user & {
    failedLoginAttempts: number;
    lockedUntil: Date | null;
  };
  void _omitted;
  void _attempts;
  void _locked;

  res.json({
    success: true,
    message: "Login successful",
    token: generateToken(
      { id: user.id, role: user.role },
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
  // businessName and gstNumber only accepted from vendors.
  const allowed: Array<"name" | "phone" | "businessName" | "gstNumber"> =
    req.user.role === "vendor"
      ? ["name", "phone", "businessName", "gstNumber"]
      : ["name", "phone"];
  for (const k of allowed) {
    if (req.body && req.body[k] !== undefined) {
      updates[k] = k === "gstNumber"
        ? String(req.body[k]).toUpperCase()
        : req.body[k];
    }
  }

  const user = await db.users.updateById(String(req.user.id), updates);
  await recordAudit(req, {
    action: "user.profile_update",
    targetType: "User",
    targetId: String(req.user.id),
    metadata: { changedKeys: Object.keys(updates) },
  });
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
  const hashed = await bcrypt.hash(newPassword, BCRYPT_COST);
  await db.users.updatePassword(String((user as { id: string }).id), hashed);
  await recordAudit(req, {
    action: "user.password_change",
    targetType: "User",
    targetId: String(req.user.id),
  });
  res.json({ success: true, message: "Password updated" });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Stateless JWT — server keeps no session. Client is expected to drop the
  // token. We only audit-log the action.
  if (req.user) {
    await recordAudit(req, {
      action: "user.logout",
      targetType: "User",
      targetId: String(req.user.id),
    });
  }
  res.json({ success: true, message: "Logged out" });
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

  await recordAudit(req, {
    action: "auth.password_reset_requested",
    targetType: "User",
    targetId: String((user as { id: string }).id),
  });

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

  const hashed = await bcrypt.hash(password, BCRYPT_COST);
  await db.users.clearPasswordResetToken(String((user as { id: string }).id), hashed);

  // A successful password reset clears any lockout — the new password makes
  // the previous failed-attempt count irrelevant, and the user has now
  // proven inbox control.
  await db.users.clearLockAndAttempts(String((user as { id: string }).id));

  await recordAudit(req, {
    action: "auth.password_reset_completed",
    targetType: "User",
    targetId: String((user as { id: string }).id),
  });

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
  await recordAudit(req, {
    action: "auth.email_verified",
    targetType: "User",
    targetId: String((user as { id: string }).id),
  });
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
