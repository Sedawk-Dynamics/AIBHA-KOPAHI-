"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type FadeTone = "ivory" | "ivory-warm" | "moss" | "none";

const FADE_FROM: Record<Exclude<FadeTone, "none">, string> = {
  ivory: "from-(--color-ivory)",
  "ivory-warm": "from-(--color-ivory-warm)",
  moss: "from-(--color-moss)",
};

/**
 * Reusable horizontal scroll-snap carousel.
 *
 * Each child becomes one snap card (the child owns its own width — e.g.
 * `w-[280px]`). Provides desktop arrow buttons, edge fades, hidden scrollbar,
 * native touch swipe and keyboard support (focus the row, arrow keys scroll).
 */
export default function Carousel({
  children,
  ariaLabel,
  fade = "ivory",
  className = "",
}: {
  children: ReactNode;
  ariaLabel: string;
  /** Background tone behind the carousel — controls the edge-fade colour. */
  fade?: FadeTone;
  className?: string;
}) {
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
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 300) + 24; // 24 = gap-6
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

  const fadeClass = fade === "none" ? null : FADE_FROM[fade];

  return (
    <div className={`relative ${className}`}>
      {fadeClass && (
        <>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-r ${fadeClass} to-transparent transition-opacity duration-300 ${
              canPrev ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-l ${fadeClass} to-transparent transition-opacity duration-300 ${
              canNext ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      )}

      {/* Arrows — desktop only */}
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={!canPrev}
        aria-label={`Scroll ${ariaLabel} left`}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-(--color-ivory) border border-(--color-bamboo)/30 text-(--color-moss) shadow-md hover:bg-(--color-gold) hover:text-(--color-moss-dark) transition-colors disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={!canNext}
        aria-label={`Scroll ${ariaLabel} right`}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-(--color-ivory) border border-(--color-bamboo)/30 text-(--color-moss) shadow-md hover:bg-(--color-gold) hover:text-(--color-moss-dark) transition-colors disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={scrollerRef}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={`no-scrollbar overflow-x-auto snap-x snap-mandatory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-gold) ${
          reduceMotion ? "" : "scroll-smooth"
        }`}
        style={{ scrollPaddingLeft: "1.25rem", scrollPaddingRight: "1.25rem" }}
      >
        <div className="flex gap-5 sm:gap-6 px-5 sm:px-8 lg:px-12 py-2">
          {Children.map(children, (child) => (
            <div data-card className="snap-start shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
