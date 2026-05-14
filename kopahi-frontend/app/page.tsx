"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import LenisProvider from "./components/marketing/LenisProvider";
import MarketingHeader from "./components/marketing/MarketingHeader";
import MarketingFooter from "./components/marketing/MarketingFooter";
import WhatsAppFab from "./components/marketing/WhatsAppFab";
import Section from "./components/marketing/Section";
import Eyebrow from "./components/marketing/Eyebrow";
import Headline from "./components/marketing/Headline";
import OrganicDivider from "./components/marketing/OrganicDivider";
import StatCallout from "./components/marketing/StatCallout";
import PillarCard from "./components/marketing/PillarCard";
import FeaturedCarousel from "./components/marketing/FeaturedCarousel";
import Marquee from "./components/marketing/Marquee";
import FounderCard from "./components/marketing/FounderCard";
import { getFeaturedHomepageProducts } from "./lib/marketing";

const PILLARS = [
  {
    index: "01",
    title: "Source",
    body: "Direct relationships with farmer and weaver cooperatives across all seven Northeast states — no middlemen, no opacity.",
    image: "/products/sources.png",
    href: "/about",
  },
  {
    index: "02",
    title: "Process",
    body: "Modern processing infrastructure that protects the integrity of the harvest and dramatically reduces post-harvest loss.",
    image: "/products/dist.png",
    href: "/sustainability",
  },
  {
    index: "03",
    title: "Brand",
    body: "GI storytelling, premium packaging and export-ready labelling — heritage translated for global shelves without losing its soul.",
    image: "/products/brand.png",
    href: "/products",
  },
  {
    index: "04",
    title: "Distribute",
    body: "Premium domestic retail, B2B channels and global export — measured, deliberate, and built on long-term partnerships.",
    image: "/products/distributtion.png",
    href: "/contact",
  },
  {
    index: "05",
    title: "Empower",
    body: "Fair-price, traceable, farmer-first value chains. Every margin we earn loops back into the soil it came from.",
    image: "/products/fair.png",
    href: "/farmers",
  },
];

// The 6 hero SKUs that lead the homepage carousel (v5 §3.5).
// Source-of-truth lives in marketing.ts so the same list can be reused.
const FEATURED = getFeaturedHomepageProducts().map((p) => ({
  slug: p.slug,
  name: p.name,
  origin: p.origin,
  image: p.image,
  gi: p.gi,
}));

const FARMERS = [
  {
    name: "Bireswar Hazarika",
    village: "Diphu cluster, Karbi Anglong",
    crop: "Keteki Joha rice",
    years: 17,
  },
  {
    name: "Rina Borah",
    village: "Dibrugarh garden cluster",
    crop: "First-flush Assam tea",
    years: 19,
  },
  {
    name: "Khrieliezo Dawhuo",
    village: "Khonoma cluster, Kohima",
    crop: "Bhoot Jolokia",
    years: 11,
  },
];

const FOUNDERS = [
  {
    name: "Barsha Prakash Choudhury",
    role: "Founder",
    email: "mgmt@kopahi.com",
    phone: "+91 97406 72727",
    quote:
      "Heritage isn't a marketing word. It's a contract with the people who grew this knowledge before us.",
    bio: "Barsha leads brand and partnerships, drawing on a decade in regional sourcing and consumer storytelling.",
  },
  {
    name: "Ashreeta Gogoi",
    role: "Founder",
    email: "mgmt@kopahi.com",
    phone: "+91 98540 75705",
    quote: "Every leaf has a name. Every name has a face.",
    bio: "Ashreeta works on the ground with grower cooperatives across Assam, Meghalaya and Nagaland. She designs the farmer-first protocols that keep Kopahi traceable end-to-end.",
  },
  {
    name: "Trideep Khanikar",
    role: "Director · Operations",
    email: "trideep@kopahi.com",
    phone: "+91 93654 72113",
    quote:
      "Quality is not what we promise on a label — it's what we refuse to ship.",
    bio: "Trideep runs processing, logistics and export readiness. His obsession with the unglamorous middle of the value chain is what lets Kopahi stand behind every shipment.",
  },
  {
    name: "Prakash Natarajan",
    role: "Director · Sales & Marketing",
    email: "prakash@kopahi.com",
    phone: "+91 99019 72727",
    quote: "We are not here to sell more. We are here to sell better.",
    bio: "Prakash leads B2B and international markets. He chooses partners the way a tea-taster chooses a flush — slowly, carefully, with a long memory.",
  },
];

