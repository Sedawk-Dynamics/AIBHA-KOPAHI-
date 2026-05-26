import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import { forgotPasswordSchema } from "../../../lib/auth/schemas";
import { generateOpaqueToken, hashToken } from "../../../lib/auth/tokens";
import { checkRateLimit } from "../../../lib/auth/rate-limit";
import { getRequestContext } from "../../../lib/auth/request-context";
import { logAudit } from "../../../lib/auth/audit";
import { sendPasswordResetEmail } from "../../../lib/email/send";
import { ok, fail } from "../../../lib/auth/response";

const ONE_HOUR_MS = 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const { ip, userAgent } = getRequestContext(req);

  const rl = checkRateLimit(`forgot:${ip}`, 3, 15 * 60 * 1000);
  const ack = ok({
    message: "If an account exists, a reset email has been sent.",
  });
  if (!rl.success) {
    // Silently succeed — never expose the rate-limit signal here.
    return ack;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON.", 400);
  }
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "A valid email is required.", 400);
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user && user.status === "ACTIVE") {
    // Invalidate previous unused reset tokens.
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const rawToken = generateOpaqueToken();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + ONE_HOUR_MS),
      },
    });

    sendPasswordResetEmail({ to: user.email, name: user.name, token: rawToken }).catch(
      (e) => console.error("[auth/forgot-password] email send failed:", e)
    );
    await logAudit({
      userId: user.id,
      action: "PASSWORD_RESET_REQUESTED",
      ipAddress: ip,
      userAgent,
    });
  }

  return ok({ message: "If an account exists, a reset email has been sent." });
}
