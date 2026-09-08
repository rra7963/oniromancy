import React from "react";
import { Metadata } from "next";
import AboutClient from "./client";
import { WithContext, AboutPage as AboutPageSchema, BreadcrumbList } from "schema-dts";

export const metadata: Metadata = {
  title: "About Us - Bridging Mysticism & AI | Oniromancy AI",
  description: "Learn how Oniromancy AI combines Jungian psychology, ancient divination arts, and modern artificial intelligence to decode the subconscious.",
  alternates: {
    canonical: "https://www.oniromancy.com/about",
  },
  openGraph: {
    title: "About Us - Bridging Mysticism & AI | Oniromancy AI",
    description: "Discover the story and technology behind Oniromancy AI.",
    url: "https://www.oniromancy.com/about",
    type: "website",
  },
};

export default function AboutPage() {
  const jsonLd: WithContext<AboutPageSchema> = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Oniromancy AI",
    description: "Oniromancy AI combines Jungian psychology with generative AI to interpret dreams and tarot.",
    mainEntity: {
      "@type": "Organization",
      name: "Oniromancy AI",
      foundingDate: "2024",
      description: "AI-powered dream interpretation and divination platform.",
      logo: "https://www.oniromancy.com/icon.svg"
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
        name: "About Us",
        item: "https://www.oniromancy.com/about",
      },
    ],
  };

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
      <AboutClient />
    </>
  );
}
