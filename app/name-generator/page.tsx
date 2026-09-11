import { Metadata } from "next";
import { WithContext, Service, BreadcrumbList } from "schema-dts";
import DivinationRouteClient from "./client";

export const metadata: Metadata = {
  title: "Auspicious Chinese Name Generator | Oniromancy AI",
  description: "Get name suggestions chosen to balance your birth chart. The Four Pillars are cast first, the missing elements identified, and only then are names proposed — with meaning, pinyin and tone.",
  keywords: ["Chinese name generator", "baby name", "auspicious name", "起名", "五行取名", "name suggestions"],
  alternates: {
    canonical: "https://www.oniromancy.com/name-generator",
  },
  openGraph: {
    title: "Auspicious Chinese Name Generator | Oniromancy AI",
    description: "Get name suggestions chosen to balance your birth chart. The Four Pillars are cast first, the missing elements identified, and only then are names proposed — with meaning, pinyin and tone.",
    url: "https://www.oniromancy.com/name-generator",
    type: "website",
  },
};

const jsonLd: WithContext<Service> = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Auspicious Name Generator",
  serviceType: "Naming Service",
  provider: {
    "@type": "Organization",
    name: "Oniromancy AI",
    url: "https://www.oniromancy.com",
  },
  description: "Get name suggestions chosen to balance your birth chart. The Four Pillars are cast first, the missing elements identified, and only then are names proposed — with meaning, pinyin and tone.",
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://www.oniromancy.com/name-generator",
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
      name: "Name Generator",
      item: "https://www.oniromancy.com/name-generator",
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
