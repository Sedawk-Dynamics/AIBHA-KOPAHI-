import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import { loginSchema } from "../../../lib/auth/schemas";
import {
  verifyPassword,
  TIMING_DUMMY_HASH,
} from "../../../lib/auth/password";
import { signAccessToken, signRefreshToken } from "../../../lib/auth/jwt";
import { generateOpaqueToken, hashToken } from "../../../lib/auth/tokens";
import { setAuthCookies } from "../../../lib/auth/cookies";
import { checkRateLimit } from "../../../lib/auth/rate-limit";
import { getRequestContext } from "../../../lib/auth/request-context";
import { logAudit } from "../../../lib/auth/audit";
import { fromDbRole } from "../../../lib/auth/roles";
import { ok, fail, withErrorHandling } from "../../../lib/auth/response";

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const REFRESH_MS = 30 * 24 * 60 * 60 * 1000;

// Demo seed accounts skip lockout when ENABLE_DEMO=true (parity with the
// Express backend's existing demo bypass).
const DEMO_EMAILS = new Set([
  "admin@kopahi.com",
  "vendor@kopahi.com",
  "customer@kopahi.com",
]);
const isDemoEmail = (email: string) =>
  process.env.ENABLE_DEMO === "true" && DEMO_EMAILS.has(email.toLowerCase());

export const POST = withErrorHandling("auth/login", async (req: NextRequest) => {
  const { ip, userAgent } = getRequestContext(req);

  const rl = checkRateLimit(`login:${ip}`, 5, 5 * 60 * 1000);
  if (!rl.success) {
    return fail(
      "RATE_LIMITED",
      "Too many login attempts. Try again in a few minutes.",
      429
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON.", 400);
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Email and password are required.", 400);
  }
  const { email, password } = parsed.data;

  const genericError = () =>
    fail("INVALID_CREDENTIALS", "Invalid email or password.", 401);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { vendor: { select: { status: true } } },
  });

  if (!user) {
    // Timing-safe: consume a bcrypt cycle anyway.
    await verifyPassword(password, TIMING_DUMMY_HASH);
    await logAudit({
      action: "SIGN_IN_FAILED",
      metadata: { email, reason: "no_user" },
      ipAddress: ip,
      userAgent,
    });
    return genericError();
  }

  if (user.status === "SUSPENDED") {
    return fail(
      "ACCOUNT_SUSPENDED",
      "Your account has been suspended. Contact info@kopahi.com.",
      403
    );
  }
  if (user.status === "DELETED") return genericError();

  if (
    !isDemoEmail(user.email) &&
    user.lockedUntil &&
    user.lockedUntil > new Date()
  ) {
    return fail(
      "ACCOUNT_LOCKED",
      "Account locked due to too many failed attempts. Try again later.",
      423
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    if (!isDemoEmail(user.email)) {
      const attempts = user.failedLoginAttempts + 1;
      const lockedUntil =
        attempts >= LOCKOUT_THRESHOLD ? new Date(Date.now() + LOCKOUT_MS) : null;
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts, lockedUntil },
      });
      await logAudit({
        userId: user.id,
        action: "SIGN_IN_FAILED",
        metadata: { reason: "wrong_password", attempts },
        ipAddress: ip,
        userAgent,
      });
      if (lockedUntil) {
        await logAudit({
          userId: user.id,
          action: "ACCOUNT_LOCKED",
          ipAddress: ip,
          userAgent,
        });
        return fail(
          "ACCOUNT_LOCKED",
          "Account locked for 15 minutes due to too many failed attempts.",
          423
        );
      }
    }
    return genericError();
  }

  // Email verification gate intentionally removed — accounts are usable
  // immediately on signup. Password recovery is the only email-dependent
  // flow that remains.

  // Successful sign-in: clear lockout counters, stamp tracking.
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    },
  });

  const appRole = fromDbRole(user.role);

  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: appRole,
    isSuperAdmin: user.isSuperAdmin,
    vendorStatus: user.vendor?.status ?? null,
    onboardingComplete: user.onboardingComplete,
  });

  // Refresh token: opaque secret stored as hash; JWT carries the row id.
  const refreshOpaque = generateOpaqueToken();
  const refreshRow = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshOpaque),
      expiresAt: new Date(Date.now() + REFRESH_MS),
      userAgent,
      ipAddress: ip,
    },
  });
  const refreshToken = signRefreshToken(user.id, refreshRow.id);

  await setAuthCookies(accessToken, refreshToken);

  await logAudit({
    userId: user.id,
    action: "SIGN_IN",
    metadata: { role: appRole },
    ipAddress: ip,
    userAgent,
  });

  // We expose the access token in the body too for backward-compat with the
  // existing AuthContext + cart/orders Bearer-header consumers. The cookies
  // are the canonical store; the body token is a transition affordance.
  return ok({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: appRole,
      isSuperAdmin: user.isSuperAdmin,
      vendorStatus: user.vendor?.status ?? null,
      onboardingComplete: user.onboardingComplete,
    },
    accessToken,
  });
});
