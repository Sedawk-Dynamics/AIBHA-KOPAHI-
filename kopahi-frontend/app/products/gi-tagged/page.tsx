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
import { PRODUCTS } from "../../lib/marketing";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, ldScript } from "../../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "GI Tagged Products of India — Authentic Northeast Catalogue · Kopahi",
  description:
    "5 GI-certified products from Northeast India — Lakadong Turmeric, Keteki Joha Rice, Naga Chilli (Bhoot Jolokia), Karbi Anglong Ginger, Tripura Queen Pineapple.",
  path: "/products/gi-tagged",
  keywords: [
    "GI tagged products India",
    "Geographical Indication products",
    "Lakadong turmeric",
    "Keteki Joha rice",
    "Naga chilli Bhoot Jolokia",
    "Karbi Anglong ginger",
    "Tripura Queen pineapple",
  ],
});

const GI_FAQS = [
  {
    question: "What is a GI tag?",
    answer:
      "A Geographical Indication (GI) is a legal certification granted by the Government of India under the GI Act 1999, tying a product to a specific region. Only producers within the gazetted area can use the GI name.",
  },
  {
    question: "Are Kopahi GI-tagged products certified?",
    answer:
      "Yes. Every GI-tagged product on Kopahi is sourced from registered authorised users within the gazetted region. Each product page displays its GI registration number. Buyers can request batch certification.",
  },
  {
    question: "What GI products does Kopahi sell?",
    answer:
      "Kopahi currently sells five GI-tagged products: Lakadong Turmeric (Meghalaya), Keteki Joha Rice (Assam), Naga Chilli / Bhoot Jolokia (Nagaland), Karbi Anglong Ginger (Assam), and Tripura Queen Pineapple (Tripura).",
  },
  {
    question: "Where does Kopahi ship?",
    answer:
      "We ship pan-India for retail orders. For bulk and export orders, we currently work with B2B partners across 12 countries via our /b2b portal.",
  },
];

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function GiTaggedPage() {
  const items = PRODUCTS.filter((p) => p.gi);

  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "GI Tagged", path: "/products/gi-tagged" },
  ]);
  const faqLd = faqJsonLd(GI_FAQS);

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(crumbsLd)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(faqLd)} />

        <section className="pt-28 sm:pt-32 pb-10">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>→ Showing {items.length} GI-Tagged Products</Eyebrow>
            <Headline as="h1" className="mt-6 max-w-4xl" accent="Legally Protected.">
              Five Geographies.
            </Headline>
            <p className="mt-8 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              Each of these origins carries a Geographical Indication — a legal seal that ties the product to the
              place that made it possible. Nothing else can claim the name.
            </p>
            <div className="mt-12 max-w-3xl space-y-5 text-(--color-ink)/80 leading-relaxed">
              <p>
                A Geographical Indication is the closest thing Indian food has to a legal birth certificate. Granted
                by the Government of India under the GI Act 1999, it ties a specific produce to a specific gazetted
                region — and forbids anyone outside that region from selling under the same name. There are roughly
                605 GI-tagged products in India today; the five we carry are among the most distinctive of the
                Northeast.
              </p>
              <p>
                Kopahi buys these GIs from registered authorised users inside the gazetted area. We publish the GI
                registration number on every product page, alongside the farmer's name, the village, the year of
                partnership, and — where applicable — independent lab assays. The aim is simple: when you buy a
                Lakadong from Kopahi, you should be able to trace it back to the slope it grew on.
              </p>
            </div>
          </div>
        </section>


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


        <Section tone="ivory">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>→ Frequently Asked</Eyebrow>
            <h2 className="mt-6 font-display font-light text-3xl sm:text-4xl leading-tight">
              The <span className="accent-italic">GI</span> Questions, Answered.
            </h2>
            <dl className="mt-12 divide-y divide-(--color-bamboo)/25 border-y border-(--color-bamboo)/25">
              {GI_FAQS.map((q) => (
                <div key={q.question} className="py-8">
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
