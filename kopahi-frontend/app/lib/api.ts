/* Lightweight API client for the Kopahi backend */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TOKEN_KEY = "kopahi_token";
const USER_KEY = "kopahi_user";

export type ApiUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "vendor" | "admin";
  phone?: string;
  businessName?: string;
};

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (typeof window === "undefined") return;
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
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  set(user: ApiUser) {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type ApiOptions = {
  method?: string;
  body?: any;
  auth?: boolean;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export async function apiFetch<T = any>(
  path: string,
  { method = "GET", body, auth = false, headers = {}, signal }: ApiOptions = {}
): Promise<T> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const finalHeaders: Record<string, string> = { ...headers };

  if (!isForm && body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = tokenStore.get();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal,
    });
  } catch (err: any) {
    throw new ApiError(
      err?.message?.includes("fetch")
        ? "Could not reach the server. Is the backend running on " + API_URL + "?"
        : err?.message || "Network error",
      0,
      null
    );
  }

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && data.message) ||
      `Request failed with ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

/* Convenience wrappers */
export const api = {
  get: <T = any>(p: string, opts?: ApiOptions) => apiFetch<T>(p, { ...opts, method: "GET" }),
  post: <T = any>(p: string, body?: any, opts?: ApiOptions) =>
    apiFetch<T>(p, { ...opts, method: "POST", body }),
  put: <T = any>(p: string, body?: any, opts?: ApiOptions) =>
    apiFetch<T>(p, { ...opts, method: "PUT", body }),
  del: <T = any>(p: string, opts?: ApiOptions) => apiFetch<T>(p, { ...opts, method: "DELETE" }),
};
