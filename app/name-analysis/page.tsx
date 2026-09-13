import { Metadata } from "next";
import { WithContext, Service, BreadcrumbList } from "schema-dts";
import DivinationRouteClient from "./client";

export const metadata: Metadata = {
  title: "Free Name Numerology Reading — Five Grids | Oniromancy AI",
  description: "What does your name say about you? An AI reading in the Chinese Five Grids tradition: character, fortune, relationships and how to live well with your name.",
  keywords: ["name numerology", "Chinese name analysis", "five grids", "姓名五格", "name meaning", "what my name says about me"],
  alternates: {
    canonical: "https://www.oniromancy.com/name-analysis",
  },
  openGraph: {
    title: "Free Name Numerology Reading — Five Grids | Oniromancy AI",
    description: "What does your name say about you? An AI reading in the Chinese Five Grids tradition: character, fortune, relationships and how to live well with your name.",
    url: "https://www.oniromancy.com/name-analysis",
    type: "website",
  },
};

const jsonLd: WithContext<Service> = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Name Numerology Reading",
  serviceType: "Numerology Service",
  provider: {
    "@type": "Organization",
    name: "Oniromancy AI",
    url: "https://www.oniromancy.com",
  },
  description: "What does your name say about you? An AI reading in the Chinese Five Grids tradition: character, fortune, relationships and how to live well with your name.",
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://www.oniromancy.com/name-analysis",
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
      name: "Name Reading",
      item: "https://www.oniromancy.com/name-analysis",
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
