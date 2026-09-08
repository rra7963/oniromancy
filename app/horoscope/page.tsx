import { Metadata } from "next";
import HoroscopePageClient from "./client";
import { WithContext, Service, BreadcrumbList } from 'schema-dts';

export const metadata: Metadata = {
  title: "Free Daily Horoscope & Astrology | Oniromancy AI",
  description: "Check your free daily horoscope and astrological predictions for all zodiac signs: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.",
  keywords: ["Daily Horoscope", "Free Horoscope", "Astrology", "Zodiac Signs", "Horoscope Today", "Astrological Predictions"],
  alternates: {
    canonical: "https://www.oniromancy.com/horoscope",
  },
  openGraph: {
    title: "Free Daily Horoscope & Astrology | Oniromancy AI",
    description: "Check your free daily horoscope and astrological predictions for all zodiac signs.",
    url: "https://www.oniromancy.com/horoscope",
    type: "website",
  },
};

const jsonLd: WithContext<Service> = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Free Daily Horoscope',
  serviceType: 'Astrology Service',
  provider: {
    '@type': 'Organization',
    name: 'Oniromancy AI',
    url: 'https://www.oniromancy.com'
  },
  description: 'Free daily astrological insights and celestial guidance tailored to your zodiac sign, combining traditional astrology with AI analysis.',
  areaServed: 'Worldwide',
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: 'https://www.oniromancy.com/horoscope',
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
      name: "Daily Horoscope",
      item: "https://www.oniromancy.com/horoscope",
    },
  ],
};

export default function HoroscopePage() {
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
      <HoroscopePageClient />
    </>
  );
}
