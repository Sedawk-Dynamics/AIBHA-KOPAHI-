import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import { resendVerificationSchema } from "../../../lib/auth/schemas";
import { generateOpaqueToken, hashToken } from "../../../lib/auth/tokens";
import { checkRateLimit } from "../../../lib/auth/rate-limit";
import { getRequestContext } from "../../../lib/auth/request-context";
import { sendVerificationEmail } from "../../../lib/email/send";
import { ok, fail, withErrorHandling } from "../../../lib/auth/response";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const POST = withErrorHandling("auth/resend-verification", async (req: NextRequest) => {
  const { ip } = getRequestContext(req);

  // 1 resend per 60 seconds per IP (v9-REST §16.1).
  const rl = checkRateLimit(`resend-verif:${ip}`, 1, 60 * 1000);
  if (!rl.success) {
    // Silent success so we don't leak existence via the rate-limit response.
    return ok({ message: "If the account exists and is unverified, a new link has been sent." });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON.", 400);
  }
  const parsed = resendVerificationSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Email is required.", 400);
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  if (user && !user.emailVerified && user.status === "ACTIVE") {
    // Invalidate previous unused tokens.
    await prisma.emailVerificationToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const rawToken = generateOpaqueToken();
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        email: user.email,
        expiresAt: new Date(Date.now() + ONE_DAY_MS),
      },
    });

    sendVerificationEmail({ to: user.email, name: user.name, token: rawToken }).catch((e) =>
      console.error("[auth/resend-verification] email send failed:", e)
    );
  }

  return ok({ message: "If the account exists and is unverified, a new link has been sent." });
});
