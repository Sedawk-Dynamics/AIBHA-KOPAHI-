import type { Metadata } from "next";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import OrganicDivider from "../components/marketing/OrganicDivider";
import JournalListing from "./JournalListing";
import { JOURNAL } from "../lib/journal";

export const metadata: Metadata = {
  title: "The Journal · Slow writing from the field",
  description:
    "Heritage stories, farmer profiles, recipes and export notes from Kopahi — slow writing about the Northeast we work in.",
};

export default function JournalPage() {
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Kopahi Journal",
    url: "https://kopahi.com/journal",
    publisher: { "@type": "Organization", name: "Kopahi · AIBA AGRI NE LLP" },
    blogPost: JOURNAL.map((e) => ({
      "@type": "BlogPosting",
      headline: e.title,
      datePublished: e.publishedAt,
      author: { "@type": "Person", name: e.author },
      image: `https://kopahi.com${e.coverImage}`,
      url: `https://kopahi.com/journal/${e.slug}`,
    })),
  };

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
        />

        {/* HERO */}
        <section className="pt-32 sm:pt-40 pb-12">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>→ The Journal</Eyebrow>
            <Headline as="h1" className="mt-6 max-w-5xl" accent="Letters From The Field.">
              Slow Writing.
            </Headline>
            <p className="mt-10 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              We write the way we source — slowly, with names, and only when the piece has earned its place. These
              are the working notes, recipes and field essays of a young brand learning at the pace of its growers.
            </p>
          </div>
        </section>

        <OrganicDivider />

        <Section tone="ivory">
          <JournalListing />
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
