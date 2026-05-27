// Same-origin auth client for the v9-REST endpoints.
//
// All calls use `credentials: "include"` so the HttpOnly auth cookies travel
// on every request. On a 401/TOKEN_EXPIRED response the client transparently
// hits `/api/auth/refresh` once and retries the original request. If the
// refresh fails the original error is returned so the caller can redirect
// to /login.

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

interface AuthClientUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  isSuperAdmin: boolean;
  vendorStatus: string | null;
  onboardingComplete: boolean;
  emailVerified?: boolean;
}

async function rawFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    json = {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Server returned invalid JSON." },
    };
  }
  return json;
}

async function refreshOnce(): Promise<boolean> {
  const r = await rawFetch<{ refreshed: boolean }>(`/api/auth/refresh`, {
    method: "POST",
  });
  return r.success === true;
}

export async function authFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const first = await rawFetch<T>(path, init);
  if (
    first.success === false &&
    first.error?.code === "TOKEN_EXPIRED" &&
    path !== "/api/auth/refresh"
  ) {
    const refreshed = await refreshOnce();
    if (refreshed) {
      return rawFetch<T>(path, init);
    }
  }
  return first;
}

export const authClient = {
  signupCustomer: (input: Record<string, unknown>) =>
    authFetch<{ message: string; email: string }>(
      "/api/auth/signup/customer",
      { method: "POST", body: JSON.stringify(input) }
    ),
  signupVendor: (input: Record<string, unknown>) =>
    authFetch<{ message: string; email: string }>(
      "/api/auth/signup/vendor",
      { method: "POST", body: JSON.stringify(input) }
    ),
  signupAdmin: (input: Record<string, unknown>) =>
    authFetch<{ message: string; email: string }>(
      "/api/auth/signup/admin",
      { method: "POST", body: JSON.stringify(input) }
    ),
  createAdminInvite: (email: string) =>
    authFetch<{ inviteUrl: string; email: string; expiresAt: string }>(
      "/api/admin/invites",
      { method: "POST", body: JSON.stringify({ email }) }
    ),
  login: (email: string, password: string) =>
    authFetch<{ user: AuthClientUser; accessToken: string }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),
  logout: () =>
    authFetch<{ message: string }>("/api/auth/logout", { method: "POST" }),
  me: () => authFetch<{ user: AuthClientUser }>("/api/auth/me"),
  forgot: (email: string) =>
    authFetch<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  reset: (token: string, password: string) =>
    authFetch<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  verifyEmail: (token: string) =>
    authFetch<{ message: string; role: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  resendVerification: (email: string) =>
    authFetch<{ message: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    authFetch<{ message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

export type { AuthClientUser };
