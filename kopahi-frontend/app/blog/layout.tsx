import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog · Stories from the field",
  description:
    "Recipes, farmer features, harvest notes and stories from across North East India — straight from the Kopahi journal.",
  openGraph: {
    title: "Kopahi Journal · Stories from the field",
    description:
      "Recipes, farmer features, harvest notes and stories from across North East India.",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
