import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import CookieBanner from "./components/marketing/CookieBanner";
import CartDrawer from "./components/marketing/CartDrawer";
import { SITE, organizationJsonLd, ldScript } from "./lib/seo";

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
    default: "Kopahi — GI-Tagged Heritage of Northeast India",
    template: "%s · Kopahi",
  },
  description:
    "Authentic, GI-certified produce and craft from Assam, Meghalaya, Nagaland, and four more Northeast states. Sourced direct from farmers. Shipped pan-India.",
  keywords: [
    "Kopahi",
    "AIBA AGRI NE LLP",
    "GI tagged products India",
    "Northeast India",
    "Assam tea",
    "Muga silk",
    "Lakadong turmeric",
    "Bhut Jolokia",
    "Joha rice",
    "heritage agri export",
  ],
  metadataBase: new URL(SITE),
  alternates: { canonical: SITE },
  openGraph: {
    title: "Kopahi — GI-Tagged Heritage of Northeast India",
    description:
      "GI-certified heritage of Northeast India — farm to story, soil to export.",
    url: SITE,
    siteName: "Kopahi",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kopahi — GI-Tagged Heritage of Northeast India",
    description:
      "GI-certified heritage of Northeast India — farm to story, soil to export.",
  },
  robots: { index: true, follow: true },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={ldScript(organizationJsonLd())}
        />
        <Providers>
          {children}
          <CartDrawer />
        </Providers>
        <CookieBanner />
      </body>
    </html>
  );
}
