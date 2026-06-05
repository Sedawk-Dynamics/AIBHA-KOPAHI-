import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import NEIndiaMap from "./NEIndiaMap";
import { FARMERS } from "../lib/marketing";
import { getEssaysByFarmerSlug } from "../lib/journal";
import { buildMetadata } from "../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Meet Our Farmers — Northeast India · Kopahi",
  description:
    "The growers behind every Kopahi product — from Sualkuchi weavers to Karbi Anglong rice farmers to Kohima chilli partners. Names, villages, payouts.",
  path: "/farmers",
});

const PROMISES = [
  {
    title: "Fair Price",
    body: "Every contract sets a floor above the prevailing mandi rate, locked for the season — not for the harvest.",
  },
  {
    title: "Traceability",
    body: "Each lot is tagged at source. The name on the label is on the field log.",
  },
  {
    title: "Capacity Building",
    body: "We co-fund drying floors, storage and certification — capital that stays in the village when the truck leaves.",
  },
];

export default function FarmersPage() {
  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        {/* ============== HERO ============== */}
        <section className="pt-28 sm:pt-32 pb-12 sm:pb-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>Know Your Farmer</Eyebrow>
            <Headline as="h1" className="mt-6 max-w-4xl" accent="A Face.">
              Every Leaf Has A Name.
            </Headline>
            <p className="mt-10 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              Traceability is not a feature. It is the only honest way to sell something grown by someone else.
            </p>
          </div>
        </section>


        {/* ============== MAP ============== */}
        <Section tone="ivory">
          <NEIndiaMap />
        </Section>

        {/* ============== FARMER GRID ============== */}
        <Section tone="bamboo">
          <Eyebrow>Our Network</Eyebrow>
          <Headline as="h2" className="mt-6 max-w-3xl" accent="Their Names.">
            Their Soil.
          </Headline>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FARMERS.map((f) => {
              const essays = getEssaysByFarmerSlug(f.slug);
              const featuredEssay = essays[0];
              return (
                <article
                  key={f.slug}
                  id={f.slug}
                  className="bg-(--color-ivory) border border-(--color-bamboo)/20 hover:border-(--color-gold) transition-colors flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {f.image && (
                      <Image
                        src={f.image}
                        alt={`Portrait of ${f.name}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <p className="eyebrow">{f.state}</p>
                    <h3 className="font-display text-2xl text-(--color-ink) mt-3">{f.name}</h3>
                    <p className="font-display italic text-(--color-bamboo) text-sm mt-1">
                      {f.village} · {f.crop}
                    </p>
                    <p className="mt-5 font-display italic text-(--color-ink)/85 leading-snug">
                      &ldquo;{f.quote}&rdquo;
                    </p>
                    <p className="mt-5 text-xs uppercase tracking-[0.22em] text-(--color-ink)/55">
                      {f.years} years partnered
                    </p>
                    {featuredEssay && (
                      <Link
                        href={`/journal/${featuredEssay.slug}`}
                        className="mt-5 pt-5 border-t border-(--color-bamboo)/20 inline-flex items-center justify-between gap-2 text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold) transition-colors"
                      >
                        <span>Read their story</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        {/* ============== OUR PROMISE BAND ============== */}
        <Section tone="moss" grain>
          <Eyebrow tone="gold">Our Promise</Eyebrow>
          <Headline as="h2" tone="ivory" className="mt-6 max-w-3xl" accent="Three Commitments.">
            Documented.
          </Headline>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {PROMISES.map((p, i) => (
              <div key={p.title} className="relative">
                <span className="font-display italic text-[clamp(3rem,5vw,4.5rem)] leading-none text-(--color-gold)/40">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-(--color-ivory) mt-4">{p.title}</h3>
                <p className="mt-4 text-(--color-ivory)/80 leading-relaxed max-w-prose">{p.body}</p>
              </div>
            ))}
          </div>
          <Link
            href="/contact?type=sourcing"
            className="mt-10 inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
          >
            Become a partner farmer <span aria-hidden="true">→</span>
          </Link>
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
