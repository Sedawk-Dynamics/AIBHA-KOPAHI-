"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "../lib/authClient";

type Status =
  | { phase: "idle"; message: string }
  | { phase: "loading"; message: string }
  | { phase: "ok"; message: string }
  | { phase: "error"; code: string; message: string };

function codeToMessage(code: string, fallback: string): string {
  switch (code) {
    case "TOKEN_INVALID":
      return "This verification link is invalid. Request a new one from the login page.";
    case "TOKEN_EXPIRED":
      return "This verification link has expired. Request a new one from the login page.";
    case "TOKEN_ALREADY_USED":
      return "Your email is already verified. Please sign in.";
    case "VALIDATION_ERROR":
      return "The verification link looks malformed.";
    default:
      return fallback;
  }
}

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const emailHint = searchParams.get("email");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(
    token
      ? { phase: "loading", message: "Verifying your email…" }
      : {
          phase: "idle",
          message: emailHint
            ? `We sent a verification link to ${emailHint}. Click it to activate your account.`
            : "Check your inbox for the verification link we just sent.",
        }
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      const res = await authClient.verifyEmail(token);
      if (cancelled) return;
      if (res.success) {
        setStatus({ phase: "ok", message: res.data.message });
      } else {
        setStatus({
          phase: "error",
          code: res.error?.code ?? "UNKNOWN",
          message: codeToMessage(
            res.error?.code ?? "",
            res.error?.message ?? "We couldn't verify this link."
          ),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const heading =
    status.phase === "ok"
      ? "Verified."
      : status.phase === "error"
      ? "Verification failed."
      : status.phase === "loading"
      ? "One moment."
      : "Almost there.";

  const accent =
    status.phase === "ok"
      ? "Welcome to Kopahi."
      : status.phase === "error"
      ? "Try again."
      : status.phase === "loading"
      ? "Checking the link."
      : "Check your inbox.";

  return (
    <main className="min-h-screen bg-(--color-ivory) text-(--color-ink) flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-xl">
        <Link
          href="/"
          className="inline-block font-display text-2xl text-(--color-moss)"
        >
          Kopahi<span className="text-(--color-gold)">.</span>
        </Link>

        <p className="eyebrow mt-12 text-(--color-bamboo)">
          {status.phase === "loading"
            ? "→ Verifying"
            : status.phase === "ok"
            ? "→ Email verified"
            : status.phase === "error"
            ? "→ Something's off"
            : "→ Almost there"}
        </p>

        <h1 className="mt-5 font-display text-4xl sm:text-5xl leading-tight">
          {heading}{" "}
          <span className="accent-italic">{accent}</span>
        </h1>

        <p className="mt-8 max-w-prose text-(--color-ink)/75 leading-relaxed">
          {status.message}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          {status.phase === "ok" ? (
            <Link
              href="/login?verified=1"
              className="inline-flex items-center gap-3 px-7 py-4 bg-(--color-moss) text-(--color-ivory) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-moss-dark) transition-colors"
            >
              Sign in <span aria-hidden="true">→</span>
            </Link>
          ) : status.phase === "error" ? (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-7 py-4 bg-(--color-moss) text-(--color-ivory) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-moss-dark) transition-colors"
              >
                Go to login <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-7 py-4 border border-(--color-bamboo)/40 text-[13px] uppercase tracking-[0.22em] font-medium text-(--color-ink) hover:text-(--color-moss) transition-colors"
              >
                Back to Kopahi
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-7 py-4 border border-(--color-bamboo)/40 text-[13px] uppercase tracking-[0.22em] font-medium text-(--color-ink) hover:text-(--color-moss) transition-colors"
            >
              Back to Kopahi
            </Link>
          )}
        </div>

        {status.phase === "loading" && (
          <div className="mt-12 inline-flex items-center gap-3 text-sm text-(--color-bamboo)">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-25" />
              <path
                fill="currentColor"
                className="opacity-75"
                d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
              />
            </svg>
            <span>Talking to the server…</span>
          </div>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-(--color-ivory)" />}>
      <VerifyEmailInner />
    </Suspense>
  );
}
