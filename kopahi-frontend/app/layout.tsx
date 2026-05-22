import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import CookieBanner from "./components/marketing/CookieBanner";
import CartDrawer from "./components/marketing/CartDrawer";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kopahi — Authentic by Geography, Pure by Nature",
    template: "%s · Kopahi",
  },
  description:
    "Kopahi sources, processes, brands and exports the GI-tagged heritage of Northeast India — tea, silk, spices, rice, honey and handcraft from seven sister states.",
  keywords: [
    "Kopahi",
    "AIBA AGRI NE LLP",
    "GI tagged",
    "Northeast India",
    "Assam tea",
    "Muga silk",
    "Lakadong turmeric",
    "Bhut Jolokia",
    "Joha rice",
    "heritage agri export",
  ],
  metadataBase: new URL("https://kopahi.com"),
  openGraph: {
    title: "Kopahi — Authentic by Geography, Pure by Nature",
    description:
      "GI-certified heritage of Northeast India — farm to story, soil to export.",
    url: "https://kopahi.com",
    siteName: "Kopahi",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kopahi — Authentic by Geography, Pure by Nature",
    description:
      "GI-certified heritage of Northeast India — farm to story, soil to export.",
  },
  // Favicons are picked up from app/icon.png and app/apple-icon.png — no
  // explicit `icons` block needed (Next.js auto-injects the link tags).
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-(--color-ivory) text-(--color-ink)">
        <Providers>
          {children}
          <CartDrawer />
        </Providers>
        <CookieBanner />
      </body>
    </html>
  );
}
