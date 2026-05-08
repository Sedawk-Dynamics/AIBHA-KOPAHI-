"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "../lib/api";

/* ============================================================
   VENDOR SIGNUP — POST /api/auth/register-vendor
   Vendors must verify their email before they can sign in
   (backend gate). On success we send them to /login with a
   ?registered=vendor flag so the login page can show a notice.
   File: app/vendor-signup/page.tsx
============================================================ */

const passwordPolicy = (pw: string): string | null => {
  if (pw.length < 12) return "Password must be at least 12 characters";
  if (!/[a-z]/.test(pw)) return "Password must contain a lowercase letter";
  if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter";
  if (!/[0-9]/.test(pw)) return "Password must contain a digit";
  if (!/[^a-zA-Z0-9]/.test(pw)) return "Password must contain a symbol";
  return null;
};

export default function VendorSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    gstNumber: "",
    agreedToTerms: false,
  });

  const update = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(form.phone)) newErrors.phone = "Please enter a valid phone number";
    if (!form.password) newErrors.password = "Password is required";
    else {
      const reason = passwordPolicy(form.password);
      if (reason) newErrors.password = reason;
    }
    if (!form.agreedToTerms) newErrors.agreedToTerms = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setLoading(true);

    try {
      await api.post("/api/auth/register-vendor", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        businessName: form.businessName,
        // gstNumber is not yet a schema column but the backend captures it in the audit log.
        gstNumber: form.gstNumber || undefined,
      });
      // Backend doesn't return a token — vendors must verify email first.
      router.push(`/login?registered=vendor&email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not create your vendor account. Please try again.";
      setSubmitError(msg);
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const map = [
      { label: "Too weak", color: "bg-red-500", width: "25%" },
      { label: "Weak", color: "bg-orange-500", width: "50%" },
      { label: "Good", color: "bg-yellow-500", width: "75%" },
      { label: "Strong", color: "bg-green-500", width: "100%" },
    ];
    return map[Math.max(0, score - 1)] || map[0];
  };

  const strength = passwordStrength();

  return (
    <main className="min-h-screen bg-white flex">
      {/* LEFT — branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Image src="/Logo1.png" alt="Kopahi" width={120} height={120} className="h-14 w-14 object-contain drop-shadow-lg group-hover:scale-105 transition-transform" />
            <span className="text-3xl font-bold tracking-tight">Kopahi<span className="text-amber-300">.</span></span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 tracking-tight">
            Sell on Kopahi.
            <span className="block text-amber-200 mt-2">Reach buyers across India.</span>
          </h2>
          <p className="text-amber-100 text-lg leading-relaxed mb-8 max-w-md">
            We onboard farmers, cooperatives and small-batch producers from across North-East India. List your produce — we handle the storefront, payments and shipping logistics.
          </p>

          <div className="space-y-3">
            {[
              "Direct access to 10,000+ buyers",
              "Transparent commission · monthly settlements",
              "Free GI-tag certification support",
              "Dedicated vendor success team",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-amber-50">{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-amber-200">
          <span>500+ farmers already selling on Kopahi</span>
        </div>
      </div>

      {/* RIGHT — vendor signup form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="lg:hidden px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo1.png" alt="Kopahi" width={80} height={80} className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-green-700 tracking-tight">Kopahi<span className="text-green-500">.</span></span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-700">← Back</Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12 lg:py-14">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Vendor signup</h1>
              <p className="text-gray-600 mt-2">
                Already a vendor?{" "}
                <Link href="/login" className="font-semibold text-green-700 hover:text-green-800">Sign in</Link>
                {" · "}
                Shopping instead?{" "}
                <Link href="/signup" className="font-semibold text-green-700 hover:text-green-800">Customer signup</Link>
              </p>
            </div>

            <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-900">
              You'll need to verify your email before you can sign in for the first time. We'll send a link to the address you provide below.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg" role="alert">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Rina Borah"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-green-600 focus:ring-green-100"
                  }`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Business Name</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  placeholder="Brahmaputra Tea Co."
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.businessName ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-green-600 focus:ring-green-100"
                  }`}
                />
                {errors.businessName && <p className="text-xs text-red-600 mt-1">{errors.businessName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-green-600 focus:ring-green-100"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.phone ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-green-600 focus:ring-green-100"
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  GST Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.gstNumber}
                  onChange={(e) => update("gstNumber", e.target.value.toUpperCase())}
                  placeholder="22AAAAA0000A1Z5"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="12+ chars · upper, lower, digit, symbol"
                    className={`w-full px-4 py-2.5 pr-11 bg-gray-50 border rounded-lg focus:outline-none focus:bg-white focus:ring-4 transition-all ${
                      errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-green-600 focus:ring-green-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                {form.password && !errors.password && (
                  <div className="mt-2">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password strength: <span className="font-semibold">{strength.label}</span></p>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreedToTerms}
                  onChange={(e) => update("agreedToTerms", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-2 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-green-700 hover:text-green-800 font-medium underline">Vendor Terms</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-green-700 hover:text-green-800 font-medium underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreedToTerms && <p className="text-xs text-red-600 -mt-2">{errors.agreedToTerms}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-700/60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
              >
                {loading ? "Creating account..." : "Apply to sell on Kopahi"}
              </button>

              <p className="text-xs text-center text-gray-500 pt-2">
                Vendor accounts go through a quick verification before listing products.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
