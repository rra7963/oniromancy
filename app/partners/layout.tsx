import React from "react";
import { Metadata } from "next";
import { WithContext, BreadcrumbList } from "schema-dts";

export const metadata: Metadata = {
  title: "Partner Program - Join the Circle | Oniromancy AI",
  description: "Join the Oniromancy AI Partner Program. Earn revenue by sharing dream interpretation and tarot insights with your audience.",
  alternates: {
    canonical: "https://www.oniromancy.com/partners",
  },
  openGraph: {
    title: "Partner Program - Join the Circle | Oniromancy AI",
    description: "Earn revenue by sharing dream interpretation and tarot insights.",
    url: "https://www.oniromancy.com/partners",
    type: "website",
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        name: "Partner Program",
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
      {children}
    </>
  );
}
