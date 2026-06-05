"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Milestone = { year: string; title: string; body: string };

function Card({ m }: { m: Milestone }) {
  return (
    <div className="w-full bg-(--color-ivory-warm) border-x border-b border-(--color-bamboo)/15 border-t-2 border-t-(--color-gold)/55 rounded-sm p-5 shadow-[0_1px_10px_rgba(46,59,42,0.05)]">
      <p className="font-display text-2xl text-(--color-gold-dark) leading-none">{m.year}</p>
      <h3 className="font-display text-lg sm:text-xl text-(--color-ink) mt-2 leading-tight">{m.title}</h3>
      <p className="mt-2 text-small text-(--color-ink)/75 leading-relaxed">{m.body}</p>
    </div>
  );
}

/**
 * Horizontal "zigzag" timeline — cards alternate above / below a continuous
 * line that runs through aligned gold year-nodes. Scrolls left→right (native
 * swipe + desktop arrows + keyboard), and respects prefers-reduced-motion.
 *
 * Each column is a 3-row grid [1fr · node · 1fr]; the equal 1fr rows keep every
 * node on the vertical centre, so the connecting line stays aligned regardless
 * of how tall an individual card is.
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
    const col = el.querySelector<HTMLElement>("[data-col]");
    const amount = (col?.offsetWidth ?? 280) + 24;
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

  const arrowBase =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-(--color-ivory) border border-(--color-bamboo)/30 text-(--color-moss) shadow-md hover:bg-(--color-gold) hover:text-(--color-moss-dark) transition-colors disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)";

  return (
    <div className="relative">
      <button type="button" onClick={() => step(-1)} disabled={!canPrev} aria-label="Scroll milestones left" className={`${arrowBase} left-3`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" onClick={() => step(1)} disabled={!canNext} aria-label="Scroll milestones right" className={`${arrowBase} right-3`}>
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
        <ol className="relative flex gap-6 px-5 sm:px-8 lg:px-12 min-w-max">
          {/* Continuous line through the node centres (vertical middle of the row) */}
          <span
            aria-hidden="true"
            className="absolute left-5 right-5 sm:left-8 sm:right-8 lg:left-12 lg:right-12 top-1/2 -translate-y-1/2 h-px bg-(--color-bamboo)/35"
          />
          {items.map((m, i) => {
            const above = i % 2 === 0;
            return (
              <li
                key={i}
                data-col
                className="relative grid grid-rows-[1fr_auto_1fr] w-[16.5rem] sm:w-[18rem] shrink-0 snap-start"
              >
                {/* TOP slot — card sits here on even items */}
                {above && (
                  <div className="row-start-1 flex flex-col items-center justify-end pb-3">
                    <Card m={m} />
                    <span aria-hidden="true" className="h-4 w-px bg-(--color-bamboo)/45" />
                  </div>
                )}

                {/* NODE — always vertically centred */}
                <div className="row-start-2 flex justify-center">
                  <span
                    aria-hidden="true"
                    className="relative z-10 h-4 w-4 rounded-full bg-(--color-gold) ring-4 ring-(--color-ivory)"
                  />
                </div>

                {/* BOTTOM slot — card sits here on odd items */}
                {!above && (
                  <div className="row-start-3 flex flex-col items-center justify-start pt-3">
                    <span aria-hidden="true" className="h-4 w-px bg-(--color-bamboo)/45" />
                    <Card m={m} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
