"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LenisProvider from "./LenisProvider";
import MarketingHeader from "./MarketingHeader";
import MarketingFooter from "./MarketingFooter";
import WhatsAppFab from "./WhatsAppFab";
import Eyebrow from "./Eyebrow";

export type LegalSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

export default function LegalShell({
  eyebrow = "→ Legal",
  title,
  italicAccent,
  lastUpdated,
  intro,
  sections,
}: {
  eyebrow?: string;
  title: string;
  italicAccent: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 1] }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        {/* HERO — restrained ~45vh */}
        <section className="pt-28 sm:pt-32 pb-10">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-center">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-6 font-display font-light tracking-tight text-[clamp(3rem,7vw,5.5rem)] leading-[1.02] text-(--color-ink)">
              {title} <span className="accent-italic">{italicAccent}</span>
            </h1>
            <p className="mt-6 font-display italic text-(--color-bamboo)">
              Last updated: {lastUpdated}.
            </p>
          </div>
        </section>


        {/* BODY */}
        <section className="pb-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* TOC */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-32">
                <p className="eyebrow">→ On this page</p>
                <nav className="mt-5 space-y-1.5" aria-label="Table of contents">
                  {sections.map((s, i) => {
                    const active = activeId === s.id;
                    return (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className={`block pl-4 -ml-px py-1.5 text-sm transition-colors border-l-2 ${
                          active
                            ? "border-(--color-gold) font-display italic text-(--color-gold-dark)"
                            : "border-transparent text-(--color-ink)/60 hover:text-(--color-moss)"
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-[0.22em] mr-2 text-(--color-bamboo)">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.title}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* PROSE */}
            <article className="lg:col-span-9 max-w-3xl">
              <div className="text-(--color-ink)/85 leading-relaxed text-base sm:text-lg">
                {intro}
              </div>

              <div className="mt-12 space-y-14">
                {sections.map((s, i) => (
                  <section
                    key={s.id}
                    id={s.id}
                    ref={(el) => {
                      sectionRefs.current[s.id] = el;
                    }}
                    className="pt-12 -mt-12 border-t border-(--color-bamboo)/20 first:border-t-0 first:pt-0 first:mt-0"
                  >
                    <p className="eyebrow">→ {String(i + 1).padStart(2, "0")} · Section</p>
                    <h2 className="mt-4 font-display font-light tracking-tight text-3xl sm:text-4xl text-(--color-ink) leading-tight">
                      {s.title}
                    </h2>
                    <div className="mt-6 text-(--color-ink)/85 leading-relaxed text-base sm:text-lg space-y-4">
                      {s.body}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-20 pt-10 border-t border-(--color-bamboo)/25">
                <p className="text-sm text-(--color-ink)/60">
                  Questions about this notice? Write to{" "}
                  <a className="text-(--color-gold-dark) hover:text-(--color-gold)" href="mailto:inquiry@kopahi.com">
                    inquiry@kopahi.com
                  </a>{" "}
                  or visit our <Link href="/contact" className="text-(--color-gold-dark) hover:text-(--color-gold)">contact page</Link>.
                </p>
              </div>
            </article>
          </div>
        </section>

        <MarketingFooter />
      </main>
      <WhatsAppFab />
    </LenisProvider>
  );
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5 mt-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span aria-hidden="true" className="text-(--color-gold) mt-1.5">·</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-5 pl-5 border-l-2 border-(--color-gold) font-display italic text-(--color-moss)">
      {children}
    </blockquote>
  );
}
