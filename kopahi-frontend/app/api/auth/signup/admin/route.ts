import type { NextRequest } from "next/server";
import { prisma } from "../../../../lib/db";
import { adminSignupSchema } from "../../../../lib/auth/schemas";
import { hashPassword } from "../../../../lib/auth/password";
import { hashToken } from "../../../../lib/auth/tokens";
import { checkRateLimit } from "../../../../lib/auth/rate-limit";
import { getRequestContext } from "../../../../lib/auth/request-context";
import { logAudit } from "../../../../lib/auth/audit";
import { created, fail, withErrorHandling } from "../../../../lib/auth/response";

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
        // Invite-based signup is itself the verification step — the inviter
        // vouched for this email by issuing the token.
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
    await tx.adminInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });
    return u;
  });

  await logAudit({
    userId: user.id,
    action: "SIGN_UP",
    metadata: { role: "ADMIN", invitedBy: invite.invitedBy },
    ipAddress: ip,
    userAgent,
  });

  return created({
    message: "Admin account created. You can sign in now.",
    email,
  });
});
