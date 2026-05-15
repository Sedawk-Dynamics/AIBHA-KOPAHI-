import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import OrganicDivider from "../components/marketing/OrganicDivider";
import StatCallout from "../components/marketing/StatCallout";
import Marquee from "../components/marketing/Marquee";
import B2BInquiryForm from "./B2BInquiryForm";

export const metadata: Metadata = {
  title: "Bulk Orders And B2B Partnerships",
  description:
    "Wholesale, HoReCa and export partnerships for GI-tagged Northeast Indian produce. FSSAI certified, end-to-end logistics, 24-hour quote turnaround.",
};

const REASONS = [
  {
    n: "01",
    title: "Direct from verified farmers",
    body: "Every batch is traceable to its origin farm — name, village, season.",
    image: "/products/directfromfarmers2.webp",
  },
  {
    n: "02",
    title: "GI-tagged & premium regional catalogue",
    body: "Authenticated North East produce, including Assam Tea, Lakadong Turmeric, Bhut Jolokia.",
    image: "/products/gitaggedandpremium.webp",
  },
  {
    n: "03",
    title: "Custom bulk pricing",
    body: "Volume-based tiers with annual contract discounts.",
    image: "/products/custombulkpricing.webp",
  },
  {
    n: "04",
    title: "End-to-end logistics",
    body: "Cold-chain, FSSAI documentation, customs paperwork — fully handled.",
    image: "/products/logistic.jpg",
  },
  {
    n: "05",
    title: "Export & wholesale opportunities",
    body: "Active partners across HoReCa, retail and 12+ countries.",
    image: "/products/wholesale.webp",
  },
];

const STEPS = [
  { n: "01", title: "Share Requirements", body: "Tell us volumes, products, target markets and timelines." },
  { n: "02", title: "Custom Quote", body: "Receive a tailored bulk quote within 24 hours, with sample dispatch." },
  { n: "03", title: "Sourcing & QC", body: "We source directly from verified farmers and run lab-grade QC on every batch." },
  { n: "04", title: "Pack & Ship", body: "Packaging, paperwork, cold-chain logistics — handled end-to-end." },
];

const INDUSTRIES = [
  { title: "HoReCa & Restaurants", image: "/products/HoReCa.webp", body: "Curated origin selections, consistent supply." },
  { title: "Modern Retail", image: "/products/ModernRetail.webp", body: "Retail-ready packaging, private-label options." },
  { title: "Export & Global Trade", image: "/products/Export&GlobalTrade.webp", body: "FSSAI-compliant, export-documented, lab-tested." },
];

const PARTNERS = [
  "Tata Harvest", "BlueOrigin Foods", "Northeast Café", "Saffron Hotels",
  "GreenLeaf Mart", "Pacific Exports", "Kettle & Brew", "OrganicFirst",
];

const BENEFITS = [
  {
    title: "Reliable Supply",
    body: "Consistent sourcing from verified farmer networks, with multi-region failover for monsoon resilience.",
  },
  {
    title: "Better Margins",
    body: "Wholesale tiers, annual contracts and direct-from-farm pricing — typical savings of 18–30% vs distributors.",
  },
  {
    title: "Premium Packaging",
    body: "Retail-ready, e-commerce-ready and export-ready — with private-label options for partners over 1 ton/month.",
  },
];

