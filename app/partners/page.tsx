import { Metadata } from "next";
import PartnersClient from "./client";
import { WithContext, BreadcrumbList } from "schema-dts";

export const metadata: Metadata = {
  title: "Partner Program | Oniromancy AI",
  description: "Join the Oniromancy AI Partner Program. Earn 30% commission by sharing dream interpretation and tarot insights with your audience.",
  alternates: {
    canonical: "https://www.oniromancy.com/partners",
  },
  openGraph: {
    title: "Partner Program | Oniromancy AI",
    description: "Join the Oniromancy AI Partner Program. Earn 30% commission by sharing dream interpretation and tarot insights.",
    url: "https://www.oniromancy.com/partners",
    type: "website",
  },
};

export default function PartnersPage() {
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
        name: "Partners",
        item: "https://www.oniromancy.com/partners",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PartnersClient />
    </>
  );
}
