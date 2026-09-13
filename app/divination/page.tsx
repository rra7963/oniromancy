import { Metadata } from "next";
import { WithContext, ItemList, BreadcrumbList } from "schema-dts";
import { DIVINATIONS } from "../../lib/divination";
import DivinationHubClient from "./client";

export const metadata: Metadata = {
  title: "AI Divination — Tarot, BaZi, I Ching, Dreams | Oniromancy AI",
  description:
    "Every oracle in one place: dream interpretation, tarot, daily horoscope, BaZi Four Pillars, name numerology, auspicious naming, I Ching and love compatibility.",
  keywords: [
    "AI divination",
    "online fortune telling",
    "tarot",
    "BaZi",
    "I Ching",
    "dream interpretation",
    "name numerology",
    "love compatibility",
  ],
  alternates: {
    canonical: "https://www.oniromancy.com/divination",
  },
  openGraph: {
    title: "AI Divination — Tarot, BaZi, I Ching, Dreams | Oniromancy AI",
    description:
      "Every oracle in one place: dreams, tarot, horoscope, BaZi, name numerology, naming, I Ching and love compatibility.",
    url: "https://www.oniromancy.com/divination",
    type: "website",
  },
};

const jsonLd: WithContext<ItemList> = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AI Divination Services",
  itemListElement: [
    { slug: "", name: "Dream Interpretation" },
    { slug: "tarot", name: "Tarot Reading" },
    { slug: "horoscope", name: "Daily Horoscope" },
    ...DIVINATIONS.map((d) => ({ slug: d.slug, name: d.title })),
  ].map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.name,
    url: `https://www.oniromancy.com/${item.slug}`,
  })),
};

const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.oniromancy.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Divination",
      item: "https://www.oniromancy.com/divination",
    },
  ],
};

export default function DivinationHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <DivinationHubClient />
    </>
  );
}