export default function B2BPage() {
  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        {/* ============== 1 · HERO ============== */}
        <section className="relative bg-(--color-moss) text-(--color-ivory) grain pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/products/youngs.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-[0.18]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-(--color-moss) via-(--color-moss)/85 to-(--color-moss)" />
          </div>
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow tone="gold">→ Wholesale & Business</Eyebrow>
            <Headline as="h1" tone="ivory" className="mt-6 max-w-4xl" accent="B2B Partnerships">
              Bulk Orders &amp;
            </Headline>
            <span
              aria-hidden="true"
              className="mt-9 block h-px w-16 bg-(--color-gold)"
            />
            <p className="mt-8 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-ivory)/80 leading-relaxed">
              Source premium agricultural produce directly from verified farmers and regional cooperatives across
              Northeast India — wholesale rates, custom packaging, end-to-end logistics.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#quote"
                className="inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Request Quote <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center gap-3 px-7 py-4 border border-(--color-ivory)/60 text-(--color-ivory) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-ivory) hover:text-(--color-moss-dark) transition-colors"
              >
                See How It Works
              </Link>
            </div>

            {/* Inline trust mini-strip */}
            <ul className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 pt-6 border-t border-(--color-ivory)/15 max-w-2xl">
              {[
                { stat: "500+", label: "Verified farmers" },
                { stat: "12", label: "Export countries" },
                { stat: "24 h", label: "Turnaround" },
              ].map((t) => (
                <li key={t.label} className="flex items-baseline gap-3">
                  <span className="font-display text-(--color-gold) text-xl leading-none">{t.stat}</span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-(--color-ivory)/70">
                    {t.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============== 2 · TRUST STRIP ============== */}
        <div className="bg-(--color-moss-dark) text-(--color-ivory)/80 border-t border-(--color-gold)/20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {["FSSAI Certified", "GI-Tagged Catalogue", "Pan-India Logistics", "Export Ready"].map((chip, i, arr) => (
              <span key={chip} className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-(--color-gold)">
                  <path d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9z" fill="currentColor" />
                </svg>
                {chip}
                {i < arr.length - 1 && <span className="ml-8 h-3 w-px bg-(--color-gold)/40" aria-hidden="true" />}
              </span>
            ))}
          </div>
        </div>

        {/* ============== 3 · STATS BAND ============== */}
        <Section tone="ivory">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-12 items-start">
            <StatCallout value="500+" label="Verified farmers" />
            <StatCallout value="80+" label="Business partners" />
            <StatCallout value="12" label="Export countries" />
            <StatCallout value="1,200T" label="Annual volume" />

          </div>
        </Section>

        <OrganicDivider />

        {/* ============== 4 · WHY PARTNER ============== */}
        <Section tone="ivory">
          <div className="max-w-3xl">
            <Eyebrow>→ 01 · Why Choose Us</Eyebrow>
            <Headline as="h2" className="mt-6" accent="With Kopahi?">
              Why Partner
            </Headline>
            <p className="mt-6 text-(--color-ink)/75 leading-relaxed max-w-prose text-lg">
              From sourcing to shipping, we handle every step so you can focus on selling. Built for buyers who care
              about authenticity, traceability, and consistency.
            </p>
          </div>

          <div className="mt-20 flex flex-col gap-20">
            {REASONS.map((r, i) => (
              <div key={r.n} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                <div className={`md:col-span-6 relative aspect-[5/4] overflow-hidden ${i % 2 ? "md:order-2" : ""}`}>
                  <Image src={r.image} alt={r.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className={`md:col-span-6 relative ${i % 2 ? "md:order-1 md:pr-4" : "md:pl-4"}`}>
                  <span
                    aria-hidden="true"
                    className="font-display italic text-[clamp(5rem,10vw,9rem)] leading-none text-(--color-bamboo)/15 absolute -top-12 left-0 select-none pointer-events-none"
                  >
                    {r.n}.
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-(--color-ink) mt-4">{r.title}</h3>
                  <p className="mt-4 text-(--color-ink)/75 leading-relaxed max-w-prose">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <OrganicDivider />

        {/* ============== 5 · HOW IT WORKS ============== */}
        <Section tone="ivory" id="how">
          <div className="max-w-3xl">
            <Eyebrow>→ 02 · How It Works</Eyebrow>
            <Headline as="h2" className="mt-6" accent="In 4 Steps.">
              From Inquiry To Your Warehouse —
            </Headline>
          </div>
          <ol className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
            {STEPS.map((s, i) => (
              <li key={s.n} className="relative">
                <span className="font-display italic text-(--color-gold) text-3xl">{s.n}</span>
                <h3 className="mt-3 font-display text-2xl text-(--color-ink)">{s.title}</h3>
                <p className="mt-3 text-(--color-ink)/75 leading-relaxed text-sm">{s.body}</p>
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="hidden md:block absolute top-3 right-0 translate-x-1/2 text-(--color-bamboo) text-xl">
                    ⋯
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Section>

        {/* ============== 6 · BUILT FOR ============== */}
        <Section tone="bamboo">
          <Eyebrow>→ 03 · Built For</Eyebrow>
          <Headline as="h2" className="mt-6 max-w-3xl" accent="Solutions">
            Industry-Specific
          </Headline>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {INDUSTRIES.map((ind) => (
              <article key={ind.title} className="group bg-(--color-ivory) border border-(--color-bamboo)/20 overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={ind.image}
                    alt={ind.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="bg-(--color-moss-dark) text-(--color-ivory) p-7">
                  <h3 className="font-display text-2xl">{ind.title}</h3>
                  <p className="mt-3 text-(--color-ivory)/75 text-sm leading-relaxed">{ind.body}</p>
                  <Link href="#quote" className="mt-5 inline-block text-(--color-gold) hover:text-(--color-ivory) text-xs uppercase tracking-[0.22em]">
                    Learn more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* ============== 7 · TRUSTED BY ============== */}
        <section className="bg-(--color-ivory) py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mb-10 text-center">
            <Eyebrow>→ Trusted by buyers across India &amp; beyond</Eyebrow>
          </div>
          <Marquee items={PARTNERS} />
          <div className="mt-2">
            <Marquee items={[...PARTNERS].reverse()} />
          </div>
        </section>

        {/* ============== 8 · REQUEST QUOTE ============== */}
        <Section tone="ivory" id="quote">
          <div className="max-w-3xl">
            <Eyebrow>→ Get Started</Eyebrow>
            <Headline as="h2" className="mt-6" accent="Custom Quote">
              Request A
            </Headline>
            <p className="mt-6 text-(--color-ink)/75 leading-relaxed max-w-prose text-lg">
              Share your requirements and we&apos;ll respond within 24 hours with a tailored proposal — including
              sample dispatch, pricing tiers and lead times.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <aside className="lg:col-span-5">
              <p className="eyebrow">Why partner with us</p>
              <ul className="mt-6 space-y-4">
                {[
                  "24-hour response window",
                  "Free product samples",
                  "Dedicated account manager",
                  "Volume-based discounts",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-(--color-ink)/85">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-(--color-gold) shrink-0 mt-1">
                      <path d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9z" fill="currentColor" />
                    </svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="lg:col-span-7">
              <Suspense fallback={null}>
                <B2BInquiryForm />
              </Suspense>
            </div>
          </div>
        </Section>

        {/* ============== 9 · BENEFITS ============== */}
        <Section tone="ivory">
          <Eyebrow>→ Benefits</Eyebrow>
          <Headline as="h2" className="mt-6 max-w-3xl" accent="Growing Businesses">
            Built For
          </Headline>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <article key={b.title} className="bg-(--color-ivory-warm) border border-(--color-bamboo)/20 p-10">
                <span className="font-display italic text-(--color-bamboo)/45 text-4xl">0{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl text-(--color-ink)">{b.title}</h3>
                <p className="mt-4 text-(--color-ink)/75 leading-relaxed">{b.body}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* ============== 10 · CLOSING CTA ============== */}
        <Section tone="moss" grain>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <Headline as="h2" tone="ivory" className="max-w-3xl" accent="Supply Line.">
                Let&apos;s Build Your
              </Headline>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4 lg:items-end">
              <Link
                href="#quote"
                className="inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Request Quote <span aria-hidden="true">→</span>
              </Link>
              <a
                href="mailto:partner@kopahi.com"
                className="inline-flex items-center gap-3 px-7 py-4 border border-(--color-ivory)/60 text-(--color-ivory) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-ivory) hover:text-(--color-moss-dark) transition-colors"
              >
                Schedule A Call
              </a>
            </div>
          </div>
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
