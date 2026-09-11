import { Metadata } from "next";
import { WithContext, Service, BreadcrumbList } from "schema-dts";
import DivinationRouteClient from "./client";

export const metadata: Metadata = {
  title: "Love Compatibility Test by Name | Oniromancy AI",
  description: "Give two names and the oracle scores the connection: what flows, what grates, what the months ahead hold, and one thing to try this week. For entertainment.",
  keywords: ["love compatibility", "name compatibility test", "soulmate reading", "姻缘", "relationship oracle", "love calculator"],
  alternates: {
    canonical: "https://www.oniromancy.com/love-match",
  },
  openGraph: {
    title: "Love Compatibility Test by Name | Oniromancy AI",
    description: "Give two names and the oracle scores the connection: what flows, what grates, what the months ahead hold, and one thing to try this week. For entertainment.",
    url: "https://www.oniromancy.com/love-match",
    type: "website",
  },
};

const jsonLd: WithContext<Service> = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Love Compatibility Oracle",
  serviceType: "Entertainment Service",
  provider: {
    "@type": "Organization",
    name: "Oniromancy AI",
    url: "https://www.oniromancy.com",
  },
  description: "Give two names and the oracle scores the connection: what flows, what grates, what the months ahead hold, and one thing to try this week. For entertainment.",
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: "https://www.oniromancy.com/love-match",
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
      name: "Love Match",
      item: "https://www.oniromancy.com/love-match",
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
