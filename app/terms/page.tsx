import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { WithContext, BreadcrumbList } from "schema-dts";

export const metadata: Metadata = {
  title: "Terms of Service | Oniromancy AI",
  description: "Terms and conditions for using Oniromancy AI.",
  alternates: {
    canonical: "https://www.oniromancy.com/terms",
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
      name: "Terms of Service",
      item: "https://www.oniromancy.com/terms",
    },
  ],
};

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[#020205] -z-20" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30 mix-blend-screen" />

      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-slate-400">
            Last Updated: December 22, 2025
          </p>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-emerald-400">
          <p className="lead text-lg text-slate-300">
            Please read these Terms of Service (&quot;Terms&quot;) carefully before using the Oniromancy AI website (the &quot;Service&quot;) operated by Oniromancy AI (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
          </p>
          <p>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <h2>1. Entertainment Purposes Only</h2>
          <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-6 my-6">
            <h3 className="text-red-300 font-bold mt-0">Disclaimer: Not Medical or Professional Advice</h3>
            <p className="text-slate-300 mb-0">
              The interpretations, horoscopes, and tarot readings provided by Oniromancy AI are for <strong>entertainment and self-reflection purposes only</strong>. They do not constitute psychological, medical, legal, or financial advice.
            </p>
            <p className="text-slate-300 mb-0 mt-4">
              If you are experiencing a mental health crisis, please contact a qualified mental health professional or your local emergency services immediately.
            </p>
          </div>

          <h2>2. Age Restriction</h2>
          <p>
            You must be at least 12 years old to use this Service. By accessing or using the Service, you warrant and represent that you are at least 12 years of age.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Oniromancy AI and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>

          <h2>4. User Content</h2>
          <p>
            Our Service allows you to submit dream descriptions (&quot;Content&quot;). You retain ownership of your Content, but you grant us a license to use, process, and display that Content solely for the purpose of providing the Service to you (i.e., generating interpretations).
          </p>
          <p>
            You agree not to submit Content that:
          </p>
          <ul>
            <li>Is unlawful, threatening, abusive, or harassing.</li>
            <li>Violates the privacy or rights of others.</li>
            <li>Contains malicious code or viruses.</li>
          </ul>

          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall Oniromancy AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul>
            <li>Your access to or use of or inability to access or use the Service;</li>
            <li>Any content obtained from the Service;</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
          </ul>

          <h2>6. Third-Party Services</h2>
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by Oniromancy AI. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
          </p>

          <h2>7. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:support@oniromancy.com">support@oniromancy.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
