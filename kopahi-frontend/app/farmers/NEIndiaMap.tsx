"use client";

import { useMemo, useState } from "react";
import { FARMERS, STATES, type State } from "../lib/marketing";

// Stylised NE-India map. Not geographically precise — each state is a labelled
// hex tile arranged in the rough shape of the seven sisters. Hovering a tile
// surfaces the farmer count for that state.
const TILES: { state: State; cx: number; cy: number; label: string }[] = [
  { state: "Sikkim",            cx:  60, cy:  40, label: "Sikkim" },
  { state: "Arunachal Pradesh", cx: 280, cy:  40, label: "Arunachal" },
  { state: "Assam",             cx: 170, cy: 120, label: "Assam" },
  { state: "Meghalaya",         cx:  80, cy: 175, label: "Meghalaya" },
  { state: "Nagaland",          cx: 280, cy: 130, label: "Nagaland" },
  { state: "Manipur",           cx: 280, cy: 220, label: "Manipur" },
  { state: "Mizoram",           cx: 200, cy: 280, label: "Mizoram" },
  { state: "Tripura",           cx: 110, cy: 270, label: "Tripura" },
];

const HEX = (cx: number, cy: number, r = 44) => {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
};

export default function NEIndiaMap() {
  const [active, setActive] = useState<State | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const f of FARMERS) map[f.state] = (map[f.state] ?? 0) + 1;
    for (const s of STATES) map[s] = map[s] ?? 0;
    return map;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-7">
        <svg
          viewBox="0 0 360 340"
          className="w-full h-auto max-w-xl mx-auto lg:mx-0"
          role="img"
          aria-label="A stylised map of Northeast India showing where Kopahi sources from"
        >
          {TILES.map((t) => {
            const isActive = active === t.state;
            const hasFarmers = counts[t.state] > 0;
            return (
              <g
                key={t.state}
                onMouseEnter={() => setActive(t.state)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(t.state)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                className="cursor-pointer outline-none focus-visible:[&_polygon]:stroke-[var(--color-gold)]"
              >
                <polygon
                  points={HEX(t.cx, t.cy)}
                  fill={isActive ? "var(--color-gold)" : hasFarmers ? "var(--color-moss)" : "var(--color-bamboo)"}
                  fillOpacity={isActive ? 1 : hasFarmers ? 0.85 : 0.35}
                  stroke="var(--color-ivory)"
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
                <text
                  x={t.cx}
                  y={t.cy - 2}
                  textAnchor="middle"
                  className="fill-[var(--color-ivory)] font-medium"
                  fontSize="11"
                  style={{ letterSpacing: "0.06em", textTransform: "uppercase", pointerEvents: "none" }}
                >
                  {t.label}
                </text>
                <text
                  x={t.cx}
                  y={t.cy + 14}
                  textAnchor="middle"
                  className="fill-[var(--color-ivory)]/85"
                  fontSize="10"
                  style={{ pointerEvents: "none" }}
                >
                  {counts[t.state]} farmer{counts[t.state] === 1 ? "" : "s"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="lg:col-span-5">
        <p className="eyebrow">Our Footprint</p>
        <h2 className="font-display text-3xl sm:text-4xl mt-4 text-(--color-ink)">
          {active ?? "Seven states. One spine."}
        </h2>
        <p className="mt-4 text-(--color-ink)/75 leading-relaxed max-w-prose">
          {active
            ? counts[active] > 0
              ? `${counts[active]} verified ${counts[active] === 1 ? "farmer" : "farmers"} in ${active}, with formal cooperative agreements and full traceability back to the village.`
              : `${active} is on our incoming roster. We do not list a state until we can stand behind a farmer in it.`
            : "Hover or focus a tile to see how many growers we work with there. We only mark a state once a farmer has signed on."}
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-2">
          {STATES.map((s) => (
            <li key={s} className="flex items-center gap-2 text-sm text-(--color-ink)/85">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${
                  counts[s] > 0 ? "bg-(--color-gold)" : "bg-(--color-bamboo)/40"
                }`}
              />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
