// Edge middleware — runs before every page request. Verifies the access
// token via `jose` (jsonwebtoken won't run on the Edge runtime), gates
// /dashboard /onboarding /cart /checkout to authenticated users, redirects
// signed-in users away from /login /signup, and enforces role-based access
// on dashboard sub-routes.

import { NextRequest, NextResponse } from "next/server";
import { verifyAccessTokenEdge } from "./app/lib/auth/jwt-edge";
import type { AccessTokenPayload } from "./app/lib/auth/jwt";

const ACCESS_COOKIE = "kopahi_access";

const GUEST_ONLY = [
  "/login",
  "/signup",
  "/vendor-signup",
  "/forgot-password",
  "/reset-password",
];
const AUTH_REQUIRED = ["/dashboard", "/onboarding", "/cart", "/checkout"];

const ADMIN_ONLY = [
  "/dashboard/approvals",
  "/dashboard/vendors",
  "/dashboard/customers",
  "/dashboard/farmers",
  "/dashboard/content",
  "/dashboard/reports",
  "/dashboard/audit",
  "/dashboard/permissions",
];
const VENDOR_ONLY = [
  "/dashboard/products",
  "/dashboard/inventory",
  "/dashboard/payouts",
  "/dashboard/analytics",
  "/dashboard/store-settings",
];
const CUSTOMER_ONLY = [
  "/dashboard/wishlist",
  "/dashboard/addresses",
  "/dashboard/reviews",
];

function matchesAny(path: string, list: string[]) {
  return list.some((p) => path === p || path.startsWith(`${p}/`));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ACCESS_COOKIE)?.value ?? null;
  const session: AccessTokenPayload | null = token
    ? await verifyAccessTokenEdge(token)
    : null;

  // 1. Guest-only routes redirect signed-in users to the dashboard.
  if (matchesAny(pathname, GUEST_ONLY) && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Auth-required routes redirect guests to /login with a `next` param.
  if (matchesAny(pathname, AUTH_REQUIRED) && !session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 3. Role-gated routes inside /dashboard.
  if (session && pathname.startsWith("/dashboard")) {
    if (matchesAny(pathname, ADMIN_ONLY) && session.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard?error=forbidden", req.url)
      );
    }
    if (
      matchesAny(pathname, VENDOR_ONLY) &&
      session.role !== "VENDOR" &&
      session.role !== "ADMIN"
    ) {
      return NextResponse.redirect(
        new URL("/dashboard?error=forbidden", req.url)
      );
    }
    if (matchesAny(pathname, CUSTOMER_ONLY) && session.role !== "CUSTOMER") {
      return NextResponse.redirect(
        new URL("/dashboard?error=forbidden", req.url)
      );
    }

    // Vendor with incomplete onboarding → force to the wizard.
    if (
      session.role === "VENDOR" &&
      !session.onboardingComplete &&
      !pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/onboarding/vendor", req.url));
    }
  }

  // 4. Cart/checkout: admin doesn't shop — redirect to dashboard.
  if (
    session?.role === "ADMIN" &&
    (pathname === "/cart" || pathname.startsWith("/checkout"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static assets, _next internals, API routes, and asset extensions.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|webp|avif|svg|ico|gif|mp4|webm)$).*)",
  ],
};
