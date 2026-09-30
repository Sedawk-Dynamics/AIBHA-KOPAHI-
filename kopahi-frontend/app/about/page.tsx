import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Botanical from "../components/marketing/Botanical";
import AboutFaq from "./AboutFaq";
import { FOUNDERS } from "../lib/marketing";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, ldScript } from "../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Story — Rooted in Seven States · Kopahi",
  description:
    "Kopahi brings the exceptional produce and craftsmanship of Northeast India to global markets — an AIBA Agri NE LLP brand working directly with farmers and weavers.",
  path: "/about",
});

// Approved factual answers carried over from the previous About page.
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
    question: "Which states do you source from?",
    answer:
      "We source from Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Sikkim and Mizoram — the seven sister states. Active partnerships span tea, GI Lakadong turmeric, Keteki Joha rice, Bhoot Jolokia, Karbi Anglong ginger, Tripura Queen pineapple, Muga silk and a curated pantry range.",
  },
  {
    question: "Is Kopahi an exporter?",
    answer:
      "Yes. We hold an IEC and currently work with B2B and HoReCa partners across 12 countries. Export-grade documentation (FSSAI, COA, GI authorised-user proof) is provided on request via the /b2b portal.",
  },
];

const MILESTONES = [
  { year: "2023", title: "AIBA Agri NE LLP incorporated" },
  { year: "2024", title: "First farmer onboarded" },
  { year: "2024", title: "First GI partnership" },
  { year: "2025", title: "Processing facility commissioned" },
  { year: "2025", title: "First export shipment" },
  { year: "2026", title: "Seven-state footprint" },
];

const PEOPLE = [
  {
    name: "Barsha Prakash Choudhury",
    role: "Founder",
    line: "A deep commitment to Northeast India and its people.",
  },
  {
    name: "Ashreeta Gogoi",
    role: "Founder",
    line: "Driven by a belief in fair opportunities and local growth.",
  },
  {
    name: "Trideep Khanikar",
    role: "Director, Operations",
    line: "Focused on quality, traceability and strong producer partnerships.",
  },
  {
    name: "Prakash Natarajan",
    role: "Director, Sales & Marketing",
    line: "Building global markets for Northeast India's unique products.",
  },
].map((p) => {
  const f = FOUNDERS.find((x) => x.name === p.name);
  return { ...p, image: f?.image, bio: f?.bio };
});

const RUST_BTN =
  "inline-flex items-center gap-2.5 rounded-full bg-(--color-rust) px-6 py-3 text-[13px] font-medium text-(--color-ivory) transition-colors hover:bg-(--color-rust-dark) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-rust)";

