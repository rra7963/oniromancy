import { Metadata } from "next";
import TarotPageClient from "./client";
import { WithContext, Service, BreadcrumbList } from 'schema-dts';

export const metadata: Metadata = {
  title: "Free AI Tarot Reading Online | Oniromancy AI",
  description: "Get instant, free AI Tarot readings online. Explore love, career, and daily tarot card meanings with deep psychological and spiritual insights.",
  keywords: ["Tarot Reading", "Free Tarot", "Online Tarot", "Tarot Cards", "Love Tarot", "Career Tarot", "AI Tarot"],
  alternates: {
    canonical: "https://www.oniromancy.com/tarot",
  },
  openGraph: {
    title: "Free AI Tarot Reading Online | Oniromancy AI",
    description: "Get instant, free AI Tarot readings online. Explore love, career, and daily tarot card meanings.",
    url: "https://www.oniromancy.com/tarot",
    type: "website",
  },
};

const jsonLd: WithContext<Service> = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Free AI Tarot Reading',
  serviceType: 'Fortune Telling Service',
  provider: {
    '@type': 'Organization',
    name: 'Oniromancy AI',
    url: 'https://www.oniromancy.com'
  },
  description: 'Free personalized tarot readings powered by AI and Jungian archetypes. Visualize your reading with generative art.',
  areaServed: 'Worldwide',
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: 'https://www.oniromancy.com/tarot',
    serviceLocation: {
      '@type': 'Place',
      name: 'Online'
    }
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
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
      name: "AI Tarot Reading",
      item: "https://www.oniromancy.com/tarot",
    },
  ],
};

export default function TarotPage() {
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
      <TarotPageClient />
    </>
  );
}
