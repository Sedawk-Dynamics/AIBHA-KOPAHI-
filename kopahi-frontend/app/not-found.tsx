import Link from "next/link";
import type { Metadata } from "next";

import LenisProvider from "./components/marketing/LenisProvider";
import MarketingHeader from "./components/marketing/MarketingHeader";
import MarketingFooter from "./components/marketing/MarketingFooter";
import WhatsAppFab from "./components/marketing/WhatsAppFab";
import Eyebrow from "./components/marketing/Eyebrow";

export const metadata: Metadata = {
  title: "Off the map",
};

export default function NotFound() {
  return (
    <LenisProvider>
      <MarketingHeader />
      <main className="bg-(--color-ivory) text-(--color-ink) min-h-[70vh] flex items-center">
        <div className="mx-auto max-w-3xl px-6 sm:px-8 py-32 sm:py-40 text-center">
          <Eyebrow>Off the map</Eyebrow>
          <h1 className="mt-6 font-display font-light tracking-tight text-[clamp(3rem,8vw,6rem)] leading-[0.95] text-(--color-ink)">
            We don&apos;t source from <span className="accent-italic">there.</span>
          </h1>
          <p className="mt-8 max-w-xl mx-auto font-display italic text-lg text-(--color-bamboo)">
            The page you were looking for isn&apos;t in our footprint. Take the trail back to the seven sisters.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
            >
              Back to Kopahi
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-7 py-4 border border-(--color-moss)/60 text-(--color-moss) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-moss) hover:text-(--color-ivory) transition-colors"
            >
              Browse origins
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
      <WhatsAppFab />
    </LenisProvider>
  );
}
