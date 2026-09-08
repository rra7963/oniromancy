import React from "react";
import type { Metadata } from "next";
import { WithContext, BreadcrumbList } from "schema-dts";

export const metadata: Metadata = {
  title: "Privacy Policy | Oniromancy AI",
  description: "How Oniromancy AI collects, uses, and protects your dream data.",
  alternates: {
    canonical: "https://www.oniromancy.com/privacy",
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
      name: "Privacy Policy",
      item: "https://www.oniromancy.com/privacy",
    },
  ],
};

export default function PrivacyPolicy() {
  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[#020205] -z-20" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30 mix-blend-screen" />

      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-slate-400">
            Last Updated: December 22, 2025
          </p>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-emerald-400">
          <p className="lead text-lg text-slate-300">
            At Oniromancy AI, we consider your dreams to be sacred and personal. We are committed to protecting your privacy and ensuring that your journey into the subconscious remains safe and secure.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you:
          </p>
          <ul>
            <li>Submit a dream for interpretation.</li>
            <li>Create an account or subscribe to our newsletter.</li>
            <li>Contact us for support.</li>
          </ul>
          <p>
            The specific types of information may include:
          </p>
          <ul>
            <li><strong>Dream Content:</strong> The text descriptions of dreams you submit.</li>
            <li><strong>Contact Information:</strong> Your email address (if provided).</li>
            <li><strong>Usage Data:</strong> Anonymous analytics about how you interact with our website.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li><strong>Provide Interpretations:</strong> Your dream text is processed by our AI models (powered by OpenAI/Google) to generate interpretations. We do not use your dream content to train these public models.</li>
            <li><strong>Improve Our Service:</strong> We analyze usage trends to make Oniromancy AI better.</li>
            <li><strong>Communicate:</strong> If you subscribe, we send you updates and relevant content. You can unsubscribe at any time.</li>
          </ul>

          <h2>3. AI Processing & Data Sharing</h2>
          <p>
            Oniromancy AI uses third-party Artificial Intelligence providers (such as OpenAI and Google Gemini) to process your dream descriptions. 
          </p>
          <ul>
            <li><strong>Data Transmission:</strong> When you submit a dream, the text is securely transmitted to these providers via API.</li>
            <li><strong>No Training:</strong> We configure our API usage to opt-out of data training where possible, ensuring your personal dreams do not become part of the public AI knowledge base.</li>
            <li><strong>Anonymity:</strong> We recommend omitting real names or highly sensitive personal identifiers from your dream descriptions.</li>
          </ul>

          <h2>4. Cookies and Tracking</h2>
          <p>
            We use essential cookies to ensure the website functions correctly. We may also use anonymous analytics tools (like Google Analytics) to understand site traffic. You can control cookie preferences through your browser settings.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            Depending on your location, you may have the right to:
          </p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Request deletion of your data.</li>
            <li>Opt-out of marketing communications.</li>
          </ul>
          <p>
            To exercise these rights, please contact us at <a href="mailto:privacy@oniromancy.com">privacy@oniromancy.com</a>.
          </p>

          <h2>6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul>
            <li>By email: <a href="mailto:support@oniromancy.com">support@oniromancy.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
