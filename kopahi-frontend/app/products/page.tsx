import type { Metadata } from "next";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import CatalogClient from "./CatalogClient";
import { buildMetadata } from "../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop Authentic Northeast Indian Produce · Kopahi",
  description:
    "Buy GI-tagged Lakadong turmeric, Keteki Joha rice, Bhoot Jolokia, Assam tea and more — sourced direct from Northeast India farmers. FSSAI certified.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <section className="pt-28 sm:pt-32 pb-12 sm:pb-16">
          <div className="mx-auto max-w-shell px-5 lg:px-8">
            <Eyebrow>Origins</Eyebrow>
            <Headline as="h1" className="mt-4 max-w-4xl" accent="Origin First.">
              Every Tile Is A Place.
            </Headline>
            <p className="mt-6 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              We do not stock SKUs. We carry geographies — and the people, protocols and patience each one requires.
            </p>
          </div>
        </section>


        <Section tone="ivory">
          <CatalogClient />
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
