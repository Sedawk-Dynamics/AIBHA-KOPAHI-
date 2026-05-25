import type { Metadata } from "next";

export const SITE = "https://kopahi.com";
export const SITE_NAME = "Kopahi";
export const LEGAL_NAME = "AIBA AGRI NE LLP";
export const DEFAULT_OG = `${SITE}/og/default.jpg`;

export const ORG_ADDRESS = {
  streetAddress: "Bye Lane 2, Suraj Nagar, NA Ali",
  addressLocality: "Jorhat",
  addressRegion: "Assam",
  postalCode: "785001",
  addressCountry: "IN",
} as const;

export const ORG_GEO = { latitude: 26.7509, longitude: 94.2037 } as const;

export const ORG_CONTACT = {
  email: "info@kopahi.com",
  phone: "+91-91810-16660",
} as const;

export const ORG_SAMEAS = [
  "https://www.instagram.com/kopahi.com",
  "https://www.linkedin.com/company/kopahi",
  "https://www.facebook.com/kopahi.com",
  "https://www.youtube.com/@kopahi",
] as const;

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  keywords,
  noIndex,
}: BuildMetadataInput): Metadata {
  const url = `${SITE}${path}`;
  const ogImage = image ? (image.startsWith("http") ? image : `${SITE}${image}`) : DEFAULT_OG;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_IN",
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE}/#organization`,
    name: SITE_NAME,
    alternateName: LEGAL_NAME,
    url: SITE,
    logo: `${SITE}/Logo1.png`,
    description:
      "Sourcing, processing, branding and exporting the GI-tagged heritage of seven Northeast Indian states.",
    email: ORG_CONTACT.email,
    telephone: ORG_CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      ...ORG_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...ORG_GEO,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    founder: [
      { "@type": "Person", name: "Barsha Prakash Choudhury", jobTitle: "Founder" },
      { "@type": "Person", name: "Ashreeta Gogoi", jobTitle: "Founder" },
      { "@type": "Person", name: "Trideep Khanikar", jobTitle: "Director · Operations" },
      { "@type": "Person", name: "Prakash Natarajan", jobTitle: "Director · Sales & Marketing" },
    ],
    sameAs: [...ORG_SAMEAS],
  };
}

export type Crumb = { name: string; path?: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path && { item: `${SITE}${c.path}` }),
    })),
  };
}

type FAQItem = { question: string; answer: string };

export function faqJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}

export function ldScript(json: unknown) {
  return {
    __html: JSON.stringify(json),
  };
}