const VALUES = [
  "GI-Tagged",
  "Farmer-First",
  "Export-Ready",
  "Traceable",
  "Handcrafted",
  "Northeast India",
  "Heritage",
  "Sustainable",
];

const USPS = [
  {
    index: "01",
    title: "GI-Tagged Authenticity",
    body: "Geographically protected origin, verified at the source. Not a claim — a certification.",
  },
  {
    index: "02",
    title: "Northeast Exclusivity",
    body: "Our entire sourcing footprint sits inside seven states most agri brands have never set foot in.",
  },
  {
    index: "03",
    title: "Farmer-First Traceability",
    body: "Every SKU is mapped back to a grower, a village, and a season. We publish what we know.",
  },
  {
    index: "04",
    title: "Premium, Export-Ready",
    body: "Packaging, labelling and compliance designed for the world's most discerning shelves.",
  },
  {
    index: "05",
    title: "End-to-End Value Chain",
    body: "Farm, process, brand, distribute. One team. One standard. One accountable spine.",
  },
];

function HeroVideo() {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 overflow-hidden">
      {!reduce ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/products/tea-garden.jpg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image
          src="/products/tea-garden.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-(--color-moss-dark)/55 via-(--color-moss-dark)/55 to-(--color-moss-dark)/85" />
      <div className="absolute inset-0 grain" />
    </div>
  );
}

