import type { Metadata } from "next";
import Image from "next/image";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import OrganicDivider from "../components/marketing/OrganicDivider";
import FounderCard from "../components/marketing/FounderCard";
import { TIMELINE, FOUNDERS } from "../lib/marketing";

export const metadata: Metadata = {
  title: "Our Story · Rooted in Seven States",
  description:
    "Kopahi is an AIBA Agri NE LLP brand sourcing, processing and exporting GI-tagged heritage from across Northeast India. Built in Jorhat, accountable to the field.",
};

const VALUES = [
  {
    title: "Empowerment",
    body: "Fair-price, long-horizon partnerships with grower and weaver cooperatives. Margins loop back into the soil they came from.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M10 36c4-6 8-9 14-9s10 3 14 9" />
        <circle cx="24" cy="16" r="6" />
        <path d="M24 22v14" />
      </svg>
    ),
  },
  {
    title: "Authenticity",
    body: "Only what the geography certifies. Only what the farmer signs off. Every claim is documented, never decorative.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M24 6c8 6 14 12 14 22a14 14 0 0 1-28 0c0-10 6-16 14-22Z" />
        <path d="M18 26c2 4 6 6 6 6s4-2 6-6" />
      </svg>
    ),
  },
  {
    title: "Sustainability",
    body: "Low-input agriculture, minimal-loss processing, and packaging built to be returned to the earth — not stored in it.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M10 24c0-10 8-18 18-18 0 10-8 18-18 18Z" />
        <path d="M10 24c0 10 8 18 18 18 0-10-8-18-18-18Z" />
      </svg>
    ),
  },
  {
    title: "Traceability",
    body: "Every SKU maps back to a name, a village, a season. We publish what we know — and admit what we don't yet.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.25">
        <circle cx="24" cy="24" r="16" />
        <path d="M24 8v32M8 24h32M14 14c4 6 16 6 20 0M14 34c4-6 16-6 20 0" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        {/* ============== HERO ============== */}
        <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/products/tea-garden.jpg"
              alt="A Jorhat tea garden at first light"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-[0.18]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-(--color-ivory) via-(--color-ivory)/85 to-(--color-ivory)" />
          </div>
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>About Kopahi</Eyebrow>
            <Headline as="h1" className="mt-6 max-w-4xl" accent="Reaching For The World.">
              Rooted In Seven States.
            </Headline>
            <p className="mt-10 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              We are an AIBA Agri NE LLP brand. We work where the produce is grown, where the silk is woven, where the
              tea is rolled — and only there.
            </p>
          </div>
        </section>

        <OrganicDivider />

        {/* ============== TIMELINE ============== */}
        <Section tone="ivory">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <Eyebrow>Milestones</Eyebrow>
              <Headline as="h2" className="mt-6" accent="One Promise.">
                A Short Road.
              </Headline>
              <p className="mt-6 max-w-prose text-(--color-ink)/75 leading-relaxed">
                Kopahi is young. Our farmer relationships are older — and that is the order we intend to keep.
              </p>
            </div>
            <ol className="lg:col-span-8 relative border-l border-(--color-bamboo)/30 pl-8 sm:pl-12 space-y-12">
              {TIMELINE.map((m, i) => (
                <li key={i} className="relative">
                  <span
                    className="absolute -left-[37px] sm:-left-[49px] top-2 h-3 w-3 rounded-full bg-(--color-gold) ring-4 ring-(--color-ivory)"
                    aria-hidden="true"
                  />
                  <p className="eyebrow">{m.year}</p>
                  <h3 className="font-display text-2xl sm:text-3xl text-(--color-ink) mt-2">{m.title}</h3>
                  <p className="mt-3 text-(--color-ink)/75 leading-relaxed max-w-prose">{m.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <OrganicDivider />

        {/* ============== VISION / MISSION ============== */}
        <Section tone="ivory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative bg-(--color-ivory-warm) p-10 sm:p-14 border border-(--color-bamboo)/15">
              <Eyebrow>Vision</Eyebrow>
              <p className="mt-6 font-display italic text-2xl sm:text-3xl text-(--color-moss) leading-snug">
                A Northeast India whose heritage is known by name on the world&apos;s most considered shelves — and
                whose growers are paid as if it always was.
              </p>
            </div>
            <div className="relative bg-(--color-moss) text-(--color-ivory) p-10 sm:p-14 grain">
              <Eyebrow tone="gold">Mission</Eyebrow>
              <p className="mt-6 font-display italic text-2xl sm:text-3xl leading-snug">
                To source, process, brand and export the GI-certified produce and craft of seven states — under one
                accountable spine, and at the price the people who grew it deserve.
              </p>
            </div>
          </div>
        </Section>

        {/* ============== VALUES ============== */}
        <Section tone="bamboo">
          <Eyebrow>What We Hold</Eyebrow>
          <Headline as="h2" className="mt-6 max-w-3xl" accent="Four Convictions.">
            No Slogans.
          </Headline>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-(--color-ivory) p-8 sm:p-10 border border-(--color-bamboo)/20 hover:border-(--color-gold) transition-colors"
              >
                <span className="text-(--color-gold-dark)">{v.icon}</span>
                <h3 className="mt-6 font-display text-2xl text-(--color-ink)">{v.title}</h3>
                <p className="mt-3 text-(--color-ink)/75 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ============== FOUNDERS ============== */}
        <Section tone="ivory">
          <div className="max-w-3xl">
            <Eyebrow>Leadership</Eyebrow>
            <Headline as="h2" className="mt-6" accent="The Harvest.">
              The Hands Behind
            </Headline>
          </div>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {FOUNDERS.map((f) => (
              <div key={f.name}>
                <FounderCard {...f} />
                <p className="mt-6 sm:ml-[calc(41.666%+2rem)] font-display italic text-(--color-bamboo) max-w-prose text-sm sm:text-base">
                  {f.anecdote}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
