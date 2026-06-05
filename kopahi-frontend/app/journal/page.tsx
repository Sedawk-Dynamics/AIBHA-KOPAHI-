import type { Metadata } from "next";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import JournalListing from "./JournalListing";
import { JOURNAL } from "../lib/journal";
import { SITE, buildMetadata, breadcrumbJsonLd, ldScript } from "../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "The Journal — Slow Writing from the Field · Kopahi",
  description:
    "Field essays, farmer profiles, recipes and export notes from the Kopahi team in Jorhat, Assam — published when the piece earns its place.",
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

        {/* HERO */}
        <section className="pt-28 sm:pt-32 pb-4">
          <div className="mx-auto max-w-shell px-5 lg:px-8">
            <Eyebrow>→ The Journal</Eyebrow>
            <Headline as="h1" className="mt-4 max-w-5xl" accent="Letters From The Field.">
              Slow Writing.
            </Headline>
            <p className="mt-5 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              We write the way we source — slowly, with names, and only when the piece has earned its place. These
              are the working notes, recipes and field essays of a young brand learning at the pace of its growers.
            </p>
          </div>
        </section>

        <Section tone="ivory" size="sm">
          <JournalListing />
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
