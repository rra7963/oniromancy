import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, BookOpen, Share2 } from "lucide-react";
import { getSymbolBySlug, getAllSymbolSlugs } from "../utils";
import { WithContext, Article, BreadcrumbList } from "schema-dts";
import { ShareButtons } from "@/components/ShareButtons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const symbol = getSymbolBySlug(slug);

  if (!symbol) {
    return {
      title: "Symbol Not Found",
    };
  }

  const cleanDescription = symbol.longDescription?.replace(/<[^>]*>?/gm, '') || symbol.meaning;
  
  return {
    title: `Dreaming about ${symbol.name}: Meaning & Interpretation | Oniromancy AI`,
    description: `What does it mean to dream about ${symbol.name}? ${cleanDescription.substring(0, 150)}... Explore Jungian archetypes and psychological meanings.`,
    keywords: [
      ...(symbol.keywords || []),
      `dream of ${symbol.name}`, 
      `${symbol.name} dream meaning`, 
      "dream interpretation", 
      "Jungian archetype", 
      "dream symbolism", 
      symbol.category
    ],
    alternates: {
      canonical: `https://www.oniromancy.com/symbolism-guide/${slug}`,
    },
    openGraph: {
      title: `Dream Meaning: ${symbol.name} | Oniromancy AI`,
      description: cleanDescription.substring(0, 200) + "...",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `Dream Meaning: ${symbol.name} | Oniromancy AI`,
      description: cleanDescription.substring(0, 200) + "...",
    },
  };
}

export async function generateStaticParams() {
  const symbols = getAllSymbolSlugs();
  return symbols.map((symbol) => ({
    slug: symbol.slug,
  }));
}

