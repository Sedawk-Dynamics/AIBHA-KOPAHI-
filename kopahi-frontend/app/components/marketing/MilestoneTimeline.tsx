"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Milestone = { year: string; title: string; body: string };

/**
 * Polished horizontal timeline: a single connecting line runs through aligned
 * year nodes, with a consistently-sized card under each. Scrolls left-to-right
 * (native swipe + desktop arrows + keyboard), stacks to a readable row on
 * mobile via horizontal scroll.
 */
export default function MilestoneTimeline({ items }: { items: Milestone[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      ro.disconnect();
    };
  }, [updateEdges]);

  const step = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-node]");
    const amount = (card?.offsetWidth ?? 280) + 24;
    el.scrollBy({ left: amount * dir, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <div className="relative">
      {/* Arrows — desktop only */}
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={!canPrev}
        aria-label="Scroll milestones left"
        className="hidden md:flex absolute left-3 top-[2.1rem] z-20 h-11 w-11 items-center justify-center rounded-full bg-(--color-ivory) border border-(--color-bamboo)/30 text-(--color-moss) shadow-md hover:bg-(--color-gold) hover:text-(--color-moss-dark) transition-colors disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={!canNext}
        aria-label="Scroll milestones right"
        className="hidden md:flex absolute right-3 top-[2.1rem] z-20 h-11 w-11 items-center justify-center rounded-full bg-(--color-ivory) border border-(--color-bamboo)/30 text-(--color-moss) shadow-md hover:bg-(--color-gold) hover:text-(--color-moss-dark) transition-colors disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={scrollerRef}
        role="group"
        aria-label="company milestones"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={`no-scrollbar overflow-x-auto snap-x snap-mandatory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold) ${
          reduceMotion ? "" : "scroll-smooth"
        }`}
        style={{ scrollPaddingLeft: "1.25rem" }}
      >
        <ol className="relative flex gap-6 px-5 sm:px-8 lg:px-12 pt-3 pb-2 min-w-max">
          {/* Connecting line, aligned to the node centres */}
          <span
            aria-hidden="true"
            className="absolute left-5 right-5 sm:left-8 sm:right-8 lg:left-12 lg:right-12 top-[1.05rem] h-px bg-(--color-bamboo)/35"
          />
          {items.map((m, i) => (
            <li key={i} data-node className="relative w-[16rem] sm:w-[17.5rem] shrink-0 snap-start">
              <span
                aria-hidden="true"
                className="relative z-10 block h-3 w-3 rounded-full bg-(--color-gold) ring-4 ring-(--color-ivory)"
              />
              <div className="mt-5 h-full bg-(--color-ivory-warm) border border-(--color-bamboo)/15 rounded-sm p-5">
                <p className="eyebrow">{m.year}</p>
                <h3 className="font-display text-xl sm:text-2xl text-(--color-ink) mt-2 leading-tight">{m.title}</h3>
                <p className="mt-3 text-small text-(--color-ink)/75 leading-relaxed">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
