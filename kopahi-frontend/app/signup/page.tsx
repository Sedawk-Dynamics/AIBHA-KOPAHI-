"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authClient } from "../lib/authClient";

const TAGLINES = [
  "Where every leaf has a name.",
  "From seven sister states to your kitchen.",
  "Authentic by geography. Pure by nature.",
];

const CUSTOMER_BENEFITS = [
  "Direct sourcing from 500+ verified farmers",
  "GI-tagged authentic NE produce",
  "Pan-India shipping with order tracking",
  "10% off your first order",
  "Trusted by 10,000+ customers",
];

const VENDOR_BENEFITS = [
  "Reach 10,000+ buyers across India",
  "Direct-to-farmer pricing tools",
  "Weekly payouts via UPI / bank",
  "GI verification support",
  "Free onboarding consultation",
];

const passwordPolicy = (pw: string): string | null => {
  if (pw.length < 12) return "At least 12 characters.";
  if (!/[a-z]/.test(pw)) return "Add a lowercase letter.";
  if (!/[A-Z]/.test(pw)) return "Add an uppercase letter.";
  if (!/[0-9]/.test(pw)) return "Add a digit.";
  if (!/[^a-zA-Z0-9]/.test(pw)) return "Add a symbol.";
  return null;
};

function passwordStrength(pw: string) {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const label = ["Too short", "Weak", "Fair", "Good", "Strong", "Strong"][score];
  return { score, label };
}

type Role = "customer" | "vendor" | "admin";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupInner />
    </Suspense>
  );
}

