import LenisProvider from "./components/marketing/LenisProvider";
import MarketingHeader from "./components/marketing/MarketingHeader";
import MarketingFooter from "./components/marketing/MarketingFooter";
import WhatsAppFab from "./components/marketing/WhatsAppFab";
import HomeStory from "./components/home/HomeStory";

// The homepage is the story: six full-screen chapters that slide left→right
// (Welcome → Our Story → Why Now → Our Origins → What We Do → Join the
// Journey), then the footer. Featured Origins now lives on the Journal.
export default function Home() {
  return (
    <LenisProvider>
      <MarketingHeader overHero />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <HomeStory />
        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
