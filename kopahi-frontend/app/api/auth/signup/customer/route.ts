import type { NextRequest } from "next/server";
import { prisma } from "../../../../lib/db";
import { customerSignupSchema } from "../../../../lib/auth/schemas";
import { hashPassword } from "../../../../lib/auth/password";
import { signAccessToken, signRefreshToken } from "../../../../lib/auth/jwt";
import { generateOpaqueToken, hashToken } from "../../../../lib/auth/tokens";
import { setAuthCookies } from "../../../../lib/auth/cookies";
import { checkRateLimit } from "../../../../lib/auth/rate-limit";
import { getRequestContext } from "../../../../lib/auth/request-context";
import { logAudit } from "../../../../lib/auth/audit";
import { created, fail, withErrorHandling } from "../../../../lib/auth/response";

const REFRESH_MS = 30 * 24 * 60 * 60 * 1000;

export const POST = withErrorHandling("auth/signup/customer", async (req: NextRequest) => {
  const { ip, userAgent } = getRequestContext(req);

  // Rate limit: 3 signups per IP per 10 minutes.
  const rl = checkRateLimit(`signup:customer:${ip}`, 3, 10 * 60 * 1000);
  if (!rl.success) {
    return fail("RATE_LIMITED", "Too many signup attempts. Try again later.", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON body.", 400);
  }
  const parsed = customerSignupSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.", 400);
  }
  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return fail(
      "VALIDATION_ERROR",
      "An account with this email already exists. Sign in instead.",
      400
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      phone: phone ?? "",
      passwordHash,
      role: "user",
      emailVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    },
  });

  // Issue tokens + set cookies — signup auto-logs the user in.
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: "CUSTOMER",
    isSuperAdmin: false,
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
    metadata: { role: "CUSTOMER" },
    ipAddress: ip,
    userAgent,
  });

  return created({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: "CUSTOMER",
      isSuperAdmin: false,
      vendorStatus: null,
      onboardingComplete: user.onboardingComplete,
    },
    accessToken,
  });
});