export default async function SymbolPage({ params }: PageProps) {
  const { slug } = await params;
  const symbol = getSymbolBySlug(slug);

  if (!symbol) {
    notFound();
  }

  // Structured Data for SEO
  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Dream Meaning: ${symbol.name}`,
    description: `Detailed interpretation of dreaming about ${symbol.name}. ${symbol.meaning}`,
    image: [
      `https://www.oniromancy.com/opengraph-image?title=${encodeURIComponent(symbol.name)}` 
    ],
    datePublished: "2024-01-01T00:00:00+00:00",
    dateModified: new Date().toISOString(),
    keywords: [
      symbol.name,
      `Dream about ${symbol.name}`,
      "Dream Interpretation",
      symbol.category,
      ...(symbol.keywords || [])
    ].join(", "),
    author: {
      "@type": "Organization",
      name: "Oniromancy AI",
    },
    publisher: {
      "@type": "Organization",
      name: "Oniromancy AI",
      logo: {
        "@type": "ImageObject",
        url: "https://www.oniromancy.com/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.oniromancy.com/symbolism-guide/${slug}`
    },
    mainEntity: {
      "@type": "Question",
      name: `What does it mean to dream about ${symbol.name}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: symbol.meaning,
      },
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
        name: "Symbolism Guide",
        item: "https://www.oniromancy.com/symbolism-guide",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: symbol.name,
        item: `https://www.oniromancy.com/symbolism-guide/${slug}`,
      },
    ],
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[#020205] -z-20" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30 mix-blend-screen" />

      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link 
          href="/symbolism-guide"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Guide
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-6 h-6 text-emerald-300" />
            </div>
            <span className="text-emerald-300 font-bold uppercase tracking-wider text-sm">
              {symbol.category}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            Dreaming of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              {symbol.name}
            </span>
          </h1>

          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            {symbol.meaning}
          </p>
        </header>

        {/* Content Body */}
        <div className="grid lg:grid-cols-[1fr,300px] gap-12 mb-24 relative">
          <div className="space-y-12">
            {/* Introduction / Long Description */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-mystic-gold" />
                In-Depth Analysis
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
                <p className="first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-emerald-400 first-letter:mr-3 first-letter:float-left">
                  {symbol.longDescription}
                </p>
              </div>
            </section>

            {/* Jungian Archetype - Visual Block */}
            {symbol.jungianArchetype && (
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-900/40 border border-white/10 p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Sparkles className="w-8 h-8 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">
                      Jungian Archetype
                    </h3>
                    <p className="text-3xl font-display font-bold text-white mb-3">
                      {symbol.jungianArchetype}
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      From a Jungian perspective, this symbol connects to the collective unconscious, representing universal patterns of human experience found in myths and stories across cultures.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Cultural Significance */}
            {symbol.culturalSignificance && (
              <section>
                <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-mystic-gold" />
                  Cultural Context
                </h2>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-slate-300 leading-relaxed italic">
                  &quot;{symbol.culturalSignificance}&quot;
                </div>
              </section>
            )}

            {/* Common Scenarios - Timeline Style */}
            {symbol.scenarios && (
              <section>
                <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-mystic-gold" />
                  Common Scenarios
                </h2>
                <div className="space-y-8 relative pl-8 border-l border-white/10">
                  {symbol.scenarios.map((item, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-[#0B0C15] border border-emerald-500/50 flex items-center justify-center group-hover:border-emerald-400 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                        {item.scenario}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {item.interpretation}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA for Personalized Analysis - Wide Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-900/20 to-emerald-950/40 border border-emerald-500/20 p-8 md:p-12 text-center">
              <div className="absolute inset-0 bg-noise opacity-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-3xl font-display font-bold text-white mb-4">
                  Unlock the Hidden Meaning
                </h3>
                <p className="text-slate-300 mb-8 text-lg">
                  Every dream is a unique tapestry woven from your personal memories and emotions. While general symbols offer clues, our AI Oracle can interpret the specific narrative of <em>your</em> dream.
                </p>
                <Link 
                  href="/?dream=true"
                  className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-300 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze My Dream Now
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar - Sticky */}
          <aside className="lg:block">
            <div className="sticky top-32 space-y-8">
              {/* Quick Facts */}
              <div className="border-l-2 border-emerald-500/30 pl-6 py-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
                  At a Glance
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Category</div>
                    <div className="text-white font-medium flex items-center gap-2 text-lg">
                      {symbol.category}
                    </div>
                  </div>
                  {symbol.jungianArchetype && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Archetype</div>
                      <div className="text-white font-medium text-lg leading-tight">
                        {symbol.jungianArchetype}
                      </div>
                    </div>
                  )}
                  {symbol.emotionalResonance && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Emotional Theme</div>
                      <div className="text-emerald-300 font-medium text-lg leading-tight">
                        {symbol.emotionalResonance}
                      </div>
                    </div>
                  )}
                  {symbol.keywords && symbol.keywords.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Related Keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {symbol.keywords.map(k => (
                          <span key={k} className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Helper */}
              <div>
                <p className="text-slate-400 text-sm mb-4">
                  Exploring symbols helps you build a vocabulary for your subconscious.
                </p>
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Share Meaning</h4>
                  <ShareButtons 
                    title={`Dream Meaning: ${symbol.name}`} 
                    url={`https://www.oniromancy.com/symbolism-guide/${slug}`}
                    className="lg:flex-row" 
                  />
                </div>
                <Link 
                  href="/symbolism-guide"
                  className="text-emerald-300 hover:text-emerald-200 transition-colors text-sm font-bold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dictionary
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Symbols - Bottom Section */}
        <section className="border-t border-white/10 pt-16">
          <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
            Explore Related Symbols
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getAllSymbolSlugs()
              .filter(s => s.category === symbol.category && s.slug !== slug)
              .slice(0, 3)
              .map(s => (
                <Link 
                  key={s.slug}
                  href={`/symbolism-guide/${s.slug}`}
                  className="group block bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                      <BookOpen className="w-5 h-5 text-emerald-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {s.name}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {s.meaning}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
