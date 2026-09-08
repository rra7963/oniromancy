import React from "react";
import { Metadata } from "next";
import BlogClient from "./client";
import { WithContext, BreadcrumbList, CollectionPage } from "schema-dts";
import { blogPosts } from "./data";

export const metadata: Metadata = {
  title: "Blog - Dream Interpretation, Tarot & Astrology Articles | Oniromancy AI",
  description: "Read our latest articles on Dream Interpretation, Tarot card meanings, Horoscope predictions, and Jungian psychology. Learn how to unlock your subconscious.",
  keywords: ["Dream Blog", "Tarot Blog", "Astrology Articles", "Spiritual Blog", "Dream Interpretation Guide", "Tarot Guide"],
  alternates: {
    canonical: "https://www.oniromancy.com/blog",
  },
  openGraph: {
    title: "Oniromancy AI Blog - Dreams, Tarot & Astrology",
    description: "Insights, guides, and celestial updates to illuminate your spiritual journey. Explore dream interpretation, tarot, astrology, and more.",
    url: "https://www.oniromancy.com/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const collectionJsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Oniromancy AI Blog",
    description: "Articles and guides on dream interpretation, tarot reading, and astrology.",
    url: "https://www.oniromancy.com/blog",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.oniromancy.com/blog/${post.slug}`,
        name: post.title
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
        name: "Blog",
        item: "https://www.oniromancy.com/blog",
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
      <BlogClient />
    </>
  );
}
