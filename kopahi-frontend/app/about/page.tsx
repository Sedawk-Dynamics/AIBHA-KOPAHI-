import type { Metadata } from "next";
import Image from "next/image";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import MilestoneTimeline from "../components/marketing/MilestoneTimeline";
import FounderCard from "../components/marketing/FounderCard";
import { TIMELINE, FOUNDERS } from "../lib/marketing";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, ldScript } from "../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Story — Rooted in Seven States · Kopahi",
  description:
    "Kopahi is an AIBA Agri NE LLP brand sourcing GI-tagged produce from Assam, Meghalaya, Arunachal, Nagaland, Manipur, Sikkim and Mizoram. Our story.",
  path: "/about",
});

const ABOUT_FAQS = [
  {
    question: "Who owns Kopahi?",
    answer:
      "Kopahi is a brand of AIBA Agri NE LLP, a Limited Liability Partnership registered in India. The leadership team is Barsha Prakash Choudhury and Ashreeta Gogoi (Founders), Trideep Khanikar (Director, Operations) and Prakash Natarajan (Director, Sales & Marketing).",
  },
  {
    question: "Where is Kopahi based?",
    answer:
      "Our principal place of business is Bye Lane 2, Suraj Nagar, NA Ali, Jorhat, Assam — 785001. Sourcing, processing and dispatch run from this office; the farmer network spans all seven Northeast states.",
  },
  {
    question: "Which Northeast states does Kopahi source from?",
    answer:
      "We source from Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Sikkim and Mizoram — the seven sister states. Active partnerships span tea, GI Lakadong turmeric, Keteki Joha rice, Bhoot Jolokia, Karbi Anglong ginger, Tripura Queen pineapple, Muga silk and a curated pantry range.",
  },
  {
    question: "Is Kopahi an exporter?",
    answer:
      "Yes. We hold an IEC and currently work with B2B and HoReCa partners across 12 countries. Export-grade documentation (FSSAI, COA, GI authorised-user proof) is provided on request via the /b2b portal.",
  },
];

// ── Canonical content (source of truth: AIBA Agri NE LLP brief) ──
const ABOUT_US = [
  "AIBA Agri NE LLP is focused on bringing Assam and Northeast India's GI-certified and indigenous agricultural and handloom products to global markets. We work closely with farmers and weavers to create ethical, transparent, and scalable value chains that respect the region's rich heritage while enabling sustainable growth. Our end-to-end model covers production, aggregation, processing, branding, and distribution, ensuring every product meets high standards of authenticity, quality, and responsible sourcing.",
  "Through technology-driven traceability, strategic partnerships, and a strong export vision, we empower local communities with fair market access, better pricing, and long-term development opportunities while serving global demand for sustainable and culturally rich products.",
];

const OPPORTUNITY = [
  "Global demand is rising for authentic GI-certified products across markets worldwide.",
  "Consumers increasingly prefer ethnic, indigenous, organic, and responsibly produced and sourced products.",
  "North East India can meet global demand with its GI offerings.",
  "Government incentives are driving growth in agri processing and value chains.",
];

const GAP = [
  "Limited domestic and global awareness of GI products from North East India.",
  "Grassroots producers lack access to structured, reliable market platforms.",
  "Absence of end-to-end market linkage between supply, demand, and distribution.",
  "Quality standardization, traceability, and branding gaps restrict export readiness.",
];

const SOLUTION = [
  "Building domestic and global visibility for North East GI products.",
  "Providing an accessible aggregation platform that empowers farmers and weavers economically.",
  "Enabling seamless end-to-end domestic and global market connectivity.",
  "Enhancing quality, traceability, and value addition for export readiness.",
];

const WHY_INVESTOR = [
  "Empowering grassroots communities through ethical value chains.",
  "Converting agri waste into value.",
  "Innovation drawn from indigenous resources.",
  "Technology-driven, AI-enabled agri systems.",
];

const WHY_CUSTOMER = [
  "Direct sourcing ensures quality and traceability.",
  "Authentic GI indigenous product portfolio.",
  "Experienced, promoter-led execution.",
  "Mission-driven, agri-passionate team.",
];