/** Serif section heading with the short rust rule beneath. */
function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div>
      <h2
        id={id}
        className="font-display font-light tracking-tight text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.1] text-(--color-moss-dark)"
      >
        {children}
      </h2>
      <span aria-hidden="true" className="mt-4 block h-[2px] w-12 bg-(--color-rust)" />
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19C5 10 10.5 4.5 20 4.5 20 14 14.5 19.5 5.5 19.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4 20.5 15 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

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

        {/* ============== 01 · HERO ============== */}
        <section className="relative pt-16 lg:pt-24">
          <div className="relative lg:min-h-[min(76svh,42rem)]">
            <div className="relative mx-auto flex max-w-shell items-center px-5 lg:min-h-[min(76svh,42rem)] lg:px-8">
              <div className="max-w-2xl py-14 lg:w-[46%] lg:py-16">
                <p className="font-body text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-rust)">
                  About Kopahi
                </p>
                <h1 className="mt-5 font-display font-light tracking-tight text-[clamp(2.3rem,3.7vw,3.5rem)] leading-[1.06] text-(--color-moss-dark)">
                  Rooted in Seven States.
                  <br />
                  Reaching for the World.
                </h1>
                <p className="mt-6 max-w-md text-base sm:text-[1.05rem] leading-relaxed text-(--color-ink)/75">
                  Kopahi brings the exceptional produce and craftsmanship of Northeast India to global
                  markets — creating opportunities for people, preserving traditions and celebrating a truly
                  unique region.
                </p>
                <div className="mt-9">
                  <Link href="/#our-story" className={RUST_BTN}>
                    Our story <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative aspect-[16/11] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[52%] lg:edge-organic-left">
              <Image
                src="/products/tea-garden.jpg"
                alt="Tea pluckers at work across the terraced gardens of Assam"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ============== 02 · WHO WE ARE ============== */}
        <section aria-labelledby="who-we-are" className="relative mt-20 lg:mt-28">
          <div className="relative lg:min-h-[34rem]">
            <div className="relative aspect-[16/11] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[50%] lg:edge-organic-right">
              <Image
                src="/products/directfromfarmers2.webp"
                alt="Three farmers holding baskets of freshly picked greens on a hillside farm"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_35%]"
              />
            </div>
            <div className="relative mx-auto flex max-w-shell items-center px-5 lg:min-h-[34rem] lg:justify-end lg:px-8">
              <div className="max-w-lg py-14 lg:w-[42%] lg:py-16">
                <SectionTitle id="who-we-are">Who We Are</SectionTitle>
                <div className="mt-7 space-y-5 text-base sm:text-[1.05rem] leading-relaxed text-(--color-ink)/75">
                  <p>
                    Kopahi is a brand of AIBA Agri NE LLP, bringing GI-certified and indigenous agricultural
                    and handloom products of Northeast India to global markets.
                  </p>
                  <p>
                    We work directly with farmers and weavers, building ethical, transparent value chains
                    across production, aggregation, processing, branding and distribution — ensuring
                    authenticity, quality and fair value at every step.
                  </p>
                </div>
                <a
                  href="#our-journey"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-(--color-rust) underline decoration-(--color-rust)/40 underline-offset-4 transition-colors hover:text-(--color-rust-dark) hover:decoration-(--color-rust-dark)"
                >
                  Learn more about our journey <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <Botanical className="pointer-events-none absolute bottom-4 right-4 hidden w-24 text-(--color-bamboo)/30 xl:block" />
          </div>
        </section>

        {/* ============== 03 · VISION & MISSION ============== */}
        <section aria-labelledby="vision-mission" className="relative overflow-hidden py-24 lg:py-32">
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-(--color-moss)/[0.06]"
          >
            <path
              fill="currentColor"
              d="M0 150C120 110 210 95 330 118S560 170 700 132 950 60 1090 88 1320 150 1440 120V220H0Z"
            />
            <path
              fill="currentColor"
              d="M0 190C160 160 260 150 400 168S640 205 800 180 1080 120 1220 140 1380 175 1440 165V220H0Z"
            />
          </svg>
          <div className="relative mx-auto max-w-grid px-5 lg:px-8">
            <SectionTitle id="vision-mission">Our Vision &amp; Mission</SectionTitle>
            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0 md:divide-x md:divide-(--color-bamboo)/25">
              <div className="flex gap-6 md:pr-12 lg:pr-16">
                <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-(--color-rust)/8 text-(--color-rust)">
                  <EyeIcon />
                </span>
                <div>
                  <h3 className="font-body text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-rust)">
                    Our Vision
                  </h3>
                  <p className="mt-3 font-display text-[clamp(1.35rem,2.2vw,1.75rem)] leading-snug text-(--color-moss-dark)">
                    Build global markets for Northeast GI produce.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 md:pl-12 lg:pl-16">
                <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-(--color-rust)/8 text-(--color-rust)">
                  <LeafIcon />
                </span>
                <div>
                  <h3 className="font-body text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-rust)">
                    Our Mission
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-(--color-ink)/75">
                    To ethically produce, aggregate, process, brand and export indigenous agricultural and
                    handloom products, while ensuring quality, traceability and creating sustainable growth for
                    the people and communities of Northeast India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 04 · OUR JOURNEY ============== */}
        <section id="our-journey" aria-labelledby="journey-title" className="py-20 lg:py-24">
          <div className="mx-auto max-w-grid px-5 lg:px-8">
            <SectionTitle id="journey-title">Our Journey</SectionTitle>
            <ol className="relative mt-12 grid grid-cols-1 gap-9 pl-9 lg:mt-16 lg:grid-cols-6 lg:gap-4 lg:pl-0">
              <span
                aria-hidden="true"
                className="absolute bottom-2 left-[5px] top-2 w-px bg-(--color-ink)/20 lg:bottom-auto lg:left-[8.333%] lg:right-[8.333%] lg:top-[5px] lg:h-px lg:w-auto"
              />
              {MILESTONES.map((m, i) => (
                <li key={`${m.year}-${m.title}`} className="relative lg:pt-9 lg:text-center">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-9 top-1 h-3 w-3 rounded-full ring-4 ring-(--color-ivory) lg:left-1/2 lg:top-0 lg:-translate-x-1/2 ${
                      i === 2 || i === 4 ? "bg-(--color-rust)" : "bg-(--color-moss-dark)"
                    }`}
                  />
                  <p className="text-[0.95rem] font-semibold text-(--color-ink)">{m.year}</p>
                  <p className="mt-1 text-sm leading-snug text-(--color-ink)/70 lg:mx-auto lg:max-w-[10rem]">
                    {m.title}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============== 05 · THE PEOPLE BEHIND KOPAHI ============== */}
        <section aria-labelledby="people-title" className="py-20 lg:py-28">
          <div className="mx-auto max-w-grid px-5 lg:px-8">
            <SectionTitle id="people-title">The People Behind Kopahi</SectionTitle>
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {PEOPLE.map((p) => (
                <li key={p.name}>
                  <div className="relative aspect-[4/3.4] overflow-hidden rounded-sm bg-(--color-ivory-warm)">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={`Portrait of ${p.name}, ${p.role}`}
                        fill
                        sizes="(max-width: 1024px) 50vw, 18rem"
                        className="object-cover object-[center_22%]"
                      />
                    )}
                  </div>
                  <h3 className="mt-5 text-[0.95rem] font-semibold text-(--color-ink)">{p.name}</h3>
                  <p className="mt-0.5 text-sm text-(--color-ink)/60">{p.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-ink)/75">{p.line}</p>
                  {p.bio && (
                    <details className="group mt-3">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-(--color-rust) hover:text-(--color-rust-dark) [&::-webkit-details-marker]:hidden">
                        <span className="group-open:hidden">Read bio</span>
                        <span className="hidden group-open:inline">Close bio</span>
                        <span aria-hidden="true" className="transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-(--color-ink)/70">{p.bio}</p>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============== 06 · OUR IMPACT ============== */}
        <section aria-labelledby="impact-title" className="relative isolate overflow-hidden bg-(--color-moss-dark) text-(--color-ivory)">
          <Image
            src="/products/gitagged.webp"
            alt="A farming couple at a village produce stall, holding baskets of vegetables and their verified-farmer cards"
            fill
            sizes="100vw"
            className="-z-10 object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-(--color-moss-dark) via-(--color-moss-dark)/85 to-(--color-moss-dark)/20" />
          <div className="mx-auto flex min-h-[26rem] max-w-shell items-center px-5 py-20 lg:min-h-[30rem] lg:px-8 lg:py-24">
            <div className="max-w-lg">
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-gold)">
                Our Impact
              </p>
              <h2
                id="impact-title"
                className="mt-4 font-display font-light tracking-tight text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.08]"
              >
                Creating Sustainable, Farmer-Led Value.
              </h2>
              <p className="mt-5 text-base sm:text-[1.05rem] leading-relaxed text-(--color-ivory)/80">
                By choosing Kopahi, you support indigenous produce, traditional craftsmanship and vibrant
                communities across Northeast India.
              </p>
              <div className="mt-8">
                <Link href="/contact" className={RUST_BTN}>
                  Contact Us <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============== 07 · FAQ ============== */}
        <section aria-labelledby="faq-title" className="relative overflow-hidden py-20 lg:py-28">
          <div className="relative mx-auto grid max-w-grid grid-cols-1 gap-10 px-5 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-5">
              <SectionTitle id="faq-title">Frequently Asked Questions</SectionTitle>
            </div>
            <div className="lg:col-span-7">
              <AboutFaq items={ABOUT_FAQS} />
            </div>
          </div>
          <Botanical className="pointer-events-none absolute -bottom-6 left-2 hidden w-28 text-(--color-bamboo)/25 lg:block" />
        </section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
