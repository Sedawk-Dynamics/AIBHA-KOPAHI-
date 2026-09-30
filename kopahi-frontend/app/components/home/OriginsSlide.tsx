"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { SHOP_LINKS } from "../../lib/shop";
import { MAP_CREDIT, MAP_VIEWBOX, STATE_MARKERS, STATE_PATHS, type StateId } from "./neMapGeometry";
import { ORIGINS, PRODUCT_COUNT } from "./origins";
import { EASE, Reveal, RuledEyebrow, SlideFrame, type SlideProps } from "./storyKit";

// Each state gets its own shade of sage so the map reads as a patchwork of
// hills against the dark backdrop; the selected state turns muga gold.
const FILL: Record<StateId, string> = {
  assam: "#5a7b43",
  arunachal: "#7a9a5a",
  meghalaya: "#6c8c50",
  nagaland: "#83a163",
  manipur: "#91ad6f",
  mizoram: "#67874b",
  tripura: "#7c9b5d",
  sikkim: "#97b274",
};
const FILL_HOVER = "#b6cb95";
const FILL_ACTIVE = "#d4a33a";

const VB_W = MAP_VIEWBOX.width;
const VB_H = MAP_VIEWBOX.height;

const LABEL: Record<StateId, string[]> = {
  assam: ["Assam"],
  arunachal: ["Arunachal", "Pradesh"],
  meghalaya: ["Meghalaya"],
  nagaland: ["Nagaland"],
  manipur: ["Manipur"],
  mizoram: ["Mizoram"],
  tripura: ["Tripura"],
  sikkim: ["Sikkim"],
};

type Point = { x: number; y: number };

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true" className={`shrink-0 ${className}`}>
      <path
        d="M6 13s4.5-4.2 4.5-7.6A4.5 4.5 0 0 0 1.5 5.4C1.5 8.8 6 13 6 13z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="6" cy="5.4" r="1.6" fill="currentColor" />
    </svg>
  );
}

