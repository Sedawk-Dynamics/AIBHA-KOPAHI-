"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "../lib/authClient";

type Status = "idle" | "loading" | "sent" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
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
    const res = await authClient.forgot(trimmed);
    if (res.success) {
      setStatus("sent");
      setMessage(
        `If an account exists for ${trimmed}, you'll get a reset link within a minute. The link expires in 1 hour.`
      );
    } else {
      setStatus("error");
      setMessage(res.error?.message ?? "Could not send reset email. Try again.");
    }
  };

  const isLocked = status === "loading" || status === "sent";

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-(--color-ivory) text-(--color-ink)">
      {/* LEFT — form panel */}
      <section className="relative flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12">
        <div className="absolute top-6 left-6 right-6 sm:top-10 sm:left-10 sm:right-10 flex items-center justify-between">
          <Link href="/" className="font-display text-xl text-(--color-moss)">
            Kopahi<span className="text-(--color-gold)">.</span>
          </Link>
          <Link
            href="/login"
            className="text-xs uppercase tracking-[0.22em] text-(--color-bamboo) hover:text-(--color-moss) transition-colors"
          >
            ← Back to sign in
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md mt-16 sm:mt-0">
          <p className="eyebrow">→ Reset your password</p>
          <h1 className="mt-5 font-display font-light tracking-tight text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05]">
            Lost the path?{" "}
            <span className="accent-italic">Find it again.</span>
          </h1>
          <p className="mt-4 text-(--color-ink)/70 max-w-md leading-relaxed">
            Enter your email and we&apos;ll send you a link to choose a new password.
          </p>

          {status === "sent" ? (
            <div className="mt-10 border border-(--color-gold)/40 bg-(--color-gold)/10 px-6 py-7">
              <p className="eyebrow text-(--color-moss)">→ Check your inbox</p>
              <p className="mt-3 font-display text-xl text-(--color-ink) leading-snug">
                A reset link is on its way.
              </p>
              <p className="mt-3 text-sm text-(--color-ink)/70 leading-relaxed">
                {message}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-(--color-moss) text-(--color-ivory) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-moss-dark) transition-colors"
                >
                  Back to sign in →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setMessage("");
                    setEmail("");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-(--color-bamboo)/40 text-[12px] uppercase tracking-[0.22em] text-(--color-ink) hover:text-(--color-moss) hover:border-(--color-moss) transition-colors"
                >
                  Resend
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
              <div>
                <label htmlFor="email" className="block eyebrow mb-2">
                  Email
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
                  disabled={isLocked}
                  className="w-full bg-transparent border-b border-(--color-bamboo)/40 focus:border-(--color-gold) outline-none py-3 text-(--color-ink) placeholder:text-(--color-ink)/40 disabled:opacity-60"
                />
              </div>

              {status === "error" && message && (
                <p role="alert" className="text-sm text-(--color-chilli)">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={isLocked}
                className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Send reset link"}
              </button>

              <p className="mt-2 text-xs italic text-(--color-bamboo) flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="text-(--color-gold)"
                >
                  <path
                    d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9z"
                    fill="currentColor"
                  />
                </svg>
                For your security, we never confirm whether an email is registered.
              </p>
            </form>
          )}

          <p className="mt-10 text-sm text-(--color-ink)/70">
            Remembered it?{" "}
            <Link
              href="/login"
              className="text-(--color-gold-dark) hover:text-(--color-gold) uppercase tracking-[0.22em] text-xs ml-1"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </section>

      {/* RIGHT — image + still tagline */}
      <aside className="hidden lg:block relative overflow-hidden">
        <Image
          src="/products/tea-garden.jpg"
          alt="A tea garden in Jorhat, Assam"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-(--color-moss-dark)/30 via-(--color-moss-dark)/20 to-(--color-moss-dark)/85" />
        <div className="absolute inset-0 grain" />
        <div className="absolute inset-x-0 bottom-0 p-12 lg:p-16">
          <p className="eyebrow text-(--color-gold)">Kopahi · A note</p>
          <p className="mt-5 font-display italic text-[clamp(2rem,3.5vw,3rem)] leading-tight text-(--color-ivory)">
            “Every door has a key. We just need to send you a new one.”
          </p>
        </div>
      </aside>
    </main>
  );
}
