import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, toApiError, tokenStore, userStore, type ApiUser } from "../lib/api";

type LoginOpts = { remember?: boolean };

type AuthState = {
  user: ApiUser | null;
  loading: boolean;
  login: (email: string, password: string, opts?: LoginOpts) => Promise<ApiUser>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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
      .get<{ success: boolean; user: ApiUser }>("/api/auth/me")
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
          userStore.set(res.data.user);
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
      try {
        const res = await api.post<{
          success: boolean;
          token: string;
          user: ApiUser;
        }>("/api/auth/login", {
          email,
          password,
          remember: !!opts?.remember,
        });
        persist(res.data.token, res.data.user);
        return res.data.user;
      } catch (err) {
        throw toApiError(err);
      }
    },
    []
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!tokenStore.get()) return;
    const res = await api.get<{ success: boolean; user: ApiUser }>(
      "/api/auth/me"
    );
    if (res.data?.user) {
      setUser(res.data.user);
      userStore.set(res.data.user);
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, loading, login, logout, refresh }),
    [user, loading, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
