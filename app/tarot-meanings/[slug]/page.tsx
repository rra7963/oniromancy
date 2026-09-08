import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTarotCardBySlug, getAllTarotCards } from "../data";
import { 
  ArrowLeft, 
  Sparkles, 
  Star, 
  Moon, 
  Sun, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain,
  ArrowRight,
  BookOpen,
  Heart,
  Briefcase,
  Coins,
  CheckCircle2,
  Hash
} from "lucide-react";
import { WithContext, Article, BreadcrumbList } from "schema-dts";
import { ShareButtons } from "@/components/ShareButtons";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = getTarotCardBySlug(slug);
  
  if (!card) {
    return {
      title: "Card Not Found",
    };
  }

  const title = `${card.name} Tarot Card Meaning: Upright, Reversed & Love | Oniromancy AI`;
  const description = `Detailed meaning of ${card.name} Tarot card. Discover its interpretation for Love, Career, Finance (${card.meaningFinance}), and Yes/No verdict. Learn about its ${card.element} element and ${card.astrology || 'N/A'} connection.`;

  return {
    title,
    description,
    keywords: [
      card.name, 
      `${card.name} Tarot Meaning`, 
      `${card.name} Love Meaning`,
      `${card.name} Career`,
      `${card.name} Yes or No`,
      `${card.name} Upright`, 
      `${card.name} Reversed`, 
      "Tarot Interpretation", 
      "Major Arcana", 
      card.archetype,
      ...(card.keywords || [])
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: card.image,
          width: 800,
          height: 1200,
          alt: `${card.name} Tarot Card`,
        },
      ],
    },
    alternates: {
      canonical: `https://www.oniromancy.com/tarot-meanings/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card.image],
    },
  };
}

export async function generateStaticParams() {
  const cards = getAllTarotCards();
  return cards.map((card) => ({
    slug: card.slug,
  }));
}

function ElementIcon({ element }: { element: string }) {
  switch (element) {
    case "Fire": return <Flame className="w-5 h-5 text-orange-400" />;
    case "Water": return <Droplets className="w-5 h-5 text-blue-400" />;
    case "Air": return <Wind className="w-5 h-5 text-sky-200" />;
    case "Earth": return <Mountain className="w-5 h-5 text-emerald-400" />;
    default: return <Sparkles className="w-5 h-5 text-mystic-gold" />;
  }
}

function getCardNavigation(currentSlug: string) {
  const cards = getAllTarotCards();
  const currentIndex = cards.findIndex(c => c.slug === currentSlug);
  
  if (currentIndex === -1) return { prev: null, next: null, allCards: cards };

  const prev = currentIndex > 0 ? cards[currentIndex - 1] : cards[cards.length - 1];
  const next = currentIndex < cards.length - 1 ? cards[currentIndex + 1] : cards[0];

  return { prev, next, allCards: cards };
}

export default async function TarotCardDetailPage({ params }: Props) {
  const { slug } = await params;
  const card = getTarotCardBySlug(slug);

  if (!card) {
    notFound();
  }

  const { prev, next, allCards } = getCardNavigation(slug);
  
  // Deterministic shuffle for "Explore Other Cards"
  // We use the current card's index to offset the slice, ensuring rotation
  const currentIndex = allCards.findIndex(c => c.slug === slug);
  const otherCards = [
    ...allCards.slice(currentIndex + 1),
    ...allCards.slice(0, currentIndex)
  ].slice(0, 4);

  // SEO: Structured Data
  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${card.name} Tarot Card Meaning: Upright & Reversed`,
    image: [
      `https://www.oniromancy.com${card.image}`
    ],
    description: card.description,
    author: {
      "@type": "Organization",
      name: "Oniromancy AI"
    },
    publisher: {
      "@type": "Organization",
      name: "Oniromancy AI",
      logo: {
        "@type": "ImageObject",
        url: "https://www.oniromancy.com/icon.svg"
      }
    },
    datePublished: "2024-01-01T00:00:00+00:00", // Should ideally be dynamic
    dateModified: new Date().toISOString(),
    keywords: [
      card.name, 
      `${card.name} Tarot Meaning`, 
      "Tarot Interpretation", 
      card.archetype,
      ...(card.keywords || [])
    ].join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.oniromancy.com/tarot-meanings/${slug}`
    },
    mainEntity: {
      "@type": "Question",
      name: `What is the meaning of the ${card.name} Tarot card?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: card.description,
      },
    }
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.oniromancy.com" },
      { "@type": "ListItem", position: 2, name: "Tarot Meanings", item: "https://www.oniromancy.com/tarot-meanings" },
      { "@type": "ListItem", position: 3, name: card.name, item: `https://www.oniromancy.com/tarot-meanings/${slug}` }
    ]
  };

  return (
    <div className="w-full min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mb-8 mt-4">
        <Link
          href="/tarot-meanings"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tarot Meanings
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">
          {/* Left Column: Image & Card Stats */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="relative aspect-[2/3] w-full max-w-sm mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(168,85,247,0.25)] group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <Image
                src={card.image}
                alt={card.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute bottom-6 left-6 z-20">
                <div className="text-6xl font-display font-bold text-white/10 leading-none mb-2 select-none">
                  {card.id}
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center backdrop-blur-sm">
                <div className="mb-2 p-2 bg-purple-500/10 rounded-full">
                  <ElementIcon element={card.element} />
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Element
                </span>
                <span className="text-white font-medium">{card.element}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center backdrop-blur-sm">
                <div className="mb-2 p-2 bg-blue-500/10 rounded-full">
                  {card.astrology ? (
                    <Moon className="w-5 h-5 text-blue-300" />
                  ) : (
                    <Star className="w-5 h-5 text-yellow-300" />
                  )}
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Astrology
                </span>
                <span className="text-white font-medium">
                  {card.astrology || "N/A"}
                </span>
              </div>
            </div>

            {/* Keywords Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {card.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-200 text-sm"
                >
                  #{keyword}
                </span>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="flex justify-center pt-4">
              <ShareButtons title={`${card.name} Tarot Meaning`} url={`https://www.oniromancy.com/tarot-meanings/${slug}`} />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-12">
            {/* Header */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mystic-gold/10 border border-mystic-gold/20 text-mystic-gold text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>Major Arcana • {card.id}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight">
                {card.name}
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed font-serif italic border-l-4 border-purple-500/50 pl-6 py-2 bg-white/5 rounded-r-lg">
                &quot;{card.description}&quot;
              </p>
            </div>

            {/* Meanings Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Upright */}
              <div className="bg-gradient-to-br from-emerald-900/10 to-transparent border border-emerald-500/20 rounded-2xl p-8 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ArrowRight className="w-24 h-24 -rotate-45" />
                </div>
                <h3 className="text-2xl font-display font-bold text-emerald-400 mb-4 flex items-center gap-3">
                  <span className="p-2 bg-emerald-500/10 rounded-lg">
                    <Sun className="w-5 h-5" />
                  </span>
                  Upright
                </h3>
                <p className="text-slate-300 leading-relaxed">{card.upright}</p>
              </div>

              {/* Reversed */}
              <div className="bg-gradient-to-br from-red-900/10 to-transparent border border-red-500/20 rounded-2xl p-8 relative overflow-hidden group hover:border-red-500/40 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ArrowRight className="w-24 h-24 rotate-135" />
                </div>
                <h3 className="text-2xl font-display font-bold text-red-400 mb-4 flex items-center gap-3">
                  <span className="p-2 bg-red-500/10 rounded-lg">
                    <Moon className="w-5 h-5" />
                  </span>
                  Reversed
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {card.reversed}
                </p>
              </div>
            </div>

            {/* Detailed Interpretations Grid */}
            <div className="grid md:grid-cols-2 gap-6">
               {/* Love */}
               <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/10 rounded-lg">
                      <Heart className="w-5 h-5 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Love & Relationships</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{card.meaningLove}</p>
               </div>
               
               {/* Career */}
               <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Career & Work</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{card.meaningCareer}</p>
               </div>

               {/* Finance */}
               <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Coins className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Money & Finance</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{card.meaningFinance}</p>
               </div>

               {/* Stats Row: Yes/No & Numerology */}
               <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                  {/* Yes / No */}
                  <div className="flex items-start gap-4">
                     <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Yes / No Verdict</h3>
                        <div className="text-xl font-bold text-white">{card.yesNo}</div>
                     </div>
                  </div>
                  
                  <div className="w-full h-px bg-white/10" />

                  {/* Numerology */}
                  <div className="flex items-start gap-4">
                     <div className="p-2 bg-purple-500/10 rounded-lg shrink-0">
                        <Hash className="w-5 h-5 text-purple-400" />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Numerology</h3>
                        <div className="text-base font-bold text-white">{card.numerology}</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Deep Dive Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 space-y-8">
              <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-purple-400" />
                Deep Dive & Archetype
              </h2>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-slate-300">
                  The {card.name} embodies the archetype of{" "}
                  <strong className="text-purple-300">{card.archetype}</strong>.
                  In Jungian psychology, this represents a fundamental part of
                  the human psyche that we all share.
                </p>
                <p className="text-slate-400">
                  When this card appears in a reading, it suggests that you are
                  currently enacting this mythic story in your own life. Whether
                  upright or reversed, the energy of the {card.archetype} is
                  present and asking for your attention.
                </p>

                <h3 className="text-xl font-bold text-white mt-8 mb-4">
                  Questions for Reflection
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-slate-300">
                  <li>
                    How does the energy of the {card.name} manifest in my
                    current situation?
                  </li>
                  <li>
                    Am I expressing the positive or negative aspects of the{" "}
                    {card.archetype}?
                  </li>
                  <li>
                    What lesson is this card trying to teach me right now?
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-center shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors duration-700"></div>

              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-display font-bold text-white">
                  Want a Personal Reading?
                </h3>
                <p className="text-purple-100 max-w-lg mx-auto">
                  See how the {card.name} and other cards apply to your specific
                  life questions. Get a free AI-powered Tarot reading now.
                </p>
                <Link
                  href="/tarot"
                  className="inline-flex items-center gap-2 bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-full font-bold transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Free Reading
                </Link>
              </div>
            </div>

            {/* Quick Switcher / Explore More */}
            <div className="border-t border-white/10 pt-12">
              <h3 className="text-xl font-display font-bold text-white mb-6">
                Explore Other Cards
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Show a few random cards or the next 4 cards */}
                {otherCards.map((c) => (
                  <Link
                    key={c.id}
                    href={`/tarot-meanings/${c.slug}`}
                    className="group bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all flex items-center gap-3"
                  >
                    <div className="relative w-10 h-14 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs text-slate-500 font-bold uppercase truncate">
                        No. {c.id}
                      </div>
                      <div className="text-sm text-slate-200 font-medium truncate group-hover:text-purple-300 transition-colors">
                        {c.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
