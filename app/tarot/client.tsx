"use client";

import React from "react";
import { TarotView } from "../../components/TarotView";
import { useApp } from "../../contexts/AppContext";
import { useRouter } from "next/navigation";
import { User } from "../../types";

export default function TarotPageClient() {
  const { user, setUser, isLoading } = useApp();
  const router = useRouter();

  // Show landing state for non-authenticated users
  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
        <div className="mb-8 p-4 bg-purple-500/10 rounded-full border border-purple-500/20 animate-pulse">
            <span className="text-4xl">🎴</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight drop-shadow-xl">
          Unlock Your Destiny with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">AI Tarot</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
          Experience the ancient wisdom of Tarot combined with modern AI psychology. 
          Get deep, personalized insights into your love life, career, and spiritual path.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16 w-full max-w-5xl">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-3">Daily Guidance</h3>
                <p className="text-slate-400">Start your day with a single card draw to set your intention and focus.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-3">Love & Relationships</h3>
                <p className="text-slate-400">Gain clarity on your heart&apos;s questions with specialized relationship spreads.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-3">Deep Analysis</h3>
                <p className="text-slate-400">Our AI interprets complex card combinations using Jungian archetypes.</p>
            </div>
        </div>

        <button 
          onClick={() => router.push("/auth")}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
        >
          Start Your Free Reading
        </button>
      </div>
    );
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    // Optionally refresh data if needed, but Context update should be enough
  };

  return (
    <TarotView 
        user={user} 
        onUserUpdate={handleUserUpdate} 
    />
  );
}
