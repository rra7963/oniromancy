"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Moon, Sun, Sparkles, History, ArrowRight, Star, Hexagon, Compass, ScrollText, Brain, Heart, Globe, Wind, Calendar, Clock, User as UserIcon } from "lucide-react";
import { DreamInput } from "./DreamInput";
import { DreamRitual } from "./DreamRitual";
import { DreamCard } from "./DreamCard";
import { LoadingState } from "./LoadingState";
import { DreamResult, LoadingStage, User } from "../types";
import { blogPosts } from "../app/blog/data";
import { symbols } from "../app/symbolism-guide/data";
import { slugify } from "@/lib/utils";
import { trackEvent } from "../services/analytics";
import {
  RitualAnswer,
  clearRite,
  deriveSeat,
  loadRite,
  saveRite,
} from "../lib/dream-ritual";

interface LandingViewProps {
  user: User | null;
  isGenerating: boolean;
  loadingStage: LoadingStage;
  currentResult: DreamResult | null;
  onDreamSubmit: (text: string, ritualAnswers: RitualAnswer[]) => void;
  onResetResult: () => void;
}



export const LandingView: React.FC<LandingViewProps> = ({
  user,
  isGenerating,
  loadingStage,
  currentResult,
  onDreamSubmit,
  onResetResult,
}) => {
  // "checking" avoids a flash of the wrong card while we look for tonight's rite.
  const [riteStatus, setRiteStatus] = useState<"checking" | "playing" | "done">(
    "checking"
  );
  const [ritualAnswers, setRitualAnswers] = useState<RitualAnswer[]>([]);

  useEffect(() => {
    // Deferred off the effect body so the first paint matches the server HTML
    // (localStorage does not exist there) instead of cascading a re-render.
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const stored = loadRite();
      if (stored) {
        setRitualAnswers(stored.answers);
        setRiteStatus("done");
        return;
      }
      setRiteStatus("playing");
      trackEvent("ritual_start", { source: "first_visit" });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isRiteOpen = riteStatus === "playing";

  const handleRiteComplete = (answers: RitualAnswer[]) => {
    saveRite(answers);
    setRitualAnswers(answers);
    setRiteStatus("done");
    trackEvent("ritual_complete", {
      seat: deriveSeat(answers).id,
      answers: answers.length,
    });
  };

  // Walking out early still keeps whatever was answered - those answers are
  // just as usable as a finished rite's.
  const handleRiteSkip = (answered: RitualAnswer[]) => {
    saveRite(answered, true);
    setRitualAnswers(answered);
    setRiteStatus("done");
    trackEvent("ritual_skip", { answered: answered.length });
  };

  const handleRiteReplay = () => {
    clearRite();
    setRitualAnswers([]);
    setRiteStatus("playing");
    trackEvent("ritual_start", { source: "replay" });
  };

  if (loadingStage === LoadingStage.COMPLETE && currentResult) {
    return <DreamCard result={currentResult} onReset={onResetResult} />;
  }

  if (isGenerating) {
    return <LoadingState stage={loadingStage} />;
  }

  return (
    <div className="w-full flex flex-col items-center gap-32 pb-20">
      {/* Hero Section */}
      <section
        className={`w-full flex flex-col items-center text-center max-w-5xl px-4 ${
          isRiteOpen ? "mt-6" : "mt-12"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={isRiteOpen ? "mb-8" : "mb-16"}
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-mystic-gold animate-fade-in">
            The Oracle
          </div>
          <h1
            className={`font-display font-bold text-white tracking-tight drop-shadow-2xl leading-tight ${
              isRiteOpen
                ? "text-3xl md:text-6xl mb-4"
                : "text-4xl md:text-8xl mb-8"
            }`}
          >
            Unlock the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-mystic-gold to-purple-200 animate-gradient-x">
              Unseen World
            </span>
          </h1>
          <p
            className={`text-slate-300 max-w-3xl mx-auto leading-relaxed font-serif opacity-90 ${
              isRiteOpen ? "text-base md:text-lg" : "text-lg md:text-2xl"
            }`}
          >
            Where ancient wisdom meets artificial intelligence.{" "}
            <br className="hidden md:block" />
            Interpret dreams, consult the stars, and unveil your destiny.
          </p>

          {/* The hero CTAs step aside while the Oracle is speaking. */}
          {!user && !isRiteOpen && (
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/auth"
                onClick={() => trackEvent('generate_lead', { source: 'hero_cta_begin' })}
                className="px-10 py-4 bg-mystic-gold text-black font-bold text-lg rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all flex items-center gap-2 group"
              >
                Begin Your Journey{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                onClick={() => trackEvent('view_pricing', { source: 'hero_cta_prophecies' })}
                className="app-marketing-only px-10 py-4 bg-white/5 text-white font-bold text-lg rounded-full border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
              >
                View Prophecies
              </Link>
            </div>
          )}
        </motion.div>

        <div className="w-full max-w-2xl relative z-10">
          <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full -z-10"></div>
          {riteStatus === "checking" && (
            <div className="h-[420px] md:h-[520px]" aria-hidden="true" />
          )}
          {riteStatus === "playing" && (
            <DreamRitual
              onComplete={handleRiteComplete}
              onSkip={handleRiteSkip}
              onAnswer={(answer) =>
                trackEvent("ritual_answer", {
                  step: answer.stepId,
                  choice: answer.choiceId,
                })
              }
            />
          )}
          {riteStatus === "done" && (
            <DreamInput
              onSubmit={(text) => onDreamSubmit(text, ritualAnswers)}
              isProcessing={isGenerating}
              user={user}
              ritualAnswers={ritualAnswers}
              onReplayRitual={handleRiteReplay}
            />
          )}
        </div>
      </section>

      {/* The Three Pillars (Existing Features) */}
      <section className="app-marketing-only w-full max-w-7xl px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
            Sanctuary of the Mind
          </h2>
          <p className="text-slate-400 font-serif text-xl italic max-w-2xl mx-auto">
            &quot;We do not predict the future; we illuminate the path.&quot;
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Moon,
              title: "Dream Interpretation",
              desc: "Decode the symbolism of your subconscious. Our AI blends Jungian psychology with mystic archetypes to interpret your nightly visions.",
              color: "text-purple-300",
              bg: "bg-gradient-to-b from-purple-900/40 to-transparent",
              border: "border-purple-500/30",
              delay: 0,
              link: "/",
            },
            {
              icon: Sun,
              title: "Tarot Reading",
              desc: "Draw from the digital deck. Whether a single card for daily guidance or a three-card spread for clarity, the cards reveal what is hidden.",
              color: "text-amber-300",
              bg: "bg-gradient-to-b from-amber-900/40 to-transparent",
              border: "border-amber-500/30",
              delay: 0.1,
              link: "/tarot",
            },
            {
              icon: Star,
              title: "Daily Horoscope",
              desc: "Daily horoscopes tailored to your zodiac. Understand the celestial energies influencing your luck, love, and career.",
              color: "text-indigo-300",
              bg: "bg-gradient-to-b from-indigo-900/40 to-transparent",
              border: "border-indigo-500/30",
              delay: 0.2,
              link: "/horoscope",
            },
          ].map((feature, idx) => (
            <Link href={feature.link} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                className={`p-10 rounded-3xl backdrop-blur-md border ${feature.border} ${feature.bg} group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl h-full`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-display tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-base">
                  {feature.desc}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Future Blueprint Section */}
      <section className="app-marketing-only w-full max-w-7xl px-4 py-12">
        <div className="relative rounded-3xl md:rounded-[3rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-16">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-mystic-gold/5 blur-[120px] rounded-full"></div>

          <div className="relative z-10 text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
              The Expanding Universe
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Our grimoire grows with every moon cycle. Prepare for the next
              generation of spiritual tools designed to guide you through the
              cosmos.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Hexagon, label: "I Ching", status: "Coming Soon" },
              { icon: Compass, label: "Numerology", status: "In Development" },
              { icon: Star, label: "Natal Charts", status: "Planned" },
              { icon: ScrollText, label: "Palmistry AI", status: "Future" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center p-3 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-default"
              >
                <item.icon className="w-8 h-8 md:w-10 md:h-10 text-slate-500 group-hover:text-mystic-gold transition-colors mb-2 md:mb-4" />
                <span className="text-white font-bold font-display text-sm md:text-lg mb-2 text-center">
                  {item.label}
                </span>
                <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded-full text-center whitespace-nowrap scale-90 md:scale-100 origin-center">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grimoire Teaser */}
      <section className="app-marketing-only w-full max-w-6xl px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-mystic-gold/20 blur-[60px] rounded-full"></div>
              <div className="relative bg-mystic-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl">
                <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <History className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-white font-bold font-display text-lg">
                      The Grimoire
                    </div>
                    <div className="text-xs text-slate-400">
                      Your Spiritual Archive
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-lg bg-black/20"
                    >
                      <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                      <div className="h-2 bg-white/10 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-display text-white mb-6">
              Your Journey, Recorded
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Unlike fleeting thoughts, your digital Grimoire keeps a permanent
              record of every insight. Track patterns in your dreams, review
              past tarot spreads, and see how the stars have aligned over time.
            </p>
            <Link
              href={user ? "/history" : "/auth"}
              className="text-mystic-gold font-bold uppercase tracking-widest text-sm hover:text-white transition-colors flex items-center gap-2 group"
            >
              Open Your Grimoire{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Wisdom & Wellness Section */}
      <section className="app-marketing-only w-full max-w-7xl px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
            Ancient Wisdom, Modern Mind
          </h2>
          <p className="text-slate-400 font-serif text-xl italic max-w-3xl mx-auto">
            &quot;Tools for self-reflection, cultural exploration, and psychological
            balance.&quot;
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              title: "Psychological Insight",
              desc: "Drawing from Jungian psychology, we treat symbols as keys to your subconscious, helping you understand hidden emotions and desires.",
              color: "text-rose-300",
            },
            {
              icon: Globe,
              title: "Cultural Heritage",
              desc: "Our interpretations respect global traditions, blending Eastern and Western philosophies to provide a rich, diverse perspective.",
              color: "text-emerald-300",
            },
            {
              icon: Heart,
              title: "Emotional Healing",
              desc: "A safe space for introspection. Use these tools to process anxiety, find comfort, and restore your inner balance.",
              color: "text-amber-300",
            },
            {
              icon: Wind,
              title: "Energy Harmony",
              desc: "Understand the subtle flows of energy in your life and environment to create a sense of peace and purpose.",
              color: "text-blue-300",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
              <h3 className="text-xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="app-marketing-only w-full max-w-7xl px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-display text-white mb-4">
              From the Grimoire
            </h2>
            <p className="text-slate-400 font-serif text-lg italic max-w-xl">
              Latest insights into the mystical arts and modern psychology.
            </p>
          </div>
          <Link 
            href="/blog" 
            className="text-mystic-gold font-bold uppercase tracking-widest text-sm hover:text-white transition-colors flex items-center gap-2 group shrink-0"
          >
            View All Posts <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post, idx) => (
            <Link href={`/blog/${post.slug}`} key={idx}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors"
              >
                <div className="h-48 relative overflow-hidden bg-black">
                   <Image 
                     src={post.image} 
                     alt={post.title}
                     fill
                     unoptimized
                     className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-mystic-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <UserIcon className="w-3 h-3" />
                      {post.author}
                    </div>
                    <span className="text-mystic-gold text-xs font-bold uppercase tracking-widest group-hover:underline">
                      Read
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Symbols */}
      <section className="app-marketing-only w-full max-w-7xl px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-display text-white mb-4">
              Common Dream Symbols
            </h2>
            <p className="text-slate-400 font-serif text-lg italic max-w-xl">
              Explore the archetypal meanings of the most frequently dreamt symbols.
            </p>
          </div>
          <Link 
            href="/symbolism-guide" 
            className="text-mystic-gold font-bold uppercase tracking-widest text-sm hover:text-white transition-colors flex items-center gap-2 group shrink-0"
          >
            View Dictionary <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {symbols.slice(0, 6).map((symbol, idx) => (
            <Link href={`/symbolism-guide/${slugify(symbol.name)}`} key={idx}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="relative group h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-mystic-gold/5 to-purple-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-mystic-gold/30 hover:bg-white/10 transition-all duration-300 flex flex-col overflow-hidden group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-purple-900/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-mystic-gold transition-colors font-display tracking-wide">
                        {symbol.name}
                      </h3>
                      <div className="p-2 rounded-lg bg-black/20 group-hover:bg-mystic-gold/20 transition-colors ring-1 ring-white/5 group-hover:ring-mystic-gold/30">
                        <ScrollText className="w-5 h-5 text-slate-400 group-hover:text-mystic-gold transition-colors" />
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow font-serif italic pl-3 border-l-2 border-white/10 group-hover:border-mystic-gold/40 transition-colors">
                      &quot;{symbol.meaning}&quot;
                    </p>
                    
                    <div className="space-y-4 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {symbol.keywords?.slice(0, 3).map((keyword, kIdx) => (
                          <span key={kIdx} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-slate-400 border border-white/5 group-hover:border-white/10 transition-colors">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-end border-t border-white/5 pt-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-mystic-gold transition-colors flex items-center gap-1">
                          Read Meaning <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="app-marketing-only w-full max-w-4xl px-4 py-12">
        <h2 className="text-3xl font-display text-white mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Is this fortune telling?",
              a: "Not in the superstitious sense. We view these arts as tools for self-reflection and narrative building. The 'magic' lies in the perspective it gives you on your own life.",
            },
            {
              q: "Do I need to believe in astrology?",
              a: "No. Many users find value in the archetypes and personality frameworks even without a spiritual belief. Think of it as a weather forecast for your mood.",
            },
            {
              q: "Is my data private?",
              a: "Absolutely. Your dreams and queries are personal. We do not share your personal entries with third parties.",
            },
            {
              q: "Is it suitable for beginners?",
              a: "Yes! We designed Oniromancy to be intuitive and welcoming. No prior knowledge of tarot or astrology is needed.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/faq" 
            className="text-mystic-gold hover:text-white transition-colors text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2 group"
          >
            View Full FAQ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="app-marketing-only w-full text-center py-12 md:py-16 relative">
        <div className="relative z-10">
          <h2 className="text-5xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-linear-to-b from-white/20 to-white/5 mb-6 tracking-widest select-none">
            ONIROMANCY
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-serif italic mb-8 max-w-4xl mx-auto px-4 leading-relaxed">
            &quot;The dream is the small hidden door in the deepest and most intimate sanctum of the soul.&quot;
          </p>
          {!user && (
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-3 bg-mystic-gold text-black font-bold text-lg rounded-full hover:bg-white transition-colors shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              <Sparkles className="w-5 h-5" />
              Begin Your Divination
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};
