"use client";

import React from "react";
import { HoroscopeView } from "../../components/HoroscopeView";
import { useApp } from "../../contexts/AppContext";
import { useRouter } from "next/navigation";
import { User } from "../../types";

export default function HoroscopePageClient() {
  const { user, setUser, isLoading } = useApp();
  const router = useRouter();

  // Show landing state for non-authenticated users
  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
        <div className="mb-8 p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 animate-pulse">
            <span className="text-4xl">✨</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight drop-shadow-xl">
          Daily AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Horoscope</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
          Get personalized celestial guidance based on your zodiac sign. 
          Our AI combines astrological data with daily fortune dimensions for Love, Career, and Health.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16 w-full max-w-5xl">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-3">Zodiac Insights</h3>
                <p className="text-slate-400">Deep dive into your sign&apos;s daily potential and challenges.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-3">Lucky Elements</h3>
                <p className="text-slate-400">Discover your daily lucky numbers, colors, and compatible signs.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-3">5 Dimensions</h3>
                <p className="text-slate-400">Detailed scores for Love, Career, Health, Creativity, and Social life.</p>
            </div>
        </div>

        <button 
          onClick={() => router.push("/auth")}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-105"
        >
          Read Your Horoscope
        </button>
      </div>
    );
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <HoroscopeView 
        user={user} 
        onUserUpdate={handleUserUpdate} 
    />
  );
}
