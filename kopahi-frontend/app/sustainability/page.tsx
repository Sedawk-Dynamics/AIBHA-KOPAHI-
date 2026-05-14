import type { Metadata } from "next";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import OrganicDivider from "../components/marketing/OrganicDivider";

export const metadata: Metadata = {
  title: "Impact · A way of life, protected",
  description:
    "Kopahi's farmer-first model: fair income, reduced post-harvest loss, GI formalisation and capacity building across Northeast India.",
};

const PILLARS = [
  {
    index: "01",
    title: "Fair Income",
    body: "Floor-priced, season-long contracts. We document every payout, every farmer, every cycle.",
    stat: "+38%",
    statLabel: "average uplift over mandi rate",
  },
  {
    index: "02",
    title: "Reduced Post-Harvest Loss",
    body: "Modern processing and cold-chain logistics cut loss from a regional average of ~25% to under 7% on Kopahi lots.",
    stat: "<7%",
    statLabel: "post-harvest loss on tracked SKUs",
  },
  {
    index: "03",
    title: "GI Formalisation",
    body: "We support our cooperatives through GI registration, documentation and renewal — paying the costs they cannot.",
    stat: "9",
    statLabel: "GI registrations actively supported",
  },
  {
    index: "04",
    title: "Capacity Building",
    body: "Co-invested drying floors, packaging stations and certification audits — capital that stays where it is built.",
    stat: "₹1.4Cr",
    statLabel: "deployed at village level since 2024",
  },
];

const CHAIN = [
  { label: "Farmer", body: "Named, contracted, paid above floor." },
  { label: "Aggregate", body: "Quality-sorted at the village; logged at lot level." },
  { label: "Process", body: "Modern, low-loss line in Jorhat." },
  { label: "Brand", body: "Story-led labelling, GI-compliant." },
  { label: "Domestic & Export", body: "Premium retail, B2B, international." },
];

export default function SustainabilityPage() {
  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        {/* ============== HERO ============== */}
        <section className="relative pt-32 sm:pt-40 pb-12 sm:pb-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>Impact</Eyebrow>
            <Headline as="h1" className="mt-6 max-w-4xl" accent="A Way Of Life.">
              We Don&apos;t Just Source. We Protect
            </Headline>
            <p className="mt-10 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              Sustainability is a thing you can audit. So we publish what we measure — and admit what we don&apos;t.
            </p>
          </div>
        </section>

        <OrganicDivider />

        {/* ============== FOUR PILLARS ============== */}
        <Section tone="ivory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((p) => (
              <article
                key={p.index}
                className="relative bg-(--color-ivory-warm) border border-(--color-bamboo)/15 p-10 sm:p-12 overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-6 -right-2 font-display italic text-[clamp(7rem,12vw,11rem)] leading-none text-(--color-bamboo)/15 pointer-events-none select-none"
                >
                  {p.index}
                </span>
                <p className="eyebrow">{p.title}</p>
                <p className="mt-4 font-display text-[clamp(2.25rem,4vw,3rem)] leading-none text-(--color-moss)">
                  {p.stat}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-(--color-ink)/55">
                  {p.statLabel}
                </p>
                <p className="mt-8 text-(--color-ink)/80 leading-relaxed max-w-prose">{p.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <OrganicDivider />

        {/* ============== VALUE CHAIN ============== */}
        <Section tone="moss" grain>
          <Eyebrow tone="gold">Value Chain</Eyebrow>
          <Headline as="h2" tone="ivory" className="mt-6 max-w-3xl" accent="Under One Roof.">
            Farm To Frontier.
          </Headline>

          <ol className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2">
            {CHAIN.map((c, i) => (
              <li key={c.label} className="relative">
                <div className="flex items-center gap-3 md:block">
                  <span className="font-display italic text-(--color-gold) text-xl">0{i + 1}</span>
                  <h3 className="font-display text-2xl text-(--color-ivory) md:mt-3">{c.label}</h3>
                </div>
                <p className="mt-3 text-(--color-ivory)/80 leading-relaxed text-sm">{c.body}</p>
                {i < CHAIN.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden md:block absolute top-3 right-0 translate-x-1/2 text-(--color-gold)"
                  >
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Section>

        {/* ============== PULL QUOTE ============== */}
        <Section tone="ivory">
          <blockquote className="max-w-4xl font-display italic text-(--color-moss) text-[clamp(2rem,5vw,3.75rem)] leading-tight">
            &ldquo;A geography is a long argument between rain, soil and people. We are not trying to win it. We are
            trying not to break it.&rdquo;
            <footer className="mt-8 text-base not-italic text-(--color-bamboo) font-body uppercase tracking-[0.22em]">
              — Ashreeta Gogoi · Founder
            </footer>
          </blockquote>
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