function OriginMap({
  selected,
  hovered,
  leaderTo,
  onSelect,
  onHover,
}: {
  selected: StateId;
  hovered: StateId | null;
  /** Where the dotted leader line should end (the card's edge), in map units. */
  leaderTo: Point | null;
  onSelect: (id: StateId) => void;
  onHover: (id: StateId | null) => void;
}) {
  const m = STATE_MARKERS[selected];
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="group"
      aria-label="Map of Northeast India. Choose a state to see what Kopahi sources there."
      className="block h-auto w-full overflow-visible"
    >
      <defs>
        <filter id="ne-map-shadow" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.35" />
        </filter>
        <filter id="ne-map-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* The states are the controls: click, tap, or Tab + Enter. */}
      <g filter="url(#ne-map-shadow)">
        {ORIGINS.map((o) => {
          const on = o.id === selected;
          return (
            <path
              key={o.id}
              d={STATE_PATHS[o.id]}
              role="button"
              tabIndex={0}
              aria-label={o.name}
              aria-pressed={on}
              fill={on ? FILL_ACTIVE : o.id === hovered ? FILL_HOVER : FILL[o.id]}
              stroke="#f4ede0"
              strokeWidth={2.5}
              strokeLinejoin="round"
              className="cursor-pointer outline-none transition-[fill] duration-300 focus-visible:stroke-[#d4a33a] focus-visible:stroke-[5]"
              onClick={() => onSelect(o.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(o.id);
                }
              }}
              onMouseEnter={() => onHover(o.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(o.id)}
              onBlur={() => onHover(null)}
            />
          );
        })}
      </g>
      {/* Paper-grain texture over the land, so it reads as printed, not flat. */}
      <g filter="url(#ne-map-grain)" pointerEvents="none" aria-hidden="true">
        {ORIGINS.map((o) => (
          <path key={o.id} d={STATE_PATHS[o.id]} fill="#000" />
        ))}
      </g>

      {leaderTo && (
        <motion.path
          key={selected}
          d={`M${m.x} ${m.y} L${leaderTo.x} ${leaderTo.y}`}
          fill="none"
          stroke="#f4ede0"
          strokeOpacity={0.55}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="0.1 8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
          pointerEvents="none"
          aria-hidden="true"
        />
      )}

      <g pointerEvents="none" aria-hidden="true">
        {ORIGINS.map((o) => {
          const p = STATE_MARKERS[o.id];
          const on = o.id === selected;
          const lines = LABEL[o.id];
          return (
            <g key={o.id}>
              {on && (
                <circle cx={p.x} cy={p.y} r={12} fill="none" stroke="#fff" strokeWidth={2}>
                  <animate attributeName="r" values="9;20;9" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={on ? 7.5 : 5.5}
                fill={on ? "#1f291c" : "#fff"}
                stroke="#fff"
                strokeWidth={on ? 3.5 : 0}
              />
              {lines.map((line, i) => (
                <text
                  key={line}
                  x={p.x}
                  y={p.y - 16 - (lines.length - 1 - i) * 20}
                  textAnchor="middle"
                  fontSize={18}
                  fontWeight={500}
                  letterSpacing="0.08em"
                  fill={on ? "#1f291c" : "#fff"}
                  // A soft halo keeps names legible where they run past a
                  // narrow state's edge onto the backdrop.
                  stroke={on ? "rgba(244,237,224,0.65)" : "rgba(31,41,28,0.55)"}
                  strokeWidth={3.5}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  style={{ textTransform: "uppercase", fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function OriginCard({ id }: { id: StateId }) {
  const o = ORIGINS.find((x) => x.id === id) ?? ORIGINS[0];
  const single = o.products.length === 1;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.article
        key={o.id}
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="w-full overflow-hidden rounded-xl border border-(--color-ivory)/10 bg-(--color-ivory) text-(--color-ink) shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]"
      >
        <div className="relative aspect-[16/6.5] bg-(--color-ivory-warm) short:hidden">
          <Image src={o.image} alt={o.imageAlt} fill sizes="(max-width:1024px) 90vw, 17rem" className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-display text-xl uppercase tracking-[0.04em] text-(--color-ink)">{o.name}</h3>
          <p className="mt-1 font-display italic text-[0.8125rem] leading-snug text-(--color-bamboo)">{o.tagline}</p>
          <span aria-hidden="true" className="mt-2.5 block h-px w-10 bg-(--color-gold)" />
          <p className="mt-2.5 flex items-center gap-2 text-[11px] text-(--color-ink)/75">
            <PinIcon className="text-(--color-gold-dark)" /> {o.region}
          </p>

          {single ? (
            <div className="mt-2.5">
              <p className="font-display text-lg leading-tight text-(--color-moss)">{o.products[0].name}</p>
              <p className="mt-1 text-[0.8125rem] leading-snug text-(--color-ink)/70">{o.products[0].note}</p>
            </div>
          ) : (
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-(--color-bamboo)/15 pt-3">
              {o.products.map((p) => (
                <li key={p.name} className="min-w-0">
                  <p className="font-display text-[0.9rem] leading-tight text-(--color-moss)">{p.name}</p>
                  {p.where && <p className="mt-0.5 text-[10px] leading-snug text-(--color-ink)/55">{p.where}</p>}
                </li>
              ))}
            </ul>
          )}

          <a
            href={SHOP_LINKS.shop}
            className="mt-3 inline-flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.2em] text-(--color-gold-dark) hover:text-(--color-moss) transition-colors"
          >
            Explore {o.name} <span aria-hidden="true">→</span>
          </a>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

export default function OriginsSlide({ active, onHold }: SlideProps) {
  const [selected, setSelected] = useState<StateId>("assam");
  const [hovered, setHovered] = useState<StateId | null>(null);
  const [leaderTo, setLeaderTo] = useState<Point | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Aim the dotted leader at the card's left edge, in map units. Measured, so
  // it stays true at every desktop size and as the card grows or shrinks.
  useEffect(() => {
    const map = mapRef.current;
    const card = cardRef.current;
    if (!map || !card) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      if (!desktop.matches) return setLeaderTo(null);
      const a = map.getBoundingClientRect();
      const b = card.getBoundingClientRect();
      if (!a.width) return;
      const k = VB_W / a.width;
      setLeaderTo({ x: (b.left - a.left) * k - 6, y: (b.top - a.top + Math.min(b.height / 2, 60)) * k });
    };
    const ro = new ResizeObserver(update);
    ro.observe(map);
    ro.observe(card);
    desktop.addEventListener("change", update);
    return () => {
      ro.disconnect();
      desktop.removeEventListener("change", update);
    };
  }, []);

  const choose = (id: StateId) => {
    setSelected(id);
    onHold();
  };

  return (
    <div className="relative h-full overflow-hidden text-(--color-ivory)">
      <SlideFrame>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(15rem,0.85fr)_minmax(0,2.45fr)] lg:gap-10">
          <div>
            <Reveal show={active}>
              <RuledEyebrow>Our Sourcing Network</RuledEyebrow>
            </Reveal>
            <Reveal show={active} delay={0.12}>
              <h2 className="mt-5 font-display font-light tracking-tight text-[clamp(1.75rem,min(2.6vw,5.4svh),2.75rem)] leading-[1.08] text-(--color-ivory)">
                Eight Origins.
                <br />
                <span className="accent-italic">Seven States.</span>
                <br />
                <span className="accent-italic">One Promise.</span>
              </h2>
            </Reveal>
            <Reveal show={active} delay={0.28}>
              <p className="mt-4 max-w-sm font-display italic text-[0.95rem] sm:text-base leading-relaxed text-(--color-ivory)/75">
                From the land to the hands that nurture it, every origin carries a story worth protecting.
              </p>
            </Reveal>
            <Reveal show={active} delay={0.42} className="mt-6 hidden sm:flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/journal#origins"
                className="inline-flex items-center gap-3 rounded-full bg-(--color-gold) px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-(--color-moss-dark) hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Explore Our Origins <span aria-hidden="true">→</span>
              </Link>
              <p className="font-display italic text-sm text-(--color-ivory)/60">
                {PRODUCT_COUNT} products · {ORIGINS.length} states
              </p>
            </Reveal>
          </div>

          {/* The map sits in the middle; the card has its own column, so it
              never covers a state. */}
          <Reveal show={active} delay={0.3} y={10} className="min-w-0">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(15.5rem,0.75fr)] lg:gap-10">
              <div
                ref={mapRef}
                className="relative mx-auto w-full max-w-[34rem] lg:max-w-[calc((100svh-12rem)*1.1)]"
              >
                <OriginMap
                  selected={selected}
                  hovered={hovered}
                  leaderTo={leaderTo}
                  onSelect={choose}
                  onHover={setHovered}
                />
                <a
                  href={MAP_CREDIT.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-0 left-0 text-[9px] tracking-wide text-(--color-ivory)/45 hover:text-(--color-ivory)/75 transition-colors"
                >
                  {MAP_CREDIT.label}
                </a>
              </div>
              <div ref={cardRef} aria-live="polite" className="mx-auto w-full max-w-sm">
                <OriginCard id={selected} />
              </div>
            </div>
          </Reveal>
        </div>
      </SlideFrame>
    </div>
  );
}
