"use client";

import { useState } from "react";
import Link from "next/link";
import { api, ApiError } from "../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      await api.post<{ success: boolean; message: string }>("/api/auth/forgot-password", {
        email: trimmed,
      });
      setStatus("sent");
      setMessage(
        `If an account exists for ${trimmed}, you'll get a reset link within a minute. The link expires in 1 hour.`
      );
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof ApiError ? err.message : "Could not send reset email. Try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <span className="text-2xl font-bold text-green-700 tracking-tight">
            Kopahi<span className="text-green-500">.</span>
          </span>
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-3">Forgot password?</h1>
        <p className="text-gray-600 mb-8">
          Enter the email associated with your account and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              autoComplete="email"
              placeholder="you@example.com"
              disabled={status === "loading" || status === "sent"}
              className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 transition disabled:opacity-70 ${
                status === "error"
                  ? "border-red-300 ring-2 ring-red-100 focus:ring-red-300"
                  : "border-gray-200 focus:ring-green-300 focus:border-green-400"
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "sent"}
            className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-70"
          >
            {status === "loading"
              ? "Sending…"
              : status === "sent"
              ? "Email sent"
              : "Send reset link"}
          </button>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`text-sm text-center ${
                status === "error" ? "text-red-600" : "text-green-700"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          Remembered it?{" "}
          <Link href="/login" className="text-green-700 font-semibold hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
