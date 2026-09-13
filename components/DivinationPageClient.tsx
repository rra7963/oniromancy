"use client";

import React from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { DivinationView } from "./DivinationView";
import { useApp } from "../contexts/AppContext";
import { DivinationType, DIVINATION_BY_TYPE } from "../lib/divination";
import { User } from "../types";

/**
 * Shared shell for every ported divination route: a public, crawlable landing
 * state for signed-out visitors and the interactive reading for members.
 */
export const DivinationPageClient: React.FC<{ type: DivinationType }> = ({ type }) => {
  const config = DIVINATION_BY_TYPE[type];
  const { user, setUser } = useApp();
  const router = useRouter();

  if (!config) return null;

  if (!user) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
        <div className="mb-8 p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 animate-pulse">
          <span className="text-4xl">{config.emoji}</span>
        </div>

        <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">
          {config.origin}
        </p>

        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight drop-shadow-xl">
          <span
            className={clsx(
              "text-transparent bg-clip-text bg-gradient-to-r",
              config.accent
            )}
          >
            {config.title}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
          {config.description}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-16 w-full">
          {config.highlights.map((highlight) => (
            <div
              key={highlight}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-left"
            >
              <p className="text-slate-300">{highlight}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/auth")}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
        >
          Cast your reading
        </button>

        <p className="mt-4 text-sm text-slate-500">
          {config.cost} credits per reading · new accounts start with free credits
        </p>
      </div>
    );
  }

  const handleUserUpdate = (updated: User) => setUser(updated);

  return (
    <DivinationView config={config} user={user} onUserUpdate={handleUserUpdate} />
  );
};

export default DivinationPageClient;
