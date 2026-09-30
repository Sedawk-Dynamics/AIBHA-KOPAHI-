import type { Metadata } from "next";
import Image from "next/image";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import Botanical from "../components/marketing/Botanical";
import JournalExplore from "./JournalExplore";
import { JOURNAL } from "../lib/journal";
import { SITE, buildMetadata, breadcrumbJsonLd, ldScript } from "../lib/seo";

// ── Photography ──────────────────────────────────────────────────────────
// Stand-ins until the client's originals arrive. Swap these paths for:
//   HERO / FIELD.people — the original photo of the Kopahi director with the
//                         farmer in the field (crop out the GPS latitude /
//                         longitude stamp on the farmers' photo)
//   FIELD.land          — a plain field picture
//   FIELD.source        — the "source" picture from the client's mockup
const HERO_PHOTO = {
  src: "/products/fair.png",
  alt: "A Kopahi team member with a farmer among the crops, taking in the day's harvest",
};

const FIELD = [
  {
    no: "01",
    label: "The Land",
    caption: "Karbi Anglong, Assam",
    src: "/products/tea-garden.jpg",
    alt: "Rolling green fields and terraces in the hills of Assam",
  },
  {
    no: "02",
    label: "The People",
    caption: "The farmers behind the harvest",
    src: "/products/directfromfarmers.webp",
    alt: "A farmer and a Kopahi buyer shaking hands in a green field",
  },
  {
    no: "03",
    label: "The Source",
    caption: "Where the journey begins",
    src: "/products/thecotton.webp",
    alt: "A bamboo footbridge crossing still water at sunrise",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "The Journal — Stories From the Source · Kopahi",
  description:
    "The land, people, products and ideas shaping Northeast India's journey from origin to the world — farmer stories, origins and how Kopahi products are made.",
  path: "/journal",
});

export default function JournalPage() {
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Kopahi Journal",
    url: `${SITE}/journal`,
    publisher: { "@id": `${SITE}/#organization` },
    blogPost: JOURNAL.map((e) => ({
      "@type": "BlogPosting",
      headline: e.title,
      datePublished: e.publishedAt,
      author: { "@type": "Person", name: e.author },
      image: `${SITE}${e.coverImage}`,
      url: `${SITE}/journal/${e.slug}`,
    })),
  };

  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Journal", path: "/journal" },
  ]);

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(blogLd)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(crumbsLd)} />

        {/* ============== 01 · STORIES FROM THE SOURCE ============== */}
        <section className="relative isolate flex min-h-[min(88svh,52rem)] items-end overflow-hidden bg-(--color-moss-dark) pt-24 text-(--color-ivory)">
          <Image
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            fill
            preload
            sizes="100vw"
            className="-z-10 object-cover object-[65%_center]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-(--color-moss-dark)/90 via-(--color-moss-dark)/55 to-transparent" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-(--color-moss-dark)/70 via-transparent to-transparent" />

          <div className="mx-auto w-full max-w-shell px-5 pb-14 lg:px-8 lg:pb-20">
            <div className="flex items-end justify-between gap-10">
              <div className="max-w-2xl">
                <Eyebrow tone="gold">The Journal</Eyebrow>
                <Headline as="h1" tone="ivory" className="mt-5" accent="the Source.">
                  Stories From
                </Headline>
                <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-(--color-ivory)/85">
                  The land, people, products and ideas shaping Northeast India&apos;s journey from origin to the
                  world.
                </p>
                <a
                  href="#in-the-field"
                  className="group mt-9 inline-flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-ivory) hover:text-(--color-gold) transition-colors"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-(--color-ivory)/60 transition-colors group-hover:border-(--color-gold)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 5v14m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Explore the stories
                </a>
              </div>
              <p className="hidden -rotate-6 pb-6 text-right font-display text-2xl italic leading-snug text-(--color-ivory)/90 lg:block">
                Real places.
                <br />
                Real people.
                <br />
                A stronger tomorrow.
              </p>
            </div>
          </div>
        </section>

        {/* ============== 02 · FROM THE FIELD, FROM THE SOURCE ============== */}
        <section id="in-the-field" aria-labelledby="field-title" className="relative scroll-mt-20 overflow-hidden py-20 lg:py-28">
          <Botanical className="pointer-events-none absolute -right-2 top-6 hidden w-32 text-(--color-bamboo)/25 md:block" />
          <div className="relative mx-auto max-w-grid px-5 lg:px-8">
            <Eyebrow>In the Field</Eyebrow>
            <h2
              id="field-title"
              className="mt-4 font-display font-light tracking-tight text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-(--color-ink)"
            >
              From the Field, From the <span className="accent-italic">Source.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-(--color-ink)/70">
              Real places. Real people. Real stories from the communities and landscapes behind Kopahi.
            </p>

            <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-8">
              {FIELD.map((f) => (
                <li key={f.no}>
                  <figure>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-(--color-ivory-warm)">
                      <Image
                        src={f.src}
                        alt={f.alt}
                        fill
                        sizes="(max-width:640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[1.4s] ease-out hover:scale-[1.04]"
                      />
                    </div>
                    <figcaption className="mt-4 flex items-baseline gap-4">
                      <span className="font-display text-sm italic text-(--color-gold-dark)">{f.no}</span>
                      <span>
                        <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-(--color-ink)">
                          {f.label}
                        </span>
                        <span className="mt-1 block text-sm text-(--color-ink)/60">{f.caption}</span>
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============== 03 · PEOPLE · ORIGINS · PROCESSES ============== */}
        <JournalExplore />

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
