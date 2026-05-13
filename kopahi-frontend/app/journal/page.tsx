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
import OrganicDivider from "../components/marketing/OrganicDivider";
import { JOURNAL } from "../lib/marketing";

export const metadata: Metadata = {
  title: "Journal · Slow writing from the field",
  description:
    "Heritage stories, farmer profiles, recipes and export notes from Kopahi — slow writing about the Northeast we work in.",
};

const CATEGORIES = ["All", "Heritage Stories", "Farmer Profiles", "Recipes", "Export Insights"] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export default function JournalPage() {
  const [featured, ...rest] = JOURNAL;

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        {/* ============== FEATURED ============== */}
        <section className="pt-28 sm:pt-32">
          <article className="relative h-[70vh] min-h-[480px] overflow-hidden">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-(--color-moss-dark)/85 via-(--color-moss-dark)/30 to-(--color-moss-dark)/0" />
            <div className="absolute inset-0 grain" />
            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pb-12 sm:pb-16">
                <Eyebrow tone="gold">{featured.category}</Eyebrow>
                <h1 className="mt-5 font-display font-light tracking-tight text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] text-(--color-ivory) max-w-4xl">
                  {featured.title}
                </h1>
                <p className="mt-5 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-ivory)/85">
                  {featured.excerpt}
                </p>
                <Link
                  href={`/journal/${featured.slug}`}
                  className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
                >
                  Read essay <span aria-hidden="true">→</span>
                </Link>
                <p className="mt-6 text-xs uppercase tracking-[0.22em] text-(--color-ivory)/70">
                  {featured.author} · {formatDate(featured.date)}
                </p>
              </div>
            </div>
          </article>
        </section>

        <OrganicDivider />

        {/* ============== INDEX ============== */}
        <Section tone="ivory">
          <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div>
                <Eyebrow>The Journal</Eyebrow>
                <Headline as="h2" className="mt-6 max-w-3xl" accent="Letters From The Field.">
                  Slow Writing.
                </Headline>
              </div>
              <ul className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <span className="px-3 py-1 text-xs uppercase tracking-[0.2em] border border-(--color-bamboo)/30 text-(--color-ink)/70 first:border-(--color-moss) first:text-(--color-moss)">
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 mt-10">
              {rest.map((post) => (
                <article key={post.slug} className="group">
                  <Link href={`/journal/${post.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-(--color-ivory-warm)">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="eyebrow mt-5">{post.category}</p>
                    <h3 className="mt-3 font-display text-2xl sm:text-3xl text-(--color-ink) leading-tight group-hover:text-(--color-moss) transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-(--color-ink)/75 leading-relaxed">{post.excerpt}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-(--color-ink)/55">
                      {post.author} · {formatDate(post.date)}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
