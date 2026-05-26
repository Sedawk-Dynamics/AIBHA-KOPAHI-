import type { NextRequest } from "next/server";
import { prisma } from "../../../lib/db";
import { requireAuth } from "../../../lib/auth/guards";
import { fromDbRole } from "../../../lib/auth/roles";
import { ok, fail } from "../../../lib/auth/response";

export async function GET(_req: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  // Re-fetch from DB rather than trusting the JWT — picks up role changes,
  // vendor approval status updates, etc.
  const fresh = await prisma.user.findUnique({
    where: { id: user!.sub },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isSuperAdmin: true,
      onboardingComplete: true,
      emailVerified: true,
      emailVerifiedAt: true,
      status: true,
      createdAt: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
          storeSlug: true,
          status: true,
        },
      },
    },
  });

  if (!fresh) {
    return fail("NOT_AUTHENTICATED", "User not found.", 401);
  }

  return ok({
    user: {
      ...fresh,
      role: fromDbRole(fresh.role),
    },
  });
}
