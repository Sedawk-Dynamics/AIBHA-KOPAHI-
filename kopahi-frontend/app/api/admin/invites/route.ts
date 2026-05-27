import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import { createAdminInviteSchema } from "../../../lib/auth/schemas";
import { generateOpaqueToken, hashToken } from "../../../lib/auth/tokens";
import { requireRole } from "../../../lib/auth/guards";
import { getRequestContext } from "../../../lib/auth/request-context";
import { logAudit } from "../../../lib/auth/audit";
import { created, fail, withErrorHandling } from "../../../lib/auth/response";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const POST = withErrorHandling("admin/invites", async (req: NextRequest) => {
  const { user, error } = await requireRole("ADMIN");
  if (error) return error;

  const { ip, userAgent } = getRequestContext(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON body.", 400);
  }
  const parsed = createAdminInviteSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.", 400);
  }
  const { email } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return fail(
      "VALIDATION_ERROR",
      "A user with this email already exists. Promote them via SQL instead.",
      400
    );
  }

  const rawToken = generateOpaqueToken();
  const invite = await prisma.adminInvite.create({
    data: {
      email,
      tokenHash: hashToken(rawToken),
      invitedBy: user!.sub,
      expiresAt: new Date(Date.now() + SEVEN_DAYS_MS),
    },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const inviteUrl = `${appUrl}/signup?invite=${rawToken}`;

  await logAudit({
    userId: user!.sub,
    action: "SIGN_UP",
    metadata: { kind: "ADMIN_INVITE_ISSUED", targetEmail: email, inviteId: invite.id },
    ipAddress: ip,
    userAgent,
  });

  return created({
    inviteUrl,
    email,
    expiresAt: invite.expiresAt.toISOString(),
  });
});
