// Route handler guards — gate a request by authentication / role / vendor
// approval. All return either `{ user }` (success) or `{ error }` (a
// NextResponse you should `return` directly from the handler).

import type { NextResponse } from "next/server";
import { verifyAccessToken, type AccessTokenPayload } from "./jwt";
import { getAccessTokenFromCookies } from "./cookies";
import { fail } from "./response";
import type { AppRole } from "./roles";

interface GuardResult {
  user?: AccessTokenPayload;
  error?: NextResponse;
}

export async function requireAuth(): Promise<GuardResult> {
  const token = await getAccessTokenFromCookies();
  if (!token) {
    return { error: fail("NOT_AUTHENTICATED", "Sign in to continue.", 401) };
  }
  try {
    const user = verifyAccessToken(token);
    return { user };
  } catch (e: unknown) {
    const name = (e as { name?: string })?.name;
    if (name === "TokenExpiredError") {
      return {
        error: fail("TOKEN_EXPIRED", "Session expired. Please refresh.", 401),
      };
    }
    return { error: fail("TOKEN_INVALID", "Invalid session.", 401) };
  }
}

export async function requireRole(
  roles: AppRole | AppRole[]
): Promise<GuardResult> {
  const result = await requireAuth();
  if (result.error) return result;
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(result.user!.role)) {
    return {
      error: fail(
        "FORBIDDEN",
        `This action requires ${allowed.join(" or ")} role.`,
        403
      ),
    };
  }
  return { user: result.user };
}

export async function requireApprovedVendor(): Promise<GuardResult> {
  const result = await requireRole("VENDOR");
  if (result.error) return result;
  if (result.user!.vendorStatus !== "APPROVED") {
    return {
      error: fail(
        "FORBIDDEN",
        "Your vendor account is pending approval.",
        403
      ),
    };
  }
  return { user: result.user };
}

export async function requireSuperAdmin(): Promise<GuardResult> {
  const result = await requireRole("ADMIN");
  if (result.error) return result;
  if (!result.user!.isSuperAdmin) {
    return { error: fail("FORBIDDEN", "Super-admin required.", 403) };
  }
  return { user: result.user };
}
