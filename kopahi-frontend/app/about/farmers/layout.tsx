import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, ldScript } from "../../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Meet Our Farmers — Northeast India · Kopahi",
  description:
    "The growers behind every Kopahi product — from Sualkuchi weavers to Karbi Anglong rice farmers to Kohima chilli partners. Names, villages, payouts.",
  path: "/about/farmers",
});

const crumbsLd = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Farmers", path: "/about/farmers" },
]);

export default function AboutFarmersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(crumbsLd)} />
      {children}
    </>
  );
}