function SignupInner() {
  const router = useRouter();
  const search = useSearchParams();
  const { register } = useAuth();

  const inviteParam = search?.get("invite");
  const adminInvite = !!inviteParam;

  const [role, setRole] = useState<Role>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agreedToTerms: false,
  });

  const update = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const [tagIndex, setTagIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTagIndex((i) => (i + 1) % TAGLINES.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  const benefits = role === "vendor" ? VENDOR_BENEFITS : CUSTOMER_BENEFITS;
  const headingAccent = useMemo(() => (role === "vendor" ? "Direct." : "Fair."), [role]);
  const subhead =
    role === "vendor"
      ? "List your produce and reach buyers across India and beyond."
      : "Shop authentic GI-tagged North East produce, direct from farmers.";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name, please.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.phone.trim()) e.phone = "Phone helps us reach you.";
    else if (!/^\+?[\d\s-]{10,}$/.test(form.phone)) e.phone = "Please check the phone number.";
    if (!form.password) e.password = "Password is required.";
    else {
      const reason = passwordPolicy(form.password);
      if (reason) e.password = reason;
    }
    if (!form.agreedToTerms) e.agreedToTerms = "Please accept the terms to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (role === "vendor") {
      router.push("/vendor-signup");
      return;
    }
    if (!validate()) return;
    setLoading(true);
    try {
      if (role === "admin") {
        if (!inviteParam) {
          throw new Error(
            "Admin signup requires a valid invite link. Ask another admin to issue one."
          );
        }
        const res = await authClient.signupAdmin({
          token: inviteParam,
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          acceptTerms: true,
        });
        if (!res.success) {
          throw new Error(res.error?.message ?? "Admin signup failed.");
        }
        // Admin signup is invite-gated and bypasses email verification, so
        // the new admin can sign in immediately.
        router.push(
          `/login?registered=admin&email=${encodeURIComponent(form.email)}`
        );
        return;
      }
      const registered = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      // The hardened backend returns ack-only — no auto-login. Send the
      // visitor to the "check your inbox" screen with their email pre-filled.
      // If the backend kept legacy behavior and returned a session, we still
      // land them on the dashboard.
      router.push(
        registered
          ? "/dashboard"
          : `/verify-email?email=${encodeURIComponent(form.email)}`
      );
    } catch (err) {
      // Surface the actual server message — AuthContext.register throws a
      // plain Error whose message comes from the API response envelope.
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Signup failed. Please try again.";
      setSubmitError(msg);
      setLoading(false);
    }
  };

  const strength = passwordStrength(form.password);

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-(--color-ivory) text-(--color-ink)">
      <section className="relative px-6 sm:px-10 lg:px-16 py-12 flex flex-col justify-center">
        <div className="absolute top-6 left-6 right-6 sm:top-10 sm:left-10 sm:right-10 flex items-center justify-between">
          <Link href="/" className="font-display text-xl text-(--color-moss)">
            Kopahi<span className="text-(--color-gold)">.</span>
          </Link>
          <Link href="/" className="text-xs uppercase tracking-[0.22em] text-(--color-bamboo) hover:text-(--color-moss) transition-colors">
            ← Back to home
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md mt-16 sm:mt-0">
          <div className="inline-flex border border-(--color-bamboo)/30">
            {(
              [
                { value: "customer", label: "Shop as Customer" },
                { value: "vendor", label: "Sell as Vendor" },
                ...(adminInvite ? [{ value: "admin", label: "Apply for Admin" }] : []),
              ] as { value: Role; label: string }[]
            ).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setRole(t.value)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors ${
                  role === t.value
                    ? "bg-(--color-moss) text-(--color-ivory)"
                    : "text-(--color-ink)/70 hover:text-(--color-moss)"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="eyebrow mt-8">→ Join the Kopahi family</p>
          <h1 className="mt-5 font-display font-light tracking-tight text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05]">
            Authentic. Direct. <span className="accent-italic">{headingAccent}</span>
          </h1>
          <p className="mt-4 text-(--color-ink)/70 leading-relaxed">{subhead}</p>

          <ul className="mt-8 grid grid-cols-1 gap-2 text-sm text-(--color-ink)/80">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-(--color-gold) shrink-0 mt-1.5">
                  <path d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9z" fill="currentColor" />
                </svg>
                {b}
              </li>
            ))}
          </ul>

          {role === "vendor" ? (
            <div className="mt-10 border border-(--color-bamboo)/25 bg-white p-6 sm:p-8">
              <p className="font-display text-2xl text-(--color-ink) leading-snug">
                Vendor onboarding has a dedicated form with GI verification &amp; payout setup.
              </p>
              <p className="mt-3 text-(--color-ink)/70 text-sm leading-relaxed">
                It takes about three minutes. You can save and continue at any time.
              </p>
              <Link
                href="/vendor-signup"
                className="mt-6 inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Continue to vendor onboarding <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
              <Field id="name" label="Full name" error={errors.name}>
                <input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" className="kp-input" />
              </Field>
              <Field id="email" label="Email" error={errors.email}>
                <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" className="kp-input" />
              </Field>
              <Field id="phone" label="Phone" error={errors.phone}>
                <input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" className="kp-input" />
              </Field>
              <Field id="password" label="Password" error={errors.password}>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    autoComplete="new-password"
                    className="kp-input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-(--color-bamboo) hover:text-(--color-moss) px-2 text-xs uppercase tracking-[0.18em]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-(--color-bamboo)/15">
                      <div className="h-full bg-(--color-gold) transition-all" style={{ width: `${(strength.score / 5) * 100}%` }} />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-(--color-bamboo)">{strength.label}</span>
                  </div>
                )}
              </Field>

              <label className="flex items-start gap-3 text-sm text-(--color-ink)/80 cursor-pointer select-none">
                <span
                  className={`inline-block h-4 w-4 mt-0.5 border shrink-0 ${
                    form.agreedToTerms ? "bg-(--color-gold) border-(--color-gold)" : "border-(--color-bamboo)/40"
                  }`}
                  aria-hidden="true"
                />
                <input
                  type="checkbox"
                  checked={form.agreedToTerms}
                  onChange={(e) => update("agreedToTerms", e.target.checked)}
                  className="sr-only"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-(--color-gold-dark) hover:text-(--color-gold) underline">terms</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-(--color-gold-dark) hover:text-(--color-gold) underline">privacy policy</Link>.
                </span>
              </label>
              {errors.agreedToTerms && <p className="text-xs text-(--color-gold-dark) -mt-3">{errors.agreedToTerms}</p>}

              {submitError && <p role="alert" className="text-sm text-(--color-chilli)">{submitError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors disabled:opacity-60"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>

              <p className="mt-2 text-xs italic text-(--color-bamboo) flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-(--color-gold)">
                  <path d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9z" fill="currentColor" />
                </svg>
                Get 10% off your first order — code applied at checkout.
              </p>
            </form>
          )}

          <p className="mt-10 text-sm text-(--color-ink)/70">
            Already have an account?{" "}
            <Link href="/login" className="text-(--color-gold-dark) hover:text-(--color-gold) uppercase tracking-[0.22em] text-xs ml-1">
              Sign in →
            </Link>
          </p>
        </div>

        <style jsx>{`
          :global(.kp-input) {
            width: 100%;
            background: transparent;
            border-bottom: 1px solid color-mix(in srgb, var(--color-bamboo) 45%, transparent);
            padding: 0.75rem 0;
            color: var(--color-ink);
            outline: none;
            transition: border-color 0.2s;
          }
          :global(.kp-input:focus) {
            border-color: var(--color-gold);
          }
        `}</style>
      </section>

      <aside className="hidden lg:block relative overflow-hidden">
        <Image
          src="/products/muga-silk-stole.jpg"
          alt="A Muga silk weaver's loom in Sualkuchi"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-(--color-moss-dark)/30 via-(--color-moss-dark)/20 to-(--color-moss-dark)/85" />
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

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block eyebrow mb-2">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-(--color-gold-dark)">{error}</p>}
    </div>
  );
}
