import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import LenisProvider from "../../components/marketing/LenisProvider";
import MarketingHeader from "../../components/marketing/MarketingHeader";
import MarketingFooter from "../../components/marketing/MarketingFooter";
import WhatsAppFab from "../../components/marketing/WhatsAppFab";
import Eyebrow from "../../components/marketing/Eyebrow";
import {
  JOURNAL,
  getEssayBySlug,
  getRelatedEssays,
  type EssayBlock,
  type JournalEssay,
} from "../../lib/journal";
import { getProductBySlug, getFarmerBySlug } from "../../lib/marketing";

export async function generateStaticParams() {
  return JOURNAL.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) return { title: "Essay not found" };
  return {
    title: `${essay.title} · Kopahi Journal`,
    description: essay.dek.slice(0, 155),
    openGraph: {
      title: essay.title,
      description: essay.dek,
      images: [essay.coverImage],
      type: "article",
      publishedTime: essay.publishedAt,
      authors: [essay.author],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderTitle(title: string, accent?: string) {
  if (!accent) return title;
  const idx = title.lastIndexOf(accent);
  if (idx < 0) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span className="accent-italic">{title.slice(idx, idx + accent.length)}</span>
      {title.slice(idx + accent.length)}
    </>
  );
}

function buildArticleJsonLd(essay: JournalEssay) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    description: essay.dek,
    image: [`https://kopahi.com${essay.coverImage}`],
    datePublished: essay.publishedAt,
    dateModified: essay.publishedAt,
    author: {
      "@type": "Person",
      name: essay.author,
      jobTitle: essay.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "Kopahi · AIBA AGRI NE LLP",
      logo: {
        "@type": "ImageObject",
        url: "https://kopahi.com/Logo1.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://kopahi.com/journal/${essay.slug}`,
    },
  };
}

