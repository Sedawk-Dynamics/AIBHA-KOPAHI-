import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import { changePasswordSchema } from "../../../lib/auth/schemas";
import { hashPassword, verifyPassword } from "../../../lib/auth/password";
import { requireAuth } from "../../../lib/auth/guards";
import { clearAuthCookies } from "../../../lib/auth/cookies";
import { logAudit } from "../../../lib/auth/audit";
import { sendPasswordChangedNotification } from "../../../lib/email/send";
import { ok, fail } from "../../../lib/auth/response";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON.", 400);
  }
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      "VALIDATION_ERROR",
      parsed.error.issues[0]?.message ?? "Invalid input.",
      400
    );
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user!.sub } });
  if (!dbUser) {
    return fail("NOT_AUTHENTICATED", "User not found.", 401);
  }

  const validCurrent = await verifyPassword(
    parsed.data.currentPassword,
    dbUser.passwordHash
  );
  if (!validCurrent) {
    return fail("INVALID_CREDENTIALS", "Current password is incorrect.", 400);
  }

  const newHash = await hashPassword(parsed.data.newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: dbUser.id },
      data: {
        passwordHash: newHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
    // Revoke every refresh token — including the current session's.
    prisma.refreshToken.updateMany({
      where: { userId: dbUser.id, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  // Drop cookies so the user has to sign back in.
  await clearAuthCookies();

  await logAudit({ userId: dbUser.id, action: "PASSWORD_CHANGED" });
  sendPasswordChangedNotification({ to: dbUser.email, name: dbUser.name }).catch(
    (e) => console.error("[auth/change-password] notification send failed:", e)
  );

  return ok({ message: "Password changed. Please sign in again." });
}