export default function AboutPage() {
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);
  const faqLd = faqJsonLd(ABOUT_FAQS);

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(crumbsLd)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(faqLd)} />
        {/* ============== HERO ============== */}
        <section className="pt-28 sm:pt-32 pb-12 sm:pb-16">
          <div className="mx-auto max-w-shell px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <Eyebrow>About Kopahi</Eyebrow>
              <Headline as="h1" className="mt-4" accent="Reaching For The World.">
                Rooted In Seven States.
              </Headline>
              <p className="mt-6 max-w-xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
                We are an AIBA Agri NE LLP brand. We work where the produce is grown, where the silk is woven, where the
                tea is rolled — and only there.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-(--color-ivory-warm)">
                <Image
                  src="/products/tea-garden.jpg"
                  alt="A Jorhat tea garden at first light"
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>


        {/* ============== WHO WE ARE ============== */}
        <Section tone="ivory">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <Eyebrow>Who We Are</Eyebrow>
              <Headline as="h2" className="mt-4" accent="GI Heritage, Globally.">
                Northeast India&apos;s
              </Headline>
            </div>
            <div className="lg:col-span-8 space-y-4 text-(--color-ink)/80 leading-relaxed text-base sm:text-lg max-w-prose">
              {ABOUT_US.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </Section>

        {/* ============== TIMELINE ============== */}
        <Section tone="ivory" padded={false} className="section-y" contained={false}>
          <div className="mx-auto w-full max-w-grid px-5 lg:px-8">
            <div className="max-w-2xl">
              <Eyebrow>Milestones</Eyebrow>
              <Headline as="h2" className="mt-4" accent="One Promise.">
                A Short Road.
              </Headline>
              <p className="mt-4 max-w-prose text-(--color-ink)/75 leading-relaxed">
                Kopahi is young. Our farmer relationships are older — and that is the order we intend to keep.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <MilestoneTimeline items={TIMELINE} />
          </div>
        </Section>


        {/* ============== OPPORTUNITY · GAP · SOLUTION ============== */}
        <Section tone="ivory">
          <div className="max-w-3xl">
            <Eyebrow>The Landscape</Eyebrow>
            <Headline as="h2" className="mt-4" accent="A Real Solution.">
              A Real Opportunity.
            </Headline>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Market Opportunity", items: OPPORTUNITY },
              { title: "Market Gap", items: GAP },
              { title: "Our Solution", items: SOLUTION },
            ].map((col) => (
              <div
                key={col.title}
                className="flex flex-col h-full bg-(--color-ivory-warm) border-x border-b border-(--color-bamboo)/15 border-t-2 border-t-(--color-gold)/55 rounded-sm p-6"
              >
                <h3 className="font-display text-xl text-(--color-ink)">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.items.map((it) => (
                    <li key={it} className="flex gap-3 text-small text-(--color-ink)/80 leading-relaxed">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-gold)" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ============== VISION / MISSION ============== */}
        <Section tone="ivory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative bg-(--color-ivory-warm) p-10 sm:p-14 border border-(--color-bamboo)/15">
              <Eyebrow>Vision</Eyebrow>
              <p className="mt-6 font-display italic text-2xl sm:text-3xl text-(--color-moss) leading-snug">
                Build global markets for Northeast GI produce.
              </p>
            </div>
            <div className="relative bg-(--color-moss) text-(--color-ivory) p-10 sm:p-14 grain">
              <Eyebrow tone="gold">Mission</Eyebrow>
              <p className="mt-6 font-display italic text-2xl sm:text-3xl leading-snug">
                To ethically produce, aggregate, process, brand, and export indigenous agri and weaver products —
                ensuring quality, traceability, and scalability while empowering farmers and driving regional growth.
              </p>
            </div>
          </div>
        </Section>

        {/* ============== WHY CHOOSE US ============== */}
        <Section tone="bamboo">
          <Eyebrow>Why Choose Us</Eyebrow>
          <Headline as="h2" className="mt-4 max-w-3xl" accent="Two Perspectives.">
            One Conviction.
          </Headline>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Investor Perspective", items: WHY_INVESTOR },
              { title: "Customer Perspective", items: WHY_CUSTOMER },
            ].map((col) => (
              <div
                key={col.title}
                className="bg-(--color-ivory) p-8 sm:p-10 border border-(--color-bamboo)/20"
              >
                <p className="eyebrow text-(--color-bamboo)">{col.title}</p>
                <ul className="mt-6 space-y-4">
                  {col.items.map((it) => (
                    <li key={it} className="flex gap-3 text-(--color-ink)/80 leading-relaxed">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-(--color-gold-dark) shrink-0 mt-1">
                        <path d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9z" fill="currentColor" />
                      </svg>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ============== FOUNDERS ============== */}
        <Section tone="ivory">
          <div className="max-w-3xl">
            <Eyebrow>Leadership</Eyebrow>
            <Headline as="h2" className="mt-4" accent="The Harvest.">
              The Hands Behind
            </Headline>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {FOUNDERS.map((f) => (
              <FounderCard key={f.name} {...f} />
            ))}
          </div>
        </Section>


        {/* ============== SUSTAINABLE FARMER-LED VALUE ============== */}
        <Section tone="moss" grain>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <Eyebrow tone="gold">Our Impact</Eyebrow>
              <Headline as="h2" tone="ivory" className="mt-4" accent="Farmer-Led Value.">
                Creating Sustainable
              </Headline>
            </div>
            <div className="lg:col-span-7">
              <p className="font-display italic text-(--color-gold) text-xl sm:text-2xl leading-snug">
                Empowering fair farmer incomes while delivering traceable GI products from Northeast India globally.
              </p>
              <p className="mt-5 text-(--color-ivory)/80 leading-relaxed max-w-prose">
                Kopahi empowers farmers with fair incomes, reduces post-harvest losses, and formalizes GI value chains —
                delivering authentic, traceable agri products globally while positioning Northeast India as a trusted,
                sustainable sourcing destination worldwide.
              </p>
            </div>
          </div>
        </Section>

        <Section tone="ivory">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>→ Frequently Asked</Eyebrow>
            <Headline as="h2" className="mt-4" accent="About Kopahi.">
              The Questions, Answered.
            </Headline>
            <dl className="mt-8 divide-y divide-(--color-bamboo)/25 border-y border-(--color-bamboo)/25">
              {ABOUT_FAQS.map((q) => (
                <div key={q.question} className="py-6">
                  <dt className="font-display text-xl text-(--color-ink)">{q.question}</dt>
                  <dd className="mt-3 text-(--color-ink)/75 leading-relaxed">{q.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
