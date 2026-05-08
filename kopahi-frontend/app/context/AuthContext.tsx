"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiUser, api, tokenStore, userStore } from "../lib/api";

type LoginOpts = { remember?: boolean };

type AuthState = {
  user: ApiUser | null;
  loading: boolean;
  login: (email: string, password: string, opts?: LoginOpts) => Promise<ApiUser>;
  register: (payload: RegisterPayload) => Promise<ApiUser>;
  logout: () => void;
  refresh: () => Promise<void>;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "user" | "vendor";
  businessName?: string;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = userStore.get();
    if (cached) setUser(cached);

    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<{ success: boolean; user: ApiUser }>("/api/auth/me", { auth: true })
      .then((res) => {
        if (res?.user) {
          setUser(res.user);
          userStore.set(res.user);
        }
      })
      .catch(() => {
        tokenStore.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = (token: string, u: ApiUser) => {
    tokenStore.set(token);
    userStore.set(u);
    setUser(u);
  };

  const login = useCallback(
    async (email: string, password: string, opts?: LoginOpts) => {
      const res = await api.post<{ success: boolean; token: string; user: ApiUser }>(
        "/api/auth/login",
        { email, password, remember: !!opts?.remember }
      );
      persist(res.token, res.user);
      return res.user;
    },
    []
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await api.post<{ success: boolean; token: string; user: ApiUser }>(
      "/api/auth/register",
      payload
    );
    persist(res.token, res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!tokenStore.get()) return;
    const res = await api.get<{ success: boolean; user: ApiUser }>("/api/auth/me", { auth: true });
    if (res?.user) {
      setUser(res.user);
      userStore.set(res.user);
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
