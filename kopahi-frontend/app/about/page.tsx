import type { Metadata } from "next";
import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, ldScript } from "../lib/seo";
import AboutStory from "./AboutStory";
import { ABOUT_FAQS } from "./aboutData";
export const metadata: Metadata = buildMetadata({
  title: "Our Story — Rooted in Seven States · Kopahi",
  description:
    "Kopahi brings the exceptional produce and craftsmanship of Northeast India to global markets — an AIBA Agri NE LLP brand working directly with farmers and weavers.",
  path: "/about",
});


export default function AboutPage() {
  return <LenisProvider>
    <MarketingHeader overHero />
    <main className="bg-(--color-ivory) text-(--color-ink)">
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(faqJsonLd(ABOUT_FAQS))} />
      <AboutStory />
      <MarketingFooter />
    </main>
    <WhatsAppFab />
  </LenisProvider>;
}