export default function Home() {
  const reduce = useReducedMotion();

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        {/* ============================================================
            01 · HERO
           ============================================================ */}
        <section className="relative min-h-[100svh] flex items-end pb-24 sm:pb-32 overflow-hidden">
          <HeroVideo />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.2, 0.8, 0.2, 1],
                delay: 0.1,
              }}
            >
              <Eyebrow tone="gold">AIBA Agri NE LLP</Eyebrow>
            </motion.div>
            <Headline
              as="h1"
              tone="ivory"
              className="mt-6 max-w-4xl"
              accent="Pure By Nature."
            >
              Authentic By Geography,
            </Headline>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.2, 0.8, 0.2, 1],
                delay: 0.55,
              }}
              className="mt-8 max-w-xl font-display italic text-lg sm:text-xl text-(--color-ivory)/85 leading-relaxed"
            >
              Bringing Northeast India&apos;s GI-certified heritage to the
              world&apos;s discerning tables.
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.2, 0.8, 0.2, 1],
                delay: 0.75,
              }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Explore Our Origins
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-7 py-4 border border-(--color-ivory)/60 text-(--color-ivory) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-ivory) hover:text-(--color-moss-dark) transition-colors"
              >
                Partner With Us
              </Link>
            </motion.div>
          </div>

          <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-(--color-ivory)/75">
            <span className="text-[10px] uppercase tracking-[0.32em]">
              Scroll
            </span>
            <span className="relative block h-10 w-px bg-(--color-ivory)/40 overflow-hidden">
              <span className="scroll-dot absolute top-0 left-1/2 -translate-x-1/2 h-2 w-px bg-(--color-gold)" />
            </span>
          </div>
        </section>

        {/* ============================================================
            02 · STORY INTRO
           ============================================================ */}
        <Section tone="ivory">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow>Our Story</Eyebrow>
              <Headline as="h2" className="mt-6" accent="A Promise.">
                A Land. A Lineage.
              </Headline>
              <div className="mt-10 space-y-6 text-(--color-ink)/80 leading-relaxed max-w-prose text-base sm:text-lg">
                <p>
                  Kopahi was born in Jorhat, between mist-soaked tea gardens and
                  the patient hands of weavers whose looms have been quiet for
                  too long. We are not a startup that discovered Northeast
                  India. We are of it.
                </p>
                <p>
                  Across seven sister states, we work with farmer and weaver
                  cooperatives growing what the rest of the world calls rare —
                  Lakadong turmeric, Joha rice, Muga silk, Bhut Jolokia, Judima
                  — and what their families have always called dinner, dowry,
                  daily life.
                </p>
                <p>
                  Our promise is simple. We protect the geography. We pay the
                  people. We tell the truth on every label.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src="/products/story.jpeg"
                  alt="Hands of a Muga silk weaver in Sualkuchi"
                  fill
                  sizes="(max-width:1024px) 100vw, 40vw"
                  className="object-cover ken-burns"
                />
              </div>
              <p className="mt-4 font-display italic text-(--color-bamboo) text-sm">
                A Tea Picker· Sualkuchi, Assam{" "}
              </p>
            </div>
          </div>
        </Section>

        <OrganicDivider />

        {/* ============================================================
            03 · MARKET OPPORTUNITY / STATS
           ============================================================ */}
        <Section tone="moss" grain>
          <Eyebrow tone="gold">Why Now</Eyebrow>
          <Headline
            as="h2"
            tone="ivory"
            className="mt-6 max-w-3xl"
            accent="Northeast Stands Apart."
          >
            The World Is Looking For Origin.
          </Headline>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10">
            <StatCallout
              tone="ivory"
              value="$8B"
              label="Global GI-certified market, growing 12% YoY"
            />
            <StatCallout
              tone="ivory"
              value="07"
              label="Northeast states inside our sourcing footprint"
            />
            <StatCallout
              tone="ivory"
              value="100+"
              label="GI-tagged & indigenous SKUs in development"
            />
            <StatCallout
              tone="ivory"
              value="E2E"
              label="Farm · Process · Brand · Export, under one roof"
            />
          </div>
        </Section>

        {/* ============================================================
            03.5 · SOURCING NETWORK — full-bleed infographic
           ============================================================ */}
        <Section tone="ivory">
          <div className="max-w-3xl">
            <Eyebrow>Our Sourcing Network</Eyebrow>
            <Headline
              as="h2"
              className="mt-6"
              accent="Seven States. One Promise."
            >
              Eight Origins.
            </Headline>
            <p className="mt-6 font-display italic text-(--color-bamboo) text-lg max-w-prose">
              Every line on the map ends in a name. Every name has a face. Every
              face has a season.
            </p>
          </div>

          <figure className="mt-14 relative w-full max-w-6xl mx-auto">
            <div className="relative w-full aspect-[3/2] overflow-hidden rounded-sm bg-(--color-ivory-warm)">
              <Image
                src="/products/sevensisters.jpeg"
                alt="Kopahi's ingredient sourcing network — eight origins mapped across Assam and the seven sister states of Northeast India"
                fill
                sizes="(max-width: 1024px) 100vw, 1152px"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-5 text-center font-display italic text-(--color-bamboo) text-sm">
              Assam Tea · Black Rice · Honey · Turmeric · Ginger · Lemon · Naga
              Chilli · Black Pepper
            </figcaption>
          </figure>
        </Section>

        <OrganicDivider />

        {/* ============================================================
            04 · FIVE PILLARS — WHAT WE DO
           ============================================================ */}
        <Section tone="ivory">
          <div className="max-w-3xl">
            <Eyebrow>What We Do</Eyebrow>
            <Headline as="h2" className="mt-6" accent="Five Pillars.">
              One Promise.
            </Headline>
            <p className="mt-6 text-(--color-ink)/75 max-w-prose text-lg">
              Sourcing, processing, branding, distribution and farmer
              empowerment — held together as a single accountable spine, not a
              stack of vendors.
            </p>
          </div>

          <div className="mt-20 flex flex-col gap-28">
            {PILLARS.map((p, i) => (
              <PillarCard key={p.index} {...p} reverse={i % 2 === 1} />
            ))}
          </div>
        </Section>

        <OrganicDivider />

        {/* ============================================================
            05 · FEATURED PRODUCTS — horizontal scroll
           ============================================================ */}
        <Section tone="ivory" padded={false} className="py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="max-w-2xl">
                <Eyebrow>Featured Origins</Eyebrow>
                <Headline as="h2" className="mt-6" accent="A Curated Few.">
                  Rare By Right.
                </Headline>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-(--color-gold-dark) hover:text-(--color-gold) text-sm uppercase tracking-[0.22em]"
              >
                Every Origin <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <FeaturedCarousel items={FEATURED} />
          </div>
        </Section>

        {/* ============================================================
            06 · KNOW YOUR FARMER
           ============================================================ */}
        <Section tone="bamboo">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
            <div className="lg:col-span-6 relative aspect-[11/6] lg:aspect-auto lg:h-full min-h-[320px] overflow-hidden rounded-sm">
              <Image
                src="/products/empover.png"
                alt="Empowering Northeast farmer communities"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div className="lg:col-span-6">
              <Eyebrow>Know Your Farmer</Eyebrow>
              <p className="mt-8 font-display italic text-(--color-moss) text-[clamp(1.5rem,3vw,2.4rem)] leading-snug">
                &ldquo;Every leaf has a name. Every name has a face.&rdquo;
              </p>
              <div className="mt-10 space-y-5">
                {FARMERS.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between border-t border-(--color-bamboo)/30 pt-4"
                  >
                    <div>
                      <p className="font-display text-xl text-(--color-ink)">
                        {f.name}
                      </p>
                      <p className="font-display italic text-sm text-(--color-bamboo)">
                        {f.village} · {f.crop}
                      </p>
                    </div>
                    <span className="text-sm text-(--color-ink)/60">
                      {f.years} yrs partnered
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/farmers"
                className="mt-10 inline-flex items-center gap-2 text-(--color-gold-dark) hover:text-(--color-gold) text-sm uppercase tracking-[0.22em]"
              >
                Meet Our Network <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Section>

        {/* ============================================================
            07 · MARQUEE — VALUES
           ============================================================ */}
        <Marquee items={VALUES} />

        {/* ============================================================
            08 · WHY KOPAHI — USPs
           ============================================================ */}
        <Section tone="ivory">
          <div className="max-w-3xl">
            <Eyebrow>Why Kopahi</Eyebrow>
            <Headline as="h2" className="mt-6" accent="Our Position Is Earned.">
              Five Reasons.
            </Headline>
          </div>

          <div className="mt-20 flex flex-col">
            {USPS.map((u) => (
              <div
                key={u.index}
                className="relative grid grid-cols-1 md:grid-cols-12 gap-6 py-12 border-t border-(--color-bamboo)/20 last:border-b"
              >
                <div className="md:col-span-2">
                  <span className="font-display italic text-[clamp(3rem,5vw,5rem)] leading-none text-(--color-bamboo)/40">
                    {u.index}
                  </span>
                </div>
                <h3 className="md:col-span-4 font-display text-2xl sm:text-3xl text-(--color-ink)">
                  {u.title}
                </h3>
                <p className="md:col-span-6 text-(--color-ink)/75 leading-relaxed max-w-prose">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ============================================================
            09 · LEADERSHIP
           ============================================================ */}
        <Section tone="ivory">
          <div className="max-w-3xl">
            <Eyebrow>Leadership</Eyebrow>
            <Headline as="h2" className="mt-6" accent="The Harvest.">
              The Hands Behind
            </Headline>
          </div>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {FOUNDERS.map((f) => (
              <FounderCard key={f.name} {...f} />
            ))}
          </div>
        </Section>

        {/* ============================================================
            10 · PARTNER CTA
           ============================================================ */}
        <Section tone="moss" grain>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <Eyebrow tone="gold">Partner With Us</Eyebrow>
              <Headline
                as="h2"
                tone="ivory"
                className="mt-6"
                accent="Soil To Story."
              >
                Be A Part Of The Journey From
              </Headline>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-4 lg:items-end">
              <Link
                href="/contact?type=stockist"
                className="inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Become A Stockist <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/contact?type=export"
                className="inline-flex items-center gap-3 px-7 py-4 border border-(--color-ivory)/60 text-(--color-ivory) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-ivory) hover:text-(--color-moss-dark) transition-colors"
              >
                Explore Export Partnerships
              </Link>
            </div>
          </div>
        </Section>

        {/* ============================================================
            11 · FOOTER
           ============================================================ */}
        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
