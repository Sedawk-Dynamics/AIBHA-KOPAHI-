import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";

type LocationState = { from?: { pathname?: string } };

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath =
    (location.state as LocationState | null)?.from?.pathname ?? null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    if (fromPath) return <Navigate to={fromPath} replace />;
    return <Navigate to={user.role === "vendor" ? "/vendor" : "/admin"} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const u = await login(email, password, { remember });
      if (u.role === "user") {
        setError("Customer accounts can't sign into the admin panel.");
        setLoading(false);
        return;
      }
      navigate(fromPath ?? (u.role === "vendor" ? "/vendor" : "/admin"), {
        replace: true,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/40 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-2xl rounded-3xl max-w-md w-full p-8 md:p-10 border border-gray-100">
        <Link
          to="/"
          className="inline-block text-2xl font-bold text-green-700 tracking-tight mb-6"
        >
          Kopahi<span className="text-green-500">.</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          Admin & Vendor Sign-in
        </h1>
        <p className="text-gray-600 mb-8 text-sm">
          Customer accounts should use the main site instead.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="admin@kopahi.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 text-xs text-gray-500 hover:text-gray-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-2 focus:ring-green-500"
            />
            <span className="text-sm text-gray-600">
              Keep me signed in for 30 days
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-70 text-white py-3 rounded-xl font-medium shadow-lg transition"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
