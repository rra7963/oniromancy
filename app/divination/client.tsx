"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { DIVINATIONS } from "../../lib/divination";
import { CREDIT_COSTS } from "../../types";

const EXISTING = [
  {
    slug: "",
    emoji: "🌙",
    title: "Dream Interpretation",
    origin: "Oneiromancy · 周公解梦",
    description:
      "Describe a dream and receive a Jungian reading with its symbols, mood and a painted vision of it.",
    cost: CREDIT_COSTS.DREAM_ANALYSIS,
    accent: "from-emerald-400 to-cyan-400",
  },
  {
    slug: "tarot",
    emoji: "🃏",
    title: "Tarot Reading",
    origin: "Tarot · 塔罗牌占卜",
    description:
      "Draw one card or a past / present / future spread and have it read against your question.",
    cost: CREDIT_COSTS.TAROT_READING,
    accent: "from-amber-400 to-yellow-300",
  },
  {
    slug: "horoscope",
    emoji: "⭐",
    title: "Daily Horoscope",
    origin: "Astrology",
    description:
      "Your day scored across love, career, health, creativity and social life, with lucky colour, number and hour.",
    cost: CREDIT_COSTS.HOROSCOPE,
    accent: "from-indigo-400 to-cyan-300",
  },
];

export default function DivinationHubClient() {
  const cards = [
    ...EXISTING,
    ...DIVINATIONS.map((d) => ({
      slug: d.slug,
      emoji: d.emoji,
      title: d.title,
      origin: d.origin,
      description: d.tagline,
      cost: d.cost,
      accent: d.accent,
    })),
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">
          Every oracle in the house
        </p>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
          AI{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">
            Divination
          </span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Eight traditions under one roof — dreams, tarot and astrology alongside
          the Chinese classics: Four Pillars, name numerology, auspicious naming,
          the I Ching and a compatibility oracle.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.slug || "dreams"}
            href={`/${card.slug}`}
            className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all flex flex-col"
          >
            <span className="text-3xl mb-4">{card.emoji}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
              {card.origin}
            </span>
            <h2
              className={clsx(
                "text-xl font-display font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r",
                card.accent
              )}
            >
              {card.title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed flex-1">
              {card.description}
            </p>
            <span className="mt-5 text-xs text-slate-500 group-hover:text-mystic-gold transition-colors">
              {card.cost} credits · open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
