"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { JOURNAL, JOURNAL_CATEGORIES, type JournalCategory, type JournalEssay } from "../lib/journal";

const TABS: { label: string; match: (e: JournalEssay) => boolean }[] = [
  { label: "All", match: () => true },
  ...JOURNAL_CATEGORIES.map((c) => ({
    label: c,
    match: (e: JournalEssay) => e.category === c,
  })),
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderTitle(title: string, accent?: string) {
  if (!accent) return title;
  const idx = title.lastIndexOf(accent);
  if (idx < 0) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span className="accent-italic">{title.slice(idx, idx + accent.length)}</span>
      {title.slice(idx + accent.length)}
    </>
  );
}

export default function JournalListing() {
  const [active, setActive] = useState(0);
  const filtered = useMemo(() => JOURNAL.filter(TABS[active].match), [active]);
  const counts = useMemo(() => TABS.map((t) => JOURNAL.filter(t.match).length), []);

  const featured = filtered.find((e) => e.isFeatured) ?? null;
  const rest = filtered.filter((e) => e !== featured);

  return (
    <>
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-(--color-bamboo)/20 mb-10">
        {TABS.map((t, i) => {
          const isActive = active === i;
          return (
            <button
              key={t.label}
              type="button"
              onClick={() => setActive(i)}
              className={`relative px-4 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors flex items-center gap-2 ${
                isActive ? "text-(--color-moss) font-display italic" : "text-(--color-ink)/60 hover:text-(--color-moss)"
              }`}
            >
              {t.label}
              <span className="text-(--color-bamboo) text-[10px]">{counts[i]}</span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-px left-2 right-2 h-[2px] bg-(--color-gold)"
                />
              )}
            </button>
          );
        })}
      </div>

      <p className="eyebrow mb-10">
        → Showing {filtered.length} {filtered.length === 1 ? "essay" : "essays"}
      </p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-display italic text-(--color-bamboo)">
          Nothing in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {featured && <EssayCard essay={featured} variant="featured" />}
          {rest.map((essay) => (
            <EssayCard key={essay.slug} essay={essay} />
          ))}
        </div>
      )}
    </>
  );
}

function EssayCard({
  essay,
  variant = "default",
}: {
  essay: JournalEssay;
  variant?: "default" | "featured";
}) {
  const isFeatured = variant === "featured";
  return (
    <article
      className={`group ${
        isFeatured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <Link href={`/journal/${essay.slug}`} className="block">
        <div
          className={`relative overflow-hidden bg-(--color-ivory-warm) ${
            isFeatured ? "aspect-[16/10]" : "aspect-[4/5]"
          }`}
        >
          <Image
            src={essay.coverImage}
            alt={essay.title}
            fill
            sizes={isFeatured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"}
            className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
            priority={isFeatured}
          />
          {isFeatured && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-(--color-gold) text-(--color-moss-dark) text-[10px] uppercase tracking-[0.22em] font-medium">
              Featured
            </span>
          )}
        </div>
        <div className="mt-5">
          <p className="eyebrow text-(--color-bamboo)">{essay.category}</p>
          <h3
            className={`mt-3 font-display text-(--color-ink) leading-tight group-hover:text-(--color-moss) transition-colors ${
              isFeatured ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {renderTitle(essay.title, essay.titleAccent)}
          </h3>
          <p
            className={`mt-3 text-(--color-ink)/75 leading-relaxed ${
              isFeatured ? "text-lg max-w-2xl font-display italic text-(--color-bamboo)" : ""
            }`}
          >
            {essay.dek}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-(--color-ink)/55">
            {essay.author} · {formatDate(essay.publishedAt)} · {essay.readingMinutes} min read
          </p>
        </div>
      </Link>
    </article>
  );
}
