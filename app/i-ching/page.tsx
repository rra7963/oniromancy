import { Metadata } from "next";
import { WithContext, Service, BreadcrumbList } from "schema-dts";
import DivinationRouteClient from "./client";

export const metadata: Metadata = {
  title: "Free I Ching Reading — Plum Blossom Oracle | Oniromancy AI",
  description: "Ask a question, pick two numbers, and the oracle casts a hexagram in the Plum Blossom Numerology tradition — primary hexagram, moving line, relating hexagram and a direct answer.",
  keywords: ["I Ching reading", "hexagram", "Plum Blossom Numerology", "梅花易数", "Book of Changes", "free I Ching"],
  alternates: {
    canonical: "https://www.oniromancy.com/i-ching",
  },
  openGraph: {
    title: "Free I Ching Reading — Plum Blossom Oracle | Oniromancy AI",
    description: "Ask a question, pick two numbers, and the oracle casts a hexagram in the Plum Blossom Numerology tradition — primary hexagram, moving line, relating hexagram and a direct answer.",
    url: "https://www.oniromancy.com/i-ching",
    type: "website",
  },
};

const jsonLd: WithContext<Service> = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "I Ching Plum Blossom Oracle",
  serviceType: "Divination Service",
  provider: {
    "@type": "Organization",
    name: "Oniromancy AI",
    url: "https://www.oniromancy.com",
  },
  description: "Ask a question, pick two numbers, and the oracle casts a hexagram in the Plum Blossom Numerology tradition — primary hexagram, moving line, relating hexagram and a direct answer.",
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://www.oniromancy.com/i-ching",
    serviceLocation: {
      "@type": "Place",
      name: "Online",
    },
  },
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
    {
      "@type": "ListItem",
      position: 3,
      name: "I Ching",
      item: "https://www.oniromancy.com/i-ching",
    },
  ],
};

export default function Page() {
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
      <DivinationRouteClient />
    </>
  );
}
