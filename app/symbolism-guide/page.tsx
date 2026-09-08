import { Metadata } from "next";
import SymbolismGuideClient from "./client";
import { WithContext, BreadcrumbList, CollectionPage } from "schema-dts";
import { symbols } from "./data";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dream Symbolism Guide & Dictionary | Oniromancy AI",
  description: "Explore our comprehensive dream symbolism guide. Search for dream symbols, archetypes, and their meanings to decode your subconscious.",
  keywords: ["Dream Dictionary", "Dream Symbols", "Dream Meaning", "Dream Interpretation", "Symbolism Guide"],
  alternates: {
    canonical: "https://www.oniromancy.com/symbolism-guide",
  },
  openGraph: {
    title: "Dream Symbolism Guide & Dictionary | Oniromancy AI",
    description: "Explore our comprehensive dream symbolism guide. Search for dream symbols, archetypes, and their meanings.",
    url: "https://www.oniromancy.com/symbolism-guide",
    type: "website",
  },
};

export default function SymbolismGuidePage() {
  const collectionJsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dream Symbolism Guide",
    description: "A comprehensive dictionary of dream symbols and their Jungian interpretations.",
    url: "https://www.oniromancy.com/symbolism-guide",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: symbols.map((symbol, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: symbol.name,
        url: `https://www.oniromancy.com/symbolism-guide/${slugify(symbol.name)}`
      }))
    }
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
        name: "Symbolism Guide",
        item: "https://www.oniromancy.com/symbolism-guide",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SymbolismGuideClient />
    </>
  );
}
