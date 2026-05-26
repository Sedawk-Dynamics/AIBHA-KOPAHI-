import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import { resetPasswordSchema } from "../../../lib/auth/schemas";
import { hashPassword } from "../../../lib/auth/password";
import { hashToken } from "../../../lib/auth/tokens";
import { logAudit } from "../../../lib/auth/audit";
import { sendPasswordChangedNotification } from "../../../lib/email/send";
import { ok, fail, withErrorHandling } from "../../../lib/auth/response";

export const POST = withErrorHandling("auth/reset-password", async (req: NextRequest) => {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON.", 400);
  }
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      "VALIDATION_ERROR",
      parsed.error.issues[0]?.message ?? "Invalid input.",
      400
    );
  }
  const { token, password } = parsed.data;

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!record) {
    return fail("TOKEN_INVALID", "Reset link is invalid.", 400);
  }
  if (record.usedAt) {
    return fail("TOKEN_ALREADY_USED", "This link was already used.", 400);
  }
  if (record.expiresAt < new Date()) {
    return fail("TOKEN_EXPIRED", "This link has expired.", 400);
  }

  const newHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        passwordHash: newHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    // Revoke every active refresh token — force re-login everywhere.
    prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  await logAudit({
    userId: record.userId,
    action: "PASSWORD_RESET_COMPLETED",
  });

  sendPasswordChangedNotification({
    to: record.user.email,
    name: record.user.name,
  }).catch((e) =>
    console.error("[auth/reset-password] notification send failed:", e)
  );

  return ok({ message: "Password updated. Please sign in." });
});
