"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useTransform } from "framer-motion";

import Headline from "../marketing/Headline";
import { SHOP_LINKS } from "../../lib/shop";
import { EASE, Reveal, RuledEyebrow, SlideFrame, type SlideProps } from "./storyKit";

const PILLARS = [
  {
    title: "Source",
    body: "Direct relationships with farmer and weaver cooperatives across all seven Northeast states — no middlemen, no opacity.",
    image: "/products/sources.png",
    alt: "A weaver at her loom beside rice, turmeric and chillies, with misty tea hills behind",
    href: "/about",
  },
  {
    title: "Process",
    body: "Modern processing infrastructure that protects the integrity of the harvest and dramatically reduces post-harvest loss.",
    image: "/products/dist.png",
    alt: "Fresh produce being sorted and packed in a modern processing shed",
    href: "/journal#processes",
  },
  {
    title: "Brand",
    body: "GI storytelling, premium packaging and export-ready labelling — heritage translated for global shelves without losing its soul.",
    image: "/products/brand.png",
    alt: "Kopahi Joha rice and Lakadong turmeric on a premium retail shelf",
    href: SHOP_LINKS.shop,
  },
  {
    title: "Distribution",
    body: "Premium domestic retail, B2B channels and global export — measured, deliberate, and built on long-term partnerships.",
    image: "/products/distributtion.png",
    alt: "Boxed produce being loaded onto a truck at a tea-garden depot",
    href: "/contact",
  },
  {
    title: "Empower",
    body: "Fair-price, traceable, farmer-first value chains. Every margin we earn loops back into the soil it came from.",
    image: "/products/fair.png",
    alt: "A farmer hands fresh greens to a buyer who records the purchase on a tablet",
    href: "/farmers",
  },
];

export const PILLAR_COUNT = PILLARS.length;
/** Each pillar's time on screen; the slide lasts for all five. */
export const PILLAR_MS = 5000;

const pad = (n: number) => String(n + 1).padStart(2, "0");

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PillarsSlide({ active, progress, onHold }: SlideProps) {
  // While the slide plays, the pillar follows the slide's own clock; once the
  // visitor picks one, it stays put (and the slider holds) until they leave.
  const [auto, setAuto] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wasActive, setWasActive] = useState(active);
  if (wasActive !== active) {
    setWasActive(active);
    if (!active) setPicked(null);
  }

  useMotionValueEvent(progress, "change", (v) => {
    if (!active) return;
    const next = Math.min(PILLAR_COUNT - 1, Math.floor(v * PILLAR_COUNT));
    if (next !== auto) setAuto(next);
  });

  const current = picked ?? (active ? auto : 0);
  const p = PILLARS[current];

  // Fill of the active pillar tab: that pillar's share of the slide clock.
  const tabFill = useTransform(progress, (v) =>
    Math.max(0, Math.min(1, v * PILLAR_COUNT - current)),
  );

  const pick = (i: number) => {
    setPicked(((i % PILLAR_COUNT) + PILLAR_COUNT) % PILLAR_COUNT);
    onHold();
  };

  return (
    <div className="relative h-full overflow-hidden text-(--color-ivory)">
      <SlideFrame>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <Reveal show={active}>
              <RuledEyebrow>What We Do</RuledEyebrow>
            </Reveal>
            <Reveal show={active} delay={0.12}>
              <Headline as="h2" tone="ivory" animate={false} className="mt-5 short:text-[2.5rem]" accent="Five Pillars.">
                One Promise.
              </Headline>
            </Reveal>
            <Reveal show={active} delay={0.28}>
              <p className="mt-5 max-w-md font-display text-base sm:text-lg leading-relaxed text-(--color-ivory)/80 short:mt-3 short:text-base">
                Sourcing, processing, branding, distribution and farmer empowerment — held together as a
                single accountable spine, not a stack of vendors.
              </p>
            </Reveal>

            <Reveal show={active} delay={0.42} className="mt-7 lg:mt-10 short:mt-5">
              <div role="tablist" aria-label="The five pillars" className="flex flex-wrap gap-x-4 gap-y-3 sm:gap-x-6">
                {PILLARS.map((pl, i) => {
                  const on = i === current;
                  return (
                    <button
                      key={pl.title}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls="pillar-panel"
                      onClick={() => pick(i)}
                      className="group text-left"
                    >
                      <span
                        className={`block font-display text-xl sm:text-2xl leading-none transition-colors ${
                          on ? "text-(--color-gold)" : "text-(--color-ivory)/45 group-hover:text-(--color-ivory)/80"
                        }`}
                      >
                        {pad(i)}
                      </span>
                      <span className="relative mt-2 block h-[2px] w-full min-w-10 overflow-hidden bg-(--color-ivory)/20">
                        {on && (
                          <motion.span
                            className="absolute inset-0 origin-left bg-(--color-gold)"
                            style={{ scaleX: picked === null ? tabFill : 1 }}
                          />
                        )}
                      </span>
                      <span
                        className={`mt-2 block text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-colors ${
                          on ? "text-(--color-gold)" : "text-(--color-ivory)/55"
                        }`}
                      >
                        {pl.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <Reveal show={active} delay={0.3} y={24} className="lg:col-span-7">
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              <div
                id="pillar-panel"
                role="tabpanel"
                aria-live="polite"
                className="overflow-hidden rounded-xl border border-(--color-bamboo)/15 bg-(--color-ivory) shadow-[0_30px_60px_-30px_rgba(31,41,28,0.5)]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <div className="relative aspect-[16/8] lg:aspect-auto lg:h-[min(40svh,24rem)] short:h-[30svh] bg-(--color-ivory-warm)">
                      <Image src={p.image} alt={p.alt} fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
                      <span className="absolute top-3 right-3 rounded-full bg-(--color-moss-dark)/45 px-3.5 py-1 font-display italic text-xl text-(--color-gold) backdrop-blur-sm">
                        {pad(current)} <span className="text-sm text-(--color-ivory)/85">/ {pad(PILLAR_COUNT - 1)}</span>
                      </span>
                    </div>
                    <div className="px-5 py-5 sm:px-7 sm:py-6 short:py-4">
                      <p className="font-body text-[10.5px] font-medium uppercase tracking-[0.24em] text-(--color-gold-dark)">
                        Pillar {pad(current)}
                      </p>
                      <h3 className="mt-2 font-display text-3xl sm:text-4xl leading-tight text-(--color-ink)">{p.title}</h3>
                      <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-(--color-ink)/75">{p.body}</p>
                      <Link
                        href={p.href}
                        className="mt-4 inline-flex items-center gap-3 rounded-full bg-(--color-gold) px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-(--color-moss-dark) hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
                      >
                        Explore {p.title} <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={() => pick(current - 1)}
                aria-label="Previous pillar"
                className="absolute left-0 top-[28%] -translate-x-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-(--color-ivory) text-(--color-moss) shadow-md hover:bg-(--color-gold) hover:text-(--color-moss-dark) transition-colors"
              >
                <Arrow dir="prev" />
              </button>
              <button
                type="button"
                onClick={() => pick(current + 1)}
                aria-label="Next pillar"
                className="absolute right-0 top-[28%] translate-x-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-(--color-ivory) text-(--color-moss) shadow-md hover:bg-(--color-gold) hover:text-(--color-moss-dark) transition-colors"
              >
                <Arrow dir="next" />
              </button>
            </div>
          </Reveal>
        </div>
      </SlideFrame>
    </div>
  );
}
