"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";

/* ============================================================
   SIGNUP PAGE
   File: app/signup/page.tsx
============================================================ */

type Role = "customer" | "vendor";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<Role>("customer");
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
    agreedToTerms: false,
  });

  const update = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(form.phone)) newErrors.phone = "Please enter a valid phone number";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Must be at least 8 characters";
    if (role === "vendor" && !form.businessName.trim()) newErrors.businessName = "Business name is required";
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
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: role === "vendor" ? "vendor" : "user",
        businessName: role === "vendor" ? form.businessName : undefined,
      });
      router.push(role === "vendor" ? "/vendor" : "/dashboard");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not create your account. Please try again.";
      setSubmitError(msg);
      setLoading(false);
    }
  };

  // Password strength indicator
  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400/15 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Image src="/Logo1.png" alt="Kopahi" width={120} height={120} className="h-14 w-14 object-contain drop-shadow-lg group-hover:scale-105 transition-transform" />
            <span className="text-3xl font-bold tracking-tight">Kopahi<span className="text-green-300">.</span></span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6 tracking-tight">
            Join the Kopahi family.
            <span className="block text-green-200 mt-2">Authentic. Direct. Fair.</span>
          </h2>
          <p className="text-green-100 text-lg leading-relaxed mb-8 max-w-md">
            Whether you're shopping for premium agri-products or you're a farmer ready to reach a wider audience — start here.
          </p>

          <div className="space-y-3">
            {[
              "Direct sourcing from 500+ verified farmers",
              "GI-tagged authentic North East produce",
              "Pan-India shipping with order tracking",
              "10% off your first order",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-green-50">{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-xs text-green-200">
          <div className="flex -space-x-2">
            {["bg-amber-400", "bg-blue-400", "bg-pink-400"].map((c, i) => (
              <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-green-800`}></div>
            ))}
          </div>
          <span>Trusted by 10,000+ customers across India</span>
        </div>
      </div>

      {/* RIGHT — signup form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Logo1.png" alt="Kopahi" width={80} height={80} className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-green-700 tracking-tight">Kopahi<span className="text-green-500">.</span></span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-700">← Back</Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12 lg:py-14">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Create your account</h1>
              <p className="text-gray-600 mt-2">
                Already have one?{" "}
                <Link href="/login" className="font-semibold text-green-700 hover:text-green-800">Sign in</Link>
              </p>
            </div>

            {/* Role toggle */}
            <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === "customer" ? "bg-white text-green-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                I'm a Customer
              </button>
              <button
                type="button"
                onClick={() => setRole("vendor")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  role === "vendor" ? "bg-white text-green-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                I'm a Vendor
              </button>
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-500 font-medium">OR SIGN UP WITH EMAIL</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg" role="alert">
                  {submitError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Rahul Sharma"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:bg-white focus:ring-4 transition-all ${
                    errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-green-600 focus:ring-green-100"
                  }`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              {role === "vendor" && (
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
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email Address</label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phone Number</label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="At least 8 characters"
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
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
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

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreedToTerms}
                  onChange={(e) => update("agreedToTerms", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-2 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to Kopahi's{" "}
                  <Link href="/terms" className="text-green-700 hover:text-green-800 font-medium underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-green-700 hover:text-green-800 font-medium underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreedToTerms && <p className="text-xs text-red-600 -mt-2">{errors.agreedToTerms}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-700/60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create {role === "vendor" ? "Vendor" : "Customer"} Account
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 pt-2">
                {role === "vendor"
                  ? "Vendor accounts go through a quick verification before going live."
                  : "Get 10% off your first order — code applied at checkout!"}
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}