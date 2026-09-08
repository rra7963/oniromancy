import { Metadata } from "next";
import PricingPageClient from "./client";
import { WithContext, BreadcrumbList } from "schema-dts";

export const metadata: Metadata = {
  title: "Pricing & Credits | Oniromancy AI",
  description: "Unlock premium features, purchase credits, or subscribe to the Mystic Tier for deeper insights.",
  alternates: {
    canonical: "https://www.oniromancy.com/pricing",
  },
  openGraph: {
    title: "Pricing & Credits | Oniromancy AI",
    description: "Unlock premium features, purchase credits, or subscribe to the Mystic Tier for deeper insights.",
    url: "https://www.oniromancy.com/pricing",
    type: "website",
  },
};

export default function PricingPage() {
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
        name: "Pricing",
        item: "https://www.oniromancy.com/pricing",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PricingPageClient />
    </>
  );
}
