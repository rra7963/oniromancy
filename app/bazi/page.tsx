import { Metadata } from "next";
import { WithContext, Service, BreadcrumbList } from "schema-dts";
import DivinationRouteClient from "./client";

export const metadata: Metadata = {
  title: "Free BaZi Reading — Four Pillars of Destiny | Oniromancy AI",
  description: "Cast your BaZi chart from your exact birth moment and get an AI reading of your Four Pillars: elemental balance, Day Master, wealth, love, health and career.",
  keywords: ["BaZi reading", "Four Pillars of Destiny", "Chinese astrology", "birth chart", "生辰八字", "Day Master", "Chinese zodiac"],
  alternates: {
    canonical: "https://www.oniromancy.com/bazi",
  },
  openGraph: {
    title: "Free BaZi Reading — Four Pillars of Destiny | Oniromancy AI",
    description: "Cast your BaZi chart from your exact birth moment and get an AI reading of your Four Pillars: elemental balance, Day Master, wealth, love, health and career.",
    url: "https://www.oniromancy.com/bazi",
    type: "website",
  },
};

const jsonLd: WithContext<Service> = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "BaZi Four Pillars Reading",
  serviceType: "Chinese Astrology Service",
  provider: {
    "@type": "Organization",
    name: "Oniromancy AI",
    url: "https://www.oniromancy.com",
  },
  description: "Cast your BaZi chart from your exact birth moment and get an AI reading of your Four Pillars: elemental balance, Day Master, wealth, love, health and career.",
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://www.oniromancy.com/bazi",
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
      name: "BaZi Reading",
      item: "https://www.oniromancy.com/bazi",
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
