import type { NextRequest } from "next/server";
import { prisma } from "../../../../lib/db";
import { vendorSignupSchema } from "../../../../lib/auth/schemas";
import { hashPassword } from "../../../../lib/auth/password";
import { generateOpaqueToken, hashToken } from "../../../../lib/auth/tokens";
import { checkRateLimit } from "../../../../lib/auth/rate-limit";
import { getRequestContext } from "../../../../lib/auth/request-context";
import { logAudit } from "../../../../lib/auth/audit";
import { sendVerificationEmail } from "../../../../lib/email/send";
import { created, fail, withErrorHandling } from "../../../../lib/auth/response";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function generateUniqueStoreSlug(businessName: string): Promise<string> {
  const base = slugify(businessName) || "kopahi-store";
  for (let i = 0; i < 6; i++) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const collision = await prisma.vendor.findUnique({ where: { storeSlug: candidate } });
    if (!collision) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export const POST = withErrorHandling("auth/signup/vendor", async (req: NextRequest) => {
  const { ip, userAgent } = getRequestContext(req);

  const rl = checkRateLimit(`signup:vendor:${ip}`, 3, 10 * 60 * 1000);
  if (!rl.success) {
    return fail("RATE_LIMITED", "Too many signup attempts. Try again later.", 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("VALIDATION_ERROR", "Invalid JSON body.", 400);
  }
  const parsed = vendorSignupSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input.", 400);
  }
  const { name, email, phone, password, businessName, state } = parsed.data;

  const ack = {
    message: "Vendor account created. Check your email to verify, then complete onboarding.",
    email,
  };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return created(ack);
  }

  const passwordHash = await hashPassword(password);
  const storeSlug = await generateUniqueStoreSlug(businessName);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      phone,
      passwordHash,
      role: "vendor",
      businessName, // also kept on User row for backward compat with Express
      vendor: {
        create: {
          businessName,
          storeSlug,
          state,
          status: "PENDING_REVIEW",
        },
      },
    },
    include: { vendor: true },
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

  sendVerificationEmail({ to: email, name, token: rawToken }).catch((e) =>
    console.error("[auth/signup/vendor] email send failed:", e)
  );

  await logAudit({
    userId: user.id,
    action: "SIGN_UP",
    metadata: { role: "VENDOR", businessName, state },
    ipAddress: ip,
    userAgent,
  });

  return created(ack);
});
