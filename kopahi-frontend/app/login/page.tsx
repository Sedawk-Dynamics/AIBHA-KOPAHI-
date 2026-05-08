"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";

const DEMO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEMO === "true";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "DemoPass!2026";
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/40 flex items-center justify-center text-gray-500">
      Loading…
    </main>
  );
}

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState("");

  const next = search?.get("next");
  const registered = search?.get("registered");
  const registeredEmail = search?.get("email");

  // Admin and Vendor pages live in a SEPARATE Vite app at NEXT_PUBLIC_ADMIN_URL.
  // Returns either { external: url } for cross-origin redirect or { internal: path }
  // for in-app navigation.
  const redirectFor = (role?: string): { external: string } | { internal: string } => {
    if (next) return { internal: next };
    if (role === "admin") return { external: `${ADMIN_URL}/admin` };
    if (role === "vendor") return { external: `${ADMIN_URL}/vendor` };
    return { internal: "/dashboard" };
  };

  const goTo = (target: { external: string } | { internal: string }) => {
    if ("external" in target) {
      window.location.href = target.external;
    } else {
      router.push(target.internal);
    }
  };

  const demoRoles = [
    { label: "Admin", email: "admin@kopahi.com", color: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200" },
    { label: "Vendor", email: "vendor@kopahi.com", color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200" },
    { label: "Customer", email: "customer@kopahi.com", color: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password, { remember });
      goTo(redirectFor(user.role));
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Login failed. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: typeof demoRoles[0]) => {
    if (!DEMO_ENABLED) return;
    setEmail(role.email);
    setPassword(DEMO_PASSWORD);
    setError("");
    setLoadingRole(role.label);
    try {
      const user = await login(role.email, DEMO_PASSWORD, { remember: false });
      goTo(redirectFor(user.role));
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Demo login failed. Run npm run seed in the backend first.";
      setError(msg);
      setLoadingRole(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/40 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-0 -left-40 w-96 h-96 bg-green-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-green-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <Link
        href="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors z-10 group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to home
      </Link>

      <div className="bg-white shadow-2xl shadow-green-900/10 rounded-3xl grid md:grid-cols-2 max-w-5xl w-full overflow-hidden border border-gray-100 relative z-10">
        <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
          <Link href="/" className="inline-block mb-8 md:mb-10">
            <h2 className="text-2xl font-bold text-green-700 tracking-tight">
              Kopahi<span className="text-green-500">.</span>
            </h2>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Welcome back
          </h1>

          <p className="text-gray-600 mb-8">
            Sign in to access your customer, vendor or admin dashboard.
          </p>

          {registered === "vendor" && (
            <div
              role="status"
              className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 text-sm px-4 py-3 rounded-lg flex items-start gap-2"
            >
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>
                Vendor account created
                {registeredEmail ? ` for ${registeredEmail}` : ""}. Check your inbox
                for the verification email — you'll need to verify before you can sign in.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2" role="alert">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-green-700 hover:text-green-800 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                Keep me signed in for 30 days{" "}
                <span className="text-gray-400">(otherwise 12 hours)</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !!loadingRole}
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-700/70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-green-700/20 hover:shadow-xl hover:shadow-green-700/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {DEMO_ENABLED && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                Try a demo account · One click
              </p>
              <div className="flex gap-2 flex-wrap">
                {demoRoles.map((role) => {
                  const isLoading = loadingRole === role.label;
                  return (
                    <button
                      key={role.label}
                      type="button"
                      onClick={() => handleDemoLogin(role)}
                      disabled={loading || !!loadingRole}
                      className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 ${role.color}`}
                    >
                      {isLoading ? "Signing in..." : role.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="mt-8 text-sm text-gray-600 text-center md:text-left">
            New to Kopahi?{" "}
            <Link href="/signup" className="text-green-700 hover:text-green-800 font-semibold">
              Create an account
            </Link>
          </p>
        </div>

        <div className="hidden md:block relative bg-gradient-to-br from-green-700 via-green-800 to-green-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&q=80"
            alt="Tea plantation"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-700/90 via-green-800/85 to-green-900/95"></div>

          <div className="relative h-full flex flex-col justify-between p-12 text-white z-10">
            <div>
              <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
                Kopahi Marketplace
              </span>
              <h2 className="text-4xl font-bold leading-tight tracking-tight mb-4">
                Authentic produce from North East India.
              </h2>
              <p className="text-green-100 leading-relaxed text-base">
                Join 10,000+ buyers who trust Kopahi for GI-tagged teas, raw honey, black rice and rare regional spices — sourced directly from farmers.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/15">
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-xs text-green-200">Farmers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-xs text-green-200">Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">30+</p>
                <p className="text-xs text-green-200">Cities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
