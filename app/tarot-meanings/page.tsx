import { Metadata } from "next";
import Link from "next/link";
import { getAllTarotCards } from "./data";
import { ArrowRight } from "lucide-react";
import { WithContext, BreadcrumbList, CollectionPage } from "schema-dts";

export const metadata: Metadata = {
  title: "Tarot Card Meanings & Interpretations | Oniromancy AI",
  description: "Explore the complete list of Tarot card meanings. Deep dive into the symbolism, upright and reversed interpretations, and Jungian archetypes of the Major Arcana.",
  keywords: ["Tarot Meanings", "Tarot Card List", "Major Arcana Meanings", "Tarot Guide", "Learn Tarot"],
  alternates: {
    canonical: "https://www.oniromancy.com/tarot-meanings",
  },
  openGraph: {
    title: "Tarot Card Meanings & Interpretations | Oniromancy AI",
    description: "Explore the complete list of Tarot card meanings. Deep dive into the symbolism, upright and reversed interpretations.",
    url: "https://www.oniromancy.com/tarot-meanings",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarot Card Meanings & Interpretations | Oniromancy AI",
    description: "Explore the complete list of Tarot card meanings. Deep dive into the symbolism, upright and reversed interpretations.",
  },
};

export default function TarotMeaningsPage() {
  const cards = getAllTarotCards();

  const collectionJsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tarot Card Meanings",
    description: "Complete guide to Major Arcana tarot card meanings, symbolism, and archetypes.",
    url: "https://www.oniromancy.com/tarot-meanings",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cards.map((card, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: card.name,
        url: `https://www.oniromancy.com/tarot-meanings/${card.slug}`
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
        name: "Tarot Meanings",
        item: "https://www.oniromancy.com/tarot-meanings",
      },
    ],
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 px-4 md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="text-center space-y-6 mt-12">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-mystic-gold">
          The Fool&apos;s Journey
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
          Tarot Card <span className="text-purple-300">Meanings</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-serif italic">
          &quot;The Tarot is a pictorial history of the soul&apos;s journey.&quot;
        </p>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Explore the archetypal wisdom of the Major Arcana. Click on any card to discover its deep psychological symbolism, astrological associations, and divinatory meanings.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/tarot-meanings/${card.slug}`}
            className="group relative bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:border-purple-500/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-300 font-display font-bold border border-purple-500/20">
                {parseInt(card.id)}
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-mystic-gold group-hover:translate-x-1 transition-all" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
              {card.name}
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {card.keywords.slice(0, 3).map((keyword, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded-full bg-black/20 text-slate-400 border border-white/5">
                  {keyword}
                </span>
              ))}
            </div>
            
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
