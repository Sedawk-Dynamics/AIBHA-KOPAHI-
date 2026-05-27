"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
// useEffect retained for the rotating tagline interval.
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

const DEMO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEMO === "true";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "DemoPass!2026";

const TAGLINES = [
  "Where every leaf has a name.",
  "From seven sister states to your kitchen.",
  "Authentic by geography. Pure by nature.",
];

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { login } = useAuth();

  const next = search?.get("next");
  const registered = search?.get("registered");
  const prefilledEmail = search?.get("email") ?? "";

  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [tagIndex, setTagIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTagIndex((i) => (i + 1) % TAGLINES.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please enter both email and password.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    setLoading(true);
    try {
      await login(email, password, { remember });
      router.push(next || "/dashboard");
    } catch (err) {
      // Surface the actual server message — AuthContext.login throws a
      // plain Error whose message comes from the API response envelope.
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Login failed. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  const demoLogin = async (role: { label: string; email: string }) => {
    if (!DEMO_ENABLED) {
      setError("Demo logins are disabled in this environment.");
      return;
    }
    setEmail(role.email);
    setPassword(DEMO_PASSWORD);
    setError("");
    setLoadingRole(role.label);
    try {
      await login(role.email, DEMO_PASSWORD, { remember: false });
      router.push(next || "/dashboard");
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Demo login failed. Seed the backend (npm run seed) and confirm NEXT_PUBLIC_ENABLE_DEMO=true.";
      setError(msg);
      setLoadingRole(null);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-(--color-ivory) text-(--color-ink)">
      {/* LEFT — form panel */}
      <section className="relative flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12">
        <div className="absolute top-6 left-6 right-6 sm:top-10 sm:left-10 sm:right-10 flex items-center justify-between">
          <Link href="/" className="font-display text-xl text-(--color-moss)">
            Kopahi<span className="text-(--color-gold)">.</span>
          </Link>
          <Link href="/" className="text-xs uppercase tracking-[0.22em] text-(--color-bamboo) hover:text-(--color-moss) transition-colors">
            ← Back to home
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md mt-16 sm:mt-0">
          <p className="eyebrow">→ Welcome back</p>
          <h1 className="mt-5 font-display font-light tracking-tight text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05]">
            Sign in to <span className="accent-italic">Kopahi.</span>
          </h1>
          <p className="mt-4 text-(--color-ink)/70 max-w-md leading-relaxed">
            Access your customer, vendor or admin dashboard.
          </p>

          {registered && (
            <div role="status" className="mt-6 border border-(--color-gold)/40 bg-(--color-gold)/10 px-5 py-4 text-sm text-(--color-moss)">
              Your account is ready. Sign in to continue.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label htmlFor="email" className="block eyebrow mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-transparent border-b border-(--color-bamboo)/40 focus:border-(--color-gold) outline-none py-3 text-(--color-ink) placeholder:text-(--color-ink)/40"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label htmlFor="password" className="eyebrow">Password</label>
                <Link href="/forgot-password" className="text-[11px] uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold)">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-transparent border-b border-(--color-bamboo)/40 focus:border-(--color-gold) outline-none py-3 pr-10 text-(--color-ink)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-(--color-bamboo) hover:text-(--color-moss) px-2"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-(--color-ink)/75 cursor-pointer select-none">
              <span
                className={`inline-block h-4 w-4 border ${
                  remember ? "bg-(--color-gold) border-(--color-gold)" : "border-(--color-bamboo)/40"
                }`}
                aria-hidden="true"
              />
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="sr-only"
              />
              Keep me signed in
            </label>

            {error && <p role="alert" className="text-sm text-(--color-chilli)">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <p className="mt-2 text-center text-sm text-(--color-ink)/70">
              Forgot your password?{" "}
              <Link
                href="/forgot-password"
                className="text-(--color-gold-dark) hover:text-(--color-gold) uppercase tracking-[0.22em] text-xs ml-1"
              >
                Reset it →
              </Link>
            </p>
          </form>

          {DEMO_ENABLED && (
            <div className="mt-10">
              <div className="flex items-center gap-4 text-(--color-bamboo)">
                <span className="flex-1 h-px bg-(--color-bamboo)/30" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.22em]">Try a demo · one click</span>
                <span className="flex-1 h-px bg-(--color-bamboo)/30" aria-hidden="true" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Admin", email: "admin@kopahi.com" },
                  { label: "Vendor", email: "vendor@kopahi.com" },
                  { label: "Customer", email: "customer@kopahi.com" },
                ].map((role) => (
                  <button
                    key={role.label}
                    type="button"
                    onClick={() => demoLogin(role)}
                    disabled={loading || !!loadingRole}
                    className="px-4 py-3 border border-(--color-bamboo)/30 text-[12px] uppercase tracking-[0.18em] text-(--color-ink) hover:border-(--color-gold) hover:text-(--color-moss) transition-colors disabled:opacity-60"
                  >
                    {loadingRole === role.label ? "…" : role.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-10 text-sm text-(--color-ink)/70">
            New to Kopahi?{" "}
            <Link href="/signup" className="text-(--color-gold-dark) hover:text-(--color-gold) uppercase tracking-[0.22em] text-xs ml-1">
              Create an account →
            </Link>
          </p>
        </div>
      </section>

      {/* RIGHT — image + rotating tagline */}
      <aside className="hidden lg:block relative overflow-hidden">
        <Image
          src="/products/tea-garden.jpg"
          alt="A tea garden in Jorhat, Assam"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-(--color-moss-dark)/30 via-(--color-moss-dark)/20 to-(--color-moss-dark)/80" />
        <div className="absolute inset-0 grain" />
        <div className="absolute inset-x-0 bottom-0 p-12 lg:p-16">
          <p className="eyebrow text-(--color-gold)">Kopahi · A note</p>
          <p
            key={tagIndex}
            className="mt-5 font-display italic text-[clamp(2rem,3.5vw,3rem)] leading-tight text-(--color-ivory)"
            style={{ animation: "fadeUp 0.8s ease-out" }}
          >
            “{TAGLINES[tagIndex]}”
          </p>
        </div>
        <style jsx>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </aside>
    </main>
  );
}
