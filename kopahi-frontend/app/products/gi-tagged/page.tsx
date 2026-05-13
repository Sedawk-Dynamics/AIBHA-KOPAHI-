import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import LenisProvider from "../../components/marketing/LenisProvider";
import MarketingHeader from "../../components/marketing/MarketingHeader";
import MarketingFooter from "../../components/marketing/MarketingFooter";
import WhatsAppFab from "../../components/marketing/WhatsAppFab";
import Section from "../../components/marketing/Section";
import Eyebrow from "../../components/marketing/Eyebrow";
import Headline from "../../components/marketing/Headline";
import OrganicDivider from "../../components/marketing/OrganicDivider";
import { PRODUCTS } from "../../lib/marketing";

export const metadata: Metadata = {
  title: "GI-Tagged · Five geographies, legally protected",
  description:
    "Kopahi's five GI-tagged origins — Keteki Joha rice, Lakadong turmeric, Naga chilli, Karbi Anglong ginger, Tripura Queen pineapple.",
};

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function GiTaggedPage() {
  const items = PRODUCTS.filter((p) => p.gi);

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <section className="pt-32 sm:pt-40 pb-10">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>→ Showing {items.length} GI-Tagged Products</Eyebrow>
            <Headline as="h1" className="mt-6 max-w-4xl" accent="Legally Protected.">
              Five Geographies.
            </Headline>
            <p className="mt-8 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              Each of these origins carries a Geographical Indication — a legal seal that ties the product to the
              place that made it possible. Nothing else can claim the name.
            </p>
          </div>
        </section>

        <OrganicDivider />

        <Section tone="ivory">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {items.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-sm bg-(--color-ivory-warm)">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--color-ivory)/95 text-(--color-moss) text-[10px] uppercase tracking-[0.2em] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--color-gold)" /> GI Tagged
                  </span>
                </div>
                <div className="mt-5">
                  <h3 className="font-display text-2xl text-(--color-ink) group-hover:text-(--color-moss) transition-colors">
                    {p.name}
                  </h3>
                  <p className="font-display italic text-(--color-bamboo) mt-1">{p.origin}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-(--color-ink)/55">
                    GI Tag · {p.giYear} · {p.state}
                  </p>
                  {p.sellingPrice !== undefined && (
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-display text-(--color-moss) text-lg">{inr(p.sellingPrice)}</span>
                      {p.mrp && p.mrp > p.sellingPrice && (
                        <span className="text-sm text-(--color-bamboo) line-through">{inr(p.mrp)}</span>
                      )}
                      <span className="ml-auto text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) opacity-0 group-hover:opacity-100 transition-opacity">
                        Story →
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
