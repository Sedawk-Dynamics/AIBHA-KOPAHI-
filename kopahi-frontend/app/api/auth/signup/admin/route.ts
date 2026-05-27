import type { NextRequest } from "next/server";
import { prisma } from "../../../../lib/db";
import { adminSignupSchema } from "../../../../lib/auth/schemas";
import { hashPassword } from "../../../../lib/auth/password";
import { signAccessToken, signRefreshToken } from "../../../../lib/auth/jwt";
import { generateOpaqueToken, hashToken } from "../../../../lib/auth/tokens";
import { setAuthCookies } from "../../../../lib/auth/cookies";
import { checkRateLimit } from "../../../../lib/auth/rate-limit";
import { getRequestContext } from "../../../../lib/auth/request-context";
import { logAudit } from "../../../../lib/auth/audit";
import { created, fail, withErrorHandling } from "../../../../lib/auth/response";

const REFRESH_MS = 30 * 24 * 60 * 60 * 1000;

export const POST = withErrorHandling("auth/signup/admin", async (req: NextRequest) => {
  const { ip, userAgent } = getRequestContext(req);

  const rl = checkRateLimit(`signup:admin:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.success) {
    return fail("RATE_LIMITED", "Too many signup attempts. Try again later.", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON body.", 400);
  }
  const parsed = adminSignupSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.", 400);
  }
  const { token, name, email, phone, password } = parsed.data;

  // Singleton invariant — Kopahi runs with exactly one admin account.
  const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" } });
  if (existingAdmin) {
    return fail(
      "FORBIDDEN",
      "An admin account already exists. Kopahi allows only one admin.",
      403
    );
  }

  const invite = await prisma.adminInvite.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!invite) {
    return fail("TOKEN_INVALID", "Invite is invalid.", 400);
  }
  if (invite.usedAt) {
    return fail("TOKEN_ALREADY_USED", "This invite has already been used.", 400);
  }
  if (invite.expiresAt < new Date()) {
    return fail("TOKEN_EXPIRED", "This invite has expired.", 400);
  }
  if (invite.email.toLowerCase() !== email.toLowerCase()) {
    return fail(
      "VALIDATION_ERROR",
      "This invite is locked to a different email address.",
      400
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return fail(
      "VALIDATION_ERROR",
      "An account with this email already exists. Sign in instead.",
      400
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.$transaction(async (tx) => {
    const u = await tx.user.create({
      data: {
        email,
        name,
        phone,
        passwordHash,
        role: "admin",
        isSuperAdmin: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });
    await tx.adminInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });
    return u;
  });

  // Auto-login the new admin.
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: "ADMIN",
    isSuperAdmin: true,
    vendorStatus: null,
    onboardingComplete: user.onboardingComplete,
  });
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
    action: "SIGN_UP",
    metadata: { role: "ADMIN", invitedBy: invite.invitedBy },
    ipAddress: ip,
    userAgent,
  });

  return created({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: "ADMIN",
      isSuperAdmin: true,
      vendorStatus: null,
      onboardingComplete: user.onboardingComplete,
    },
    accessToken,
  });
});
