"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { PRODUCTS, STATES, CATEGORIES, type State, type Category } from "../lib/marketing";

export default function CatalogClient() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<State | "All">("All");
  const [category, setCategory] = useState<Category | "All">("All");
  const [giOnly, setGiOnly] = useState(false);
  const [nonGiOnly, setNonGiOnly] = useState(false);

  // GI and Non-GI are mutually exclusive: turning one on turns the other off.
  const toggleGi = (next: boolean) => {
    setGiOnly(next);
    if (next) setNonGiOnly(false);
  };
  const toggleNonGi = (next: boolean) => {
    setNonGiOnly(next);
    if (next) setGiOnly(false);
  };

  const filtered = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        if (state !== "All" && p.state !== state) return false;
        if (category !== "All" && p.category !== category) return false;
        if (giOnly && !p.gi) return false;
        if (nonGiOnly && p.gi) return false;
        return true;
      }),
    [state, category, giOnly, nonGiOnly]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
      {/* ============ FILTER SIDEBAR ============ */}
      <aside className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start space-y-10">
        <div>
          <p className="eyebrow">By State</p>
          <ul className="mt-4 space-y-2 text-(--color-ink)/85">
            <li>
              <button
                type="button"
                onClick={() => setState("All")}
                className={`text-left text-[15px] transition-colors ${
                  state === "All" ? "text-(--color-moss) font-medium" : "hover:text-(--color-moss)"
                }`}
              >
                All states
              </button>
            </li>
            {STATES.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setState(s)}
                  className={`text-left text-[15px] transition-colors ${
                    state === s ? "text-(--color-moss) font-medium" : "hover:text-(--color-moss)"
                  }`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">By Category</p>
          <ul className="mt-4 space-y-2 text-(--color-ink)/85">
            <li>
              <button
                type="button"
                onClick={() => setCategory("All")}
                className={`text-left text-[15px] transition-colors ${
                  category === "All" ? "text-(--color-moss) font-medium" : "hover:text-(--color-moss)"
                }`}
              >
                All categories
              </button>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`text-left text-[15px] transition-colors ${
                    category === c ? "text-(--color-moss) font-medium" : "hover:text-(--color-moss)"
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Tag</p>
          <ul className="mt-4 space-y-3">
            <li>
              <FilterToggle
                label="GI-tagged only"
                active={giOnly}
                onChange={toggleGi}
              />
            </li>
            <li>
              <FilterToggle
                label="Non-GI only"
                active={nonGiOnly}
                onChange={toggleNonGi}
              />
            </li>
          </ul>
        </div>
      </aside>

      {/* ============ RESULTS GRID ============ */}
      <div className="lg:col-span-9">
        <div className="flex items-baseline justify-between mb-8">
          <p className="text-(--color-ink)/60 text-sm uppercase tracking-[0.2em]">
            {filtered.length} {filtered.length === 1 ? "origin" : "origins"}
          </p>
          {(state !== "All" || category !== "All" || giOnly || nonGiOnly) && (
            <button
              type="button"
              onClick={() => {
                setState("All");
                setCategory("All");
                setGiOnly(false);
                setNonGiOnly(false);
              }}
              className="text-(--color-gold-dark) hover:text-(--color-gold) text-sm uppercase tracking-[0.2em]"
            >
              Reset
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="font-display italic text-2xl text-(--color-bamboo) py-20 text-center">
            Nothing matches that combination yet. Try another origin.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filtered.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay: (i % 6) * 0.04 }}
              >
                <Link href={`/products/${p.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-sm bg-(--color-ivory-warm)">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                    />
                    {p.gi && (
                      <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--color-ivory)/95 text-(--color-moss) text-[10px] uppercase tracking-[0.2em] font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-(--color-gold)" /> GI Tagged
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl text-(--color-ink) group-hover:text-(--color-moss) transition-colors">
                        {p.name}
                      </h3>
                      <p className="font-display italic text-(--color-bamboo) mt-1 text-sm">{p.origin}</p>
                    </div>
                    <span className="text-(--color-gold-dark) text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity mt-1.5">
                      Story →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterToggle({
  label,
  active,
  onChange,
}: {
  label: string;
  active: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <span
        className={`relative inline-block h-5 w-9 rounded-full transition-colors ${
          active ? "bg-(--color-gold)" : "bg-(--color-bamboo)/30"
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-(--color-ivory) shadow transition-transform ${
            active ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      <input
        type="checkbox"
        checked={active}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-[15px] text-(--color-ink)/85">{label}</span>
    </label>
  );
}
