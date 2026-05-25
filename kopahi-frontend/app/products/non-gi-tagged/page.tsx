import type { Metadata } from "next";
import NonGiTaggedClient from "./NonGiTaggedClient";
import { buildMetadata, breadcrumbJsonLd, ldScript } from "../../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Tea, Spices & Powders from Northeast India · Kopahi",
  description:
    "Sun-dried spice powders, herbal blends, premium Assam tea, and small-batch specialty preserves. Curated from the same farmer network as our GI catalogue.",
  path: "/products/non-gi-tagged",
});

export default function NonGiTaggedPage() {
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Tea & Spices", path: "/products/non-gi-tagged" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(crumbsLd)} />
      <NonGiTaggedClient />
    </>
  );
}
