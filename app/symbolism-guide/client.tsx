"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, BookOpen, Tag, ArrowRight } from "lucide-react";
import { symbols } from "./data";
import { slugify } from "@/lib/utils";

export default function SymbolismGuideClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(symbols.map(s => s.category)));

  const filteredSymbols = symbols.filter(symbol => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = symbol.name.toLowerCase().includes(searchLower) || 
                          symbol.meaning.toLowerCase().includes(searchLower) ||
                          symbol.keywords?.some(k => k.toLowerCase().includes(searchLower));
    const matchesCategory = selectedCategory ? symbol.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <section className="text-center space-y-6 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-mystic-gold">
            Symbolism Guide
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Dictionary of <br />
            <span className="text-emerald-300">Dreams</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-serif italic">
            Decode the language of your subconscious. Search for symbols to understand their archetypal meanings.
          </p>
        </motion.div>
      </section>

      {/* Search & Filter */}
      <section className="max-w-2xl mx-auto w-full space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search for a symbol (e.g., 'Snake', 'Water')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-mystic-gold/50 transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              selectedCategory === null
                ? "bg-mystic-gold text-black border-mystic-gold"
                : "bg-transparent text-slate-400 border-white/10 hover:border-white/30"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                selectedCategory === cat
                  ? "bg-mystic-gold text-black border-mystic-gold"
                  : "bg-transparent text-slate-400 border-white/10 hover:border-white/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSymbols.length > 0 ? (
          filteredSymbols.map((symbol, idx) => (
            <Link 
              key={symbol.name} 
              href={`/symbolism-guide/${slugify(symbol.name)}`}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (idx % 10) * 0.05 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                      <BookOpen className="w-5 h-5 text-emerald-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display group-hover:text-emerald-300 transition-colors">
                      {symbol.name}
                    </h3>
                  </div>
                  <div className="px-2 py-1 rounded bg-white/5 text-[10px] uppercase tracking-wider text-slate-400 border border-white/5 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {symbol.category}
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm line-clamp-3 mb-4 flex-grow">
                  {symbol.meaning}
                </p>
                <div className="flex items-center text-emerald-300 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                  Read Interpretation <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-slate-500">
            No symbols found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
