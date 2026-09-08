import type { Metadata } from "next";
import { WithContext, BreadcrumbList } from "schema-dts";

export const metadata: Metadata = {
  title: "Contact Support | Oniromancy AI",
  description: "Get in touch with the Oniromancy AI team. We are here to help with your account, readings, or any technical inquiries.",
  alternates: {
    canonical: "https://www.oniromancy.com/contact",
  },
  openGraph: {
    title: "Contact Support | Oniromancy AI",
    description: "Get in touch with the Oniromancy AI team.",
    url: "https://www.oniromancy.com/contact",
    type: "website",
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
      name: "Contact",
      item: "https://www.oniromancy.com/contact",
    },
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
