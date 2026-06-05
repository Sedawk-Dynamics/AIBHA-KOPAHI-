"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import ProductTile from "./ProductTile";

type Item = {
  slug?: string;
  name: string;
  origin: string;
  image: string;
  gi?: boolean;
};

export default function FeaturedCarousel({ items }: { items: Item[] }) {
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

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Move by one tile (tile + gap). Tile width ~300px on desktop, 260 on mobile.
    const tile = el.querySelector<HTMLElement>("[data-tile]");
    const step = (tile?.offsetWidth ?? 300) + 24; // 24 = gap-6
    el.scrollBy({ left: step * dir, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      {/* Edge fades */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-(--color-ivory) to-transparent transition-opacity duration-300 ${
          canPrev ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-(--color-ivory) to-transparent transition-opacity duration-300 ${
          canNext ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Arrows — desktop only */}
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        disabled={!canPrev}
        aria-label="Scroll featured origins left"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-(--color-ivory) border border-(--color-bamboo)/30 text-(--color-moss) shadow-md hover:bg-(--color-gold) hover:text-(--color-moss-dark) transition-colors disabled:opacity-0 disabled:pointer-events-none"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        disabled={!canNext}
        aria-label="Scroll featured origins right"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-(--color-ivory) border border-(--color-bamboo)/30 text-(--color-moss) shadow-md hover:bg-(--color-gold) hover:text-(--color-moss-dark) transition-colors disabled:opacity-0 disabled:pointer-events-none"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Scroller */}
      <div
        ref={scrollerRef}
        className={`no-scrollbar overflow-x-auto snap-x snap-mandatory ${reduceMotion ? "" : "scroll-smooth"}`}
        style={{ scrollPaddingLeft: "1.5rem", scrollPaddingRight: "1.5rem" }}
      >
        <div className="flex gap-6 px-6 sm:px-8 lg:px-12 py-2">
          {items.map((p) => (
            <div key={p.slug ?? p.name} data-tile className="snap-start shrink-0">
              <ProductTile
                name={p.name}
                origin={p.origin}
                image={p.image}
                gi={!!p.gi}
                href={p.slug ? `/products/${p.slug}` : "/products"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
