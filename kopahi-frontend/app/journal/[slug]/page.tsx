import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import LenisProvider from "../../components/marketing/LenisProvider";
import MarketingHeader from "../../components/marketing/MarketingHeader";
import MarketingFooter from "../../components/marketing/MarketingFooter";
import WhatsAppFab from "../../components/marketing/WhatsAppFab";
import Eyebrow from "../../components/marketing/Eyebrow";
import { JOURNAL } from "../../lib/marketing";

export async function generateStaticParams() {
  return JOURNAL.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = JOURNAL.find((p) => p.slug === slug);
  if (!post) return { title: "Essay not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function JournalArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = JOURNAL.find((p) => p.slug === slug);
  if (!post) notFound();

  const date = new Date(post.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <article className="pt-32 sm:pt-40 pb-24">
          <div className="mx-auto max-w-3xl px-6 sm:px-8">
            <Eyebrow>{post.category}</Eyebrow>
            <h1 className="mt-5 font-display font-light tracking-tight text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.05] text-(--color-ink)">
              {post.title}
            </h1>
            <p className="mt-6 font-display italic text-lg text-(--color-bamboo)">{post.excerpt}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-(--color-ink)/55">
              {post.author} · {date}
            </p>
          </div>

          <div className="relative mt-14 sm:mt-16 mx-auto max-w-5xl aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>

          <div className="mx-auto max-w-3xl px-6 sm:px-8 mt-14 sm:mt-20 space-y-6 text-base sm:text-lg leading-relaxed text-(--color-ink)/85">
            <p className="font-display italic text-(--color-bamboo) text-xl">
              The full essay is being prepared for publication. Until then, a short note from the editor.
            </p>
            <p>
              {post.excerpt} We are writing slowly — interviewing the people we work with, walking the fields they
              work, and only publishing once the piece earns its place in the journal.
            </p>
            <p>
              In the meantime, we&apos;d be glad to talk with you directly. If you&apos;d like the long version — or
              the working notes behind it — write to us at{" "}
              <a className="text-(--color-gold-dark) hover:text-(--color-gold)" href="mailto:inquiry@kopahi.com">
                inquiry@kopahi.com
              </a>
              .
            </p>
            <p>
              <Link href="/journal" className="text-(--color-gold-dark) hover:text-(--color-gold) uppercase tracking-[0.2em] text-sm">
                ← Back to the journal
              </Link>
            </p>
          </div>
        </article>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
