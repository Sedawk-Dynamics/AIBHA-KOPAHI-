"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { api, ApiError } from "../../lib/api";

export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await api.post("/api/auth/verify-email", { token });
        if (cancelled) return;
        setStatus("ok");
        setMessage("Your email is verified. You can close this tab or sign in.");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          err instanceof ApiError
            ? err.message
            : "Could not verify your email — the link may have expired."
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <span className="text-2xl font-bold text-green-700 tracking-tight">
            Kopahi<span className="text-green-500">.</span>
          </span>
        </Link>

        <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center"
             style={{
               background: status === "ok"
                 ? "rgb(220 252 231)"
                 : status === "error"
                 ? "rgb(254 226 226)"
                 : "rgb(243 244 246)"
             }}>
          {status === "loading" && (
            <svg className="animate-spin w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {status === "ok" && (
            <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {status === "error" && (
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-3">
          {status === "loading"
            ? "Verifying email…"
            : status === "ok"
            ? "Email verified"
            : "Verification failed"}
        </h1>

        <p
          className={`text-sm mb-8 ${
            status === "error" ? "text-red-600" : "text-gray-600"
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="bg-gradient-to-r from-green-700 to-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all"
          >
            Go to login
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
