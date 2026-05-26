import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import { verifyRefreshToken } from "../../../lib/auth/jwt";
import {
  clearAuthCookies,
  getRefreshTokenFromCookies,
} from "../../../lib/auth/cookies";
import { getRequestContext } from "../../../lib/auth/request-context";
import { logAudit } from "../../../lib/auth/audit";
import { ok, withErrorHandling } from "../../../lib/auth/response";

export const POST = withErrorHandling("auth/logout", async (req: NextRequest) => {
  const { ip, userAgent } = getRequestContext(req);
  const refreshToken = await getRefreshTokenFromCookies();

  if (refreshToken) {
    try {
      const { sub, jti } = verifyRefreshToken(refreshToken);
      await prisma.refreshToken
        .update({ where: { id: jti }, data: { revokedAt: new Date() } })
        .catch(() => undefined); // already revoked / missing — no-op
      await logAudit({
        userId: sub,
        action: "SIGN_OUT",
        ipAddress: ip,
        userAgent,
      });
    } catch {
      // Token invalid — still clear cookies and return success.
    }
  }

  await clearAuthCookies();
  return ok({ message: "Logged out." });
});
