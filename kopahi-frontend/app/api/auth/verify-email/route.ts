import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import { verifyEmailSchema } from "../../../lib/auth/schemas";
import { hashToken } from "../../../lib/auth/tokens";
import { logAudit } from "../../../lib/auth/audit";
import { fromDbRole } from "../../../lib/auth/roles";
import { ok, fail } from "../../../lib/auth/response";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON.", 400);
  }
  const parsed = verifyEmailSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Token is required.", 400);
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
    include: { user: true },
  });

  if (!record) {
    return fail("TOKEN_INVALID", "Verification link is invalid.", 400);
  }
  if (record.usedAt) {
    return fail("TOKEN_ALREADY_USED", "This link was already used.", 400);
  }
  if (record.expiresAt < new Date()) {
    return fail("TOKEN_EXPIRED", "This link has expired.", 400);
  }

  const now = new Date();
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true, emailVerifiedAt: now },
    }),
    prisma.emailVerificationToken.update({
      where: { id: record.id },
      data: { usedAt: now },
    }),
  ]);

  await logAudit({ userId: record.userId, action: "EMAIL_VERIFIED" });

  return ok({
    message: "Email verified. You can now sign in.",
    role: fromDbRole(record.user.role),
  });
}
