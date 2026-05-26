"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiUser, tokenStore, userStore } from "../lib/api";
import {
  authClient,
  type AuthClientUser,
  type ApiResponse,
} from "../lib/authClient";

type LoginOpts = { remember?: boolean };

type AuthState = {
  user: ApiUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    opts?: LoginOpts
  ) => Promise<ApiUser>;
  register: (payload: RegisterPayload) => Promise<ApiUser | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  acceptTerms?: boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

// v9-REST returns UPPERCASE roles; legacy dashboard code reads lowercase.
// Translate at the boundary so downstream consumers don't need to change.
function toLegacyRole(role: AuthClientUser["role"]): ApiUser["role"] {
  switch (role) {
    case "ADMIN":
      return "admin";
    case "VENDOR":
      return "vendor";
    default:
      return "user";
  }
}

function toApiUser(u: AuthClientUser): ApiUser {
  return {
    _id: u.id,
    name: u.name,
    email: u.email,
    role: toLegacyRole(u.role),
    phone: u.phone,
  };
}

function unwrap<T>(res: ApiResponse<T>): T {
  if (!res.success) {
    throw new Error(res.error?.message ?? "Request failed.");
  }
  return res.data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = userStore.get();
    if (cached) setUser(cached);

    // Cookies handle session; always probe /me on mount. If unauthenticated
    // it returns NOT_AUTHENTICATED and we just stay logged out.
    authClient
      .me()
      .then((res) => {
        if (res.success) {
          const next = toApiUser(res.data.user);
          setUser(next);
          userStore.set(next);
        } else if (!cached) {
          // No session and no cached user — leave as null.
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string, _opts?: LoginOpts) => {
      const res = await authClient.login(email, password);
      const { user: u, accessToken } = unwrap(res);
      // Mirror the access token into localStorage so the legacy
      // Bearer-header callers in lib/api.ts (cart, orders, wishlist on the
      // Express backend) keep working during the transition. The HttpOnly
      // cookies are the canonical session — this is best-effort fallback.
      tokenStore.set(accessToken);
      const next = toApiUser(u);
      userStore.set(next);
      setUser(next);
      return next;
    },
    []
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    // Anti-enumeration: signup endpoints always return ack-only. Caller
    // must redirect to /verify-email and wait for the inbox link.
    const res = await authClient.signupCustomer({
      ...payload,
      acceptTerms: payload.acceptTerms ?? true,
    });
    if (!res.success) {
      throw new Error(res.error?.message ?? "Signup failed.");
    }
    return null;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authClient.logout();
    } catch {
      // Swallow — local state is the source of truth for the next render.
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const res = await authClient.me();
    if (res.success) {
      const next = toApiUser(res.data.user);
      setUser(next);
      userStore.set(next);
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
