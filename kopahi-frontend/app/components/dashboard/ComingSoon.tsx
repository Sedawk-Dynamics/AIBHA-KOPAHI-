"use client";

import Link from "next/link";
import EditorialShell from "./EditorialShell";
import { DashCard } from "./DashPrimitives";

export default function ComingSoon({
  eyebrow,
  title,
  accent,
  body,
  cta,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  cta?: { href: string; label: string };
}) {
  return (
    <EditorialShell
      eyebrow={eyebrow}
      title={
        <>
          {title} <span className="accent-italic">{accent}</span>
        </>
      }
    >
      <DashCard>
        <div className="py-16 text-center max-w-2xl mx-auto">
          <svg
            viewBox="0 0 120 120"
            className="mx-auto w-16 h-16 text-(--color-bamboo)/40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            aria-hidden="true"
          >
            <path d="M60 18C40 28 28 48 28 70c20 0 38-12 48-32" strokeLinecap="round" />
            <path d="M60 18C76 36 88 56 88 70c-18 0-36-10-48-32" strokeLinecap="round" />
            <path d="M60 18v82" strokeLinecap="round" />
          </svg>
          <p className="mt-8 font-display italic text-2xl sm:text-3xl text-(--color-bamboo) leading-snug">
            {body}
          </p>
          {cta && (
            <Link
              href={cta.href}
              className="mt-10 inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </DashCard>
    </EditorialShell>
  );
}