export default async function JournalArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) notFound();

  const related = getRelatedEssays(essay.slug, essay.category, 3, essay.author);

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(essay)) }}
        />

        {/* HERO STRIP */}
        <article>
          <header className="pt-32 sm:pt-40 pb-12">
            <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
              <Eyebrow>→ {essay.category}</Eyebrow>
              <h1 className="mt-6 font-display font-light tracking-tight text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-(--color-ink)">
                {renderTitle(essay.title, essay.titleAccent)}
              </h1>
              <p className="mt-7 font-display italic text-(--color-bamboo) text-lg sm:text-xl leading-relaxed">
                {essay.dek}
              </p>
              <p className="mt-8 text-xs uppercase tracking-[0.22em] text-(--color-ink)/55">
                {essay.author} · {essay.authorRole} · {formatDate(essay.publishedAt)} · {essay.readingMinutes} min
                read
              </p>
            </div>
          </header>

          {/* HERO IMAGE */}
          <div className="relative mx-auto max-w-6xl aspect-[16/9] overflow-hidden">
            <Image
              src={essay.coverImage}
              alt={essay.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="object-cover"
            />
          </div>

          {/* BODY */}
          <div className="mx-auto max-w-3xl px-6 sm:px-8 mt-16 sm:mt-20">
            <EssayBody blocks={essay.body} />
          </div>
        </article>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-24 sm:mt-32 pb-20">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              <div className="flex items-baseline justify-between flex-wrap gap-3 mb-10">
                <Eyebrow>→ Continue reading</Eyebrow>
                <Link
                  href="/journal"
                  className="text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold)"
                >
                  Back to the journal →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {related.map((e) => (
                  <Link key={e.slug} href={`/journal/${e.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-(--color-ivory-warm)">
                      <Image
                        src={e.coverImage}
                        alt={e.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="eyebrow mt-5">{e.category}</p>
                    <h3 className="mt-3 font-display text-2xl text-(--color-ink) leading-tight group-hover:text-(--color-moss) transition-colors">
                      {renderTitle(e.title, e.titleAccent)}
                    </h3>
                    <p className="mt-3 text-(--color-ink)/75 leading-relaxed text-sm">{e.dek}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CLOSING CTA BAND */}
        <section className="bg-(--color-moss) text-(--color-ivory) grain py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-6 sm:px-8 text-center">
            <p className="font-display italic text-[clamp(2rem,4.5vw,3.5rem)] leading-tight">
              Continue with us in <span className="text-(--color-gold)">the field.</span>
            </p>
            <p className="mt-6 text-(--color-ivory)/80 leading-relaxed max-w-2xl mx-auto">
              We write slowly. If you&apos;d like to know when the next essay lands — and when a new origin joins
              the catalogue — leave us your email.
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
            >
              Get in touch <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}

function EssayBody({ blocks }: { blocks: EssayBlock[] }) {
  // Find the first paragraph to drop-cap.
  const firstParagraphIdx = blocks.findIndex((b) => b.type === "paragraph");
  return (
    <div className="space-y-6 text-base sm:text-lg leading-relaxed text-(--color-ink)/85">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph": {
            const isFirst = i === firstParagraphIdx;
            return (
              <p key={i} className={isFirst ? "first-letter:font-display first-letter:text-6xl first-letter:font-light first-letter:float-left first-letter:leading-[0.85] first-letter:pr-3 first-letter:pt-1 first-letter:text-(--color-moss)" : ""}>
                {block.text}
              </p>
            );
          }
          case "divider":
            return (
              <div key={i} className="flex justify-center py-4" aria-hidden="true">
                <svg
                  className="w-32 text-(--color-bamboo)"
                  viewBox="0 0 200 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                >
                  <path d="M2 6 C 40 2, 80 10, 100 6 S 160 2, 198 6" />
                  <circle cx="100" cy="6" r="1.5" fill="currentColor" />
                </svg>
              </div>
            );
          case "farmerInset":
            return <FarmerInsetCard key={i} slug={block.slug} />;
          case "productInset":
            return <ProductInsetCard key={i} slug={block.slug} note={block.note} />;
          case "authorNote":
            return (
              <p
                key={i}
                className="pt-10 mt-12 border-t border-(--color-bamboo)/25 font-display italic text-(--color-bamboo) text-base leading-relaxed"
              >
                — {block.text}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function FarmerInsetCard({ slug }: { slug: string }) {
  const farmer = getFarmerBySlug(slug);
  if (!farmer) return null;
  return (
    <aside className="my-10 border border-(--color-bamboo)/25 bg-(--color-ivory-warm) p-5 sm:p-6 flex items-center gap-5 not-prose">
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden bg-(--color-ivory) border border-(--color-bamboo)/30">
        {farmer.image && (
          <Image src={farmer.image} alt={farmer.name} fill sizes="96px" className="object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="eyebrow text-(--color-bamboo)">→ Meet the grower</p>
        <h3 className="mt-2 font-display text-xl text-(--color-ink)">{farmer.name}</h3>
        <p className="font-display italic text-sm text-(--color-bamboo) mt-1">
          {farmer.village}, {farmer.state} · {farmer.crop}
        </p>
        <Link
          href={`/farmers#${farmer.slug}`}
          className="mt-3 inline-block text-(--color-gold-dark) hover:text-(--color-gold) text-xs uppercase tracking-[0.22em]"
        >
          Read more →
        </Link>
      </div>
    </aside>
  );
}

function ProductInsetCard({ slug, note }: { slug: string; note?: string }) {
  const product = getProductBySlug(slug);

  // Graceful fallback for products not yet in the catalogue (e.g. Muga Silk Stole).
  if (!product) {
    return (
      <aside className="my-10 border border-(--color-bamboo)/25 bg-(--color-ivory-warm) p-5 sm:p-6 flex items-center gap-5 not-prose">
        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 inline-flex items-center justify-center bg-(--color-moss) text-(--color-gold) font-display italic text-2xl">
          K
        </div>
        <div className="flex-1 min-w-0">
          <p className="eyebrow text-(--color-bamboo)">→ From the origin</p>
          <h3 className="mt-2 font-display text-xl text-(--color-ink)">
            {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </h3>
          <p className="font-display italic text-sm text-(--color-bamboo) mt-1">
            {note ?? "Listing coming soon"}
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="my-10 border border-(--color-bamboo)/25 bg-(--color-ivory-warm) p-5 sm:p-6 flex items-center gap-5 not-prose">
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden bg-(--color-ivory) border border-(--color-bamboo)/30">
        <Image src={product.image} alt={product.name} fill sizes="96px" className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="eyebrow text-(--color-bamboo)">→ From the origin</p>
        <h3 className="mt-2 font-display text-xl text-(--color-ink)">{product.name}</h3>
        <p className="font-display italic text-sm text-(--color-bamboo) mt-1">
          {note ?? `${product.origin}${product.gi ? ` · GI · ${product.giYear}` : ""}`}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-3 inline-block text-(--color-gold-dark) hover:text-(--color-gold) text-xs uppercase tracking-[0.22em]"
        >
          Visit the origin →
        </Link>
      </div>
    </aside>
  );
}
