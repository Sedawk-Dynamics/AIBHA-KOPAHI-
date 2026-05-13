import type { Metadata } from "next";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
import OrganicDivider from "../components/marketing/OrganicDivider";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Origins · GI-tagged catalog",
  description:
    "Browse Kopahi's catalog of GI-tagged tea, spices, silk, rice, beverages and craft from across the seven sister states of Northeast India.",
};

export default function ProductsPage() {
  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <section className="pt-32 sm:pt-40 pb-12 sm:pb-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>Origins</Eyebrow>
            <Headline as="h1" className="mt-6 max-w-4xl" accent="Origin First.">
              Every Tile Is A Place.
            </Headline>
            <p className="mt-10 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              We do not stock SKUs. We carry geographies — and the people, protocols and patience each one requires.
            </p>
          </div>
        </section>

        <OrganicDivider />

        <Section tone="ivory">
          <CatalogClient />
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
