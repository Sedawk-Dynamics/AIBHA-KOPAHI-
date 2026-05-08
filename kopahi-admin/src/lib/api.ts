import axios, { AxiosError } from "axios";

const TOKEN_KEY = "kopahi_token";
const USER_KEY = "kopahi_user";

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

export const toApiError = (err: unknown): ApiError => {
  if (err instanceof ApiError) return err;
  const ax = err as AxiosError<{ message?: string }>;
  if (ax.response) {
    const message =
      ax.response.data?.message ?? `Request failed with ${ax.response.status}`;
    return new ApiError(message, ax.response.status, ax.response.data);
  }
  if (ax.request) {
    return new ApiError(`Could not reach the server at ${baseURL}`, 0, null);
  }
  return new ApiError((err as Error)?.message ?? "Unknown error", 0, null);
};

export type ApiUser = {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: "user" | "vendor" | "admin";
  phone?: string;
  businessName?: string;
};

export const tokenStore = {
  get: (): string | null =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (t: string): void => localStorage.setItem(TOKEN_KEY, t),
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const userStore = {
  get(): ApiUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ApiUser;
    } catch {
      return null;
    }
  },
  set(u: ApiUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  },
};
