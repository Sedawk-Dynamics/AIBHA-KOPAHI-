import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../../lib/auth/jwt";
import { generateOpaqueToken, hashToken } from "../../../lib/auth/tokens";
import {
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "../../../lib/auth/cookies";
import { fromDbRole } from "../../../lib/auth/roles";
import { logAudit } from "../../../lib/auth/audit";
import { ok, fail } from "../../../lib/auth/response";

const REFRESH_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(_req: NextRequest) {
  const refreshToken = await getRefreshTokenFromCookies();
  if (!refreshToken) {
    return fail("NOT_AUTHENTICATED", "No refresh token.", 401);
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return fail("TOKEN_INVALID", "Invalid refresh token.", 401);
  }

  const row = await prisma.refreshToken.findUnique({
    where: { id: payload.jti },
    include: {
      user: { include: { vendor: { select: { status: true } } } },
    },
  });

  if (!row || row.revokedAt || row.expiresAt < new Date()) {
    return fail("TOKEN_EXPIRED", "Refresh token expired or revoked.", 401);
  }

  const user = row.user;
  const appRole = fromDbRole(user.role);

  const newAccess = signAccessToken({
    sub: user.id,
    email: user.email,
    role: appRole,
    isSuperAdmin: user.isSuperAdmin,
    vendorStatus: user.vendor?.status ?? null,
    onboardingComplete: user.onboardingComplete,
  });

  // Rotate the refresh token: issue new, revoke old.
  const newOpaque = generateOpaqueToken();
  const newRow = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(newOpaque),
      expiresAt: new Date(Date.now() + REFRESH_MS),
      userAgent: row.userAgent,
      ipAddress: row.ipAddress,
    },
  });
  await prisma.refreshToken.update({
    where: { id: row.id },
    data: { revokedAt: new Date() },
  });
  const newRefresh = signRefreshToken(user.id, newRow.id);

  await setAuthCookies(newAccess, newRefresh);
  await logAudit({ userId: user.id, action: "TOKEN_REFRESHED" });

  return ok({ refreshed: true, accessToken: newAccess });
}
