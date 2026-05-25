"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import LenisProvider from "../../components/marketing/LenisProvider";
import MarketingHeader from "../../components/marketing/MarketingHeader";
import MarketingFooter from "../../components/marketing/MarketingFooter";
import WhatsAppFab from "../../components/marketing/WhatsAppFab";
import Section from "../../components/marketing/Section";
import Eyebrow from "../../components/marketing/Eyebrow";
import Headline from "../../components/marketing/Headline";
import OrganicDivider from "../../components/marketing/OrganicDivider";
import { PRODUCTS, type Product } from "../../lib/marketing";

const TAB_GROUPS: { label: string; filter: (p: Product) => boolean }[] = [
  { label: "All", filter: () => true },
  { label: "Tea", filter: (p) => p.category === "Tea" },
  { label: "Vegetable Powders", filter: (p) => p.category === "Vegetable Powder" },
  { label: "Spices & Aromatics", filter: (p) => p.category === "Spices" },
  { label: "Herbal Powders", filter: (p) => p.category === "Herbal Powder" },
  { label: "Superfoods", filter: (p) => p.category === "Superfood" },
  { label: "Specialty", filter: (p) => p.category === "Specialty" },
];

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function NonGiTaggedClient() {
  const allNonGi = useMemo(() => PRODUCTS.filter((p) => !p.gi), []);
  const [tab, setTab] = useState(0);

  const items = useMemo(() => allNonGi.filter(TAB_GROUPS[tab].filter), [allNonGi, tab]);
  const counts = useMemo(() => TAB_GROUPS.map((g) => allNonGi.filter(g.filter).length), [allNonGi]);

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <section className="pt-32 sm:pt-40 pb-10">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>→ Showing {allNonGi.length} Non-GI Products</Eyebrow>
            <Headline as="h1" className="mt-6 max-w-4xl" accent="For Every Kitchen.">
              Curated.
            </Headline>
            <p className="mt-8 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              Sun-dried spice powders, herbal blends, premium Assam tea, and small-batch specialty preserves — curated
              from the same farmer network as our GI catalogue.
            </p>
          </div>
        </section>

        <OrganicDivider />

        <Section tone="ivory" padded={false} className="py-12 sm:py-16">
          {/* Category tabs */}
          <div className="flex gap-1 mb-12 flex-wrap border-b border-(--color-bamboo)/20">
            {TAB_GROUPS.map((g, i) => {
              const active = tab === i;
              return (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setTab(i)}
                  className={`relative px-4 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors flex items-center gap-2 ${
                    active ? "text-(--color-moss) font-display italic" : "text-(--color-ink)/60 hover:text-(--color-moss)"
                  }`}
                >
                  {g.label}
                  <span className="text-(--color-bamboo) text-[10px]">{counts[i]}</span>
                  {active && (
                    <span aria-hidden="true" className="absolute -bottom-px left-2 right-2 h-[2px] bg-(--color-gold)" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {items.length === 0 ? (
            <p className="py-16 text-center font-display italic text-(--color-bamboo)">
              Nothing in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {items.map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-sm bg-(--color-ivory-warm)">
                    <Image
                      src={p.image}
                      alt={`${p.name} — ${p.origin}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                    />
                    {p.imagePending && (
                      <span className="absolute bottom-3 left-3 px-3 py-1 bg-(--color-ivory)/95 text-(--color-bamboo) text-[10px] uppercase tracking-[0.2em] font-display italic">
                        → Photography in progress
                      </span>
                    )}
                  </div>
                  <div className="mt-5">
                    <p className="eyebrow text-(--color-bamboo)">→ {p.category}</p>
                    <h3 className="font-display text-2xl text-(--color-ink) mt-2 group-hover:text-(--color-moss) transition-colors">
                      {p.name}
                    </h3>
                    <p className="font-display italic text-(--color-bamboo) text-sm mt-1">{p.origin}</p>
                    {p.sellingPrice !== undefined && (
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="font-display text-(--color-moss) text-lg">{inr(p.sellingPrice)}</span>
                        {p.mrp && p.mrp > p.sellingPrice && (
                          <span className="text-sm text-(--color-bamboo) line-through">{inr(p.mrp)}</span>
                        )}
                        <span className="ml-auto text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) opacity-0 group-hover:opacity-100 transition-opacity">
                          Story →
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
