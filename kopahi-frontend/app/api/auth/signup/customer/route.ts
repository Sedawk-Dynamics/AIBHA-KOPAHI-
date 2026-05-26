import type { NextRequest } from "next/server";
import { prisma } from "../../../../lib/db";
import { customerSignupSchema } from "../../../../lib/auth/schemas";
import { hashPassword } from "../../../../lib/auth/password";
import { generateOpaqueToken, hashToken } from "../../../../lib/auth/tokens";
import { checkRateLimit } from "../../../../lib/auth/rate-limit";
import { getRequestContext } from "../../../../lib/auth/request-context";
import { logAudit } from "../../../../lib/auth/audit";
import { sendVerificationEmail } from "../../../../lib/email/send";
import { created, fail, withErrorHandling } from "../../../../lib/auth/response";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

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

  // Anti-enumeration: identical response whether email is new or existing.
  const ack = {
    message: "Account created. Check your email to verify.",
    email,
  };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return created(ack);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      phone: phone ?? "",
      passwordHash,
      role: "user", // Postgres enum value
    },
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

  // Fire-and-forget email send.
  sendVerificationEmail({ to: email, name, token: rawToken }).catch((e) =>
    console.error("[auth/signup/customer] email send failed:", e)
  );

  await logAudit({
    userId: user.id,
    action: "SIGN_UP",
    metadata: { role: "CUSTOMER" },
    ipAddress: ip,
    userAgent,
  });

  return created(ack);
});
