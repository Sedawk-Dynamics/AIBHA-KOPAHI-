"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "kopahi.cookie.v1";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // localStorage is only safe to read on the client; reading + setting state
    // on mount is the standard pattern for client-only persistence and is
    // intentional here.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      // ignore privacy-mode failures
    }
  }, []);

  const dismiss = (choice: "accept" | "decline") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 bg-(--color-moss-dark) text-(--color-ivory) p-5 sm:p-6 shadow-xl grain"
    >
      <p className="eyebrow text-(--color-gold)">A note about cookies</p>
      <p className="mt-3 text-sm leading-relaxed text-(--color-ivory)/85">
        We use a small set of cookies to keep this site working and to learn what people read.
        No advertising. No re-selling.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => dismiss("accept")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => dismiss("decline")}
          className="text-[12px] uppercase tracking-[0.22em] text-(--color-ivory)/80 hover:text-(--color-gold) transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
