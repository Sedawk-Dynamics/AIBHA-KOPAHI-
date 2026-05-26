// Auth cookie management.
//
// We set two HttpOnly cookies on every successful login:
//   - kopahi_access  (short-lived, 15m, path=/) — carries the JWT used by
//                    the Route Handler guards and the Edge middleware.
//   - kopahi_refresh (long-lived, 30d, path=/api/auth) — used only by the
//                    `/api/auth/refresh` route. Restricted path means the
//                    refresh token is NOT sent on regular page navigations.
//
// Next.js 16 made `cookies()` async — every helper here returns / awaits the
// cookie store accordingly.

import { cookies } from "next/headers";

export const ACCESS_COOKIE = "kopahi_access";
export const REFRESH_COOKIE = "kopahi_refresh";

const IS_PROD = process.env.NODE_ENV === "production";
const ACCESS_MAX_AGE = 15 * 60; // 15 minutes
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: REFRESH_MAX_AGE,
  });
}

export async function setAccessCookie(accessToken: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  // The refresh cookie lives at /api/auth — delete must match the path.
  store.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 0,
  });
}

export async function getAccessTokenFromCookies(): Promise<string | null> {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshTokenFromCookies(): Promise<string | null> {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null;
}
