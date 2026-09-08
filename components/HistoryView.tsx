import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DreamResult, TarotDraw, DailyFortune, User, DailyFortuneDimension } from '../types';
import { getDreamHistory, getTarotHistory, getFortuneHistory } from '../services/storage';
import { ArrowRight, Moon, Sun, Sparkles, X, Heart, Briefcase, Activity, Zap, Users, Layers, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import clsx from 'clsx';
import { Pagination } from './Pagination';
import { TAROT_PERSONAS } from '../lib/tarot-personas';

import Image from 'next/image';

interface HistoryViewProps {
  user: User;
  onSelectDream: (dream: DreamResult) => void;
}

type HistoryItem = 
  | { type: 'dream', data: DreamResult, date: number }
  | { type: 'tarot', data: TarotDraw, date: number }
  | { type: 'fortune', data: DailyFortune, date: number };

export const HistoryView: React.FC<HistoryViewProps> = ({ user, onSelectDream }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'dream' | 'tarot' | 'fortune'>('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      // Also lock html for mobile safar
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [selectedItem]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [dreams, tarot, fortunes] = await Promise.all([
          getDreamHistory(user.id),
          getTarotHistory(user.id),
          getFortuneHistory(user.id)
        ]);

        const combined: HistoryItem[] = [
          ...dreams.map(d => ({ type: 'dream' as const, data: d, date: d.timestamp })),
          ...tarot.map(t => ({ type: 'tarot' as const, data: t, date: new Date(t.date).getTime() })),
          ...fortunes.map(f => ({ type: 'fortune' as const, data: f, date: new Date(f.date).getTime() }))
        ];

        combined.sort((a, b) => b.date - a.date);
        setItems(combined);
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user.id]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredItems = items.filter(item => filter === 'all' || item.type === filter);
  
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-mystic-gold/30 border-t-mystic-gold rounded-full animate-spin mb-4" />
        <p className="text-mystic-gold font-display tracking-widest animate-pulse">Summoning memories...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in flex flex-col items-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-2xl font-display text-slate-300 mb-2">The Grimoire is Empty</h3>
        <p className="text-slate-500 font-serif italic mb-8 max-w-md mx-auto">&quot;The pages are blank, waiting for your subconscious to write its first chapter.&quot;</p>
        
        <Link href="/" className="px-6 py-3 bg-mystic-gold hover:bg-amber-400 text-black font-bold rounded-full transition-colors flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Begin Your Journey
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-white/10 pb-4 gap-4">
        <h2 className="text-3xl font-display text-white">Your Grimoire</h2>

        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "All", icon: Layers },
            { id: "dream", label: "Dreams", icon: Moon },
            { id: "tarot", label: "Tarot", icon: Sun },
            { id: "fortune", label: "Horoscope", icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setFilter(tab.id as "all" | "dream" | "tarot" | "fortune")
              }
              className={clsx(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0",
                filter === tab.id
                  ? "bg-mystic-gold text-black shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon className="w-3 h-3" />
              <span className="inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            {filter === 'dream' && <Moon className="w-8 h-8 text-purple-400 opacity-50" />}
            {filter === 'tarot' && <Sun className="w-8 h-8 text-amber-400 opacity-50" />}
            {filter === 'fortune' && <Star className="w-8 h-8 text-indigo-400 opacity-50" />}
          </div>
          <h3 className="text-xl font-display text-slate-300 mb-2">No {filter === 'fortune' ? 'Horoscope' : filter.charAt(0).toUpperCase() + filter.slice(1)} Records Found</h3>
          <p className="text-slate-500 font-serif italic mb-6 max-w-sm">
            {filter === 'dream' && "Your nights have been silent, or perhaps you've yet to record them."}
            {filter === 'tarot' && "The cards are shuffled, waiting for your first draw."}
            {filter === 'fortune' && "The stars align daily, but you haven't consulted them yet."}
          </p>
          
          <Link 
            href={
              filter === 'dream' ? '/' : 
              filter === 'tarot' ? '/tarot' : 
              filter === 'fortune' ? '/horoscope' : '/'
            }
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-full transition-colors"
          >
            Start Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {paginatedItems.map((item, idx) => (
          <motion.div
            key={`${item.type}-${item.date}-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-mystic-900 border border-white/5 rounded-xl overflow-hidden hover:border-mystic-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
          >
            {item.type === "dream" && (
              <div
                onClick={() => onSelectDream(item.data)}
                className="cursor-pointer h-full flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.data.imageUrl}
                    alt={item.data.analysis.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white flex items-center gap-1 z-10">
                    <Moon className="w-3 h-3 text-purple-300" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between bg-gradient-to-b from-black/40 to-transparent">
                  <div>
                    <h3 className="text-lg font-display text-white group-hover:text-mystic-gold transition-colors line-clamp-1 mb-2">
                      {item.data.analysis.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                      {item.data.analysis.interpretation}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-purple-400 uppercase tracking-wider font-bold gap-1 mt-auto">
                    View Prophecy{" "}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            )}

            {item.type === "tarot" && (
              <div
                onClick={() => setSelectedItem(item)}
                className="p-6 h-full flex flex-col relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sun className="w-24 h-24" />
                </div>
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Sun className="w-3 h-3" /> Tarot
                    <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px]">
                      {item.data.spreadType === "THREE" ? "THREE" : "SINGLE"}
                    </span>
                  </div>
                  <div className="text-slate-500 text-xs">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Persona Indicator */}
                {item.data.personaId && (() => {
                    const persona = TAROT_PERSONAS.find(p => p.id === item.data.personaId);
                    if (!persona) return null;
                    return (
                        <div className="flex items-center gap-2 mb-4 relative z-10 bg-white/5 p-1 rounded-full w-fit pr-3 border border-white/5">
                            <div 
                                className="w-6 h-6 rounded-full overflow-hidden relative border flex items-center justify-center bg-black/20"
                                style={{ borderColor: persona.themeColor, boxShadow: `0 0 10px ${persona.themeColor}30` }}
                            >
                                <div className="absolute inset-0 bg-white/5 blur-sm" />
                                <Image src={persona.avatarUrl} alt={persona.name} fill className="object-contain p-0.5 relative z-10" sizes="24px" />
                            </div>
                            <span className="text-[10px] text-indigo-200 font-medium">Read by {persona.name}</span>
                        </div>
                    );
                })()}

                <div className="mb-4 relative z-10">
                  <h3 className="text-xl font-display font-bold text-white mb-1">
                    {item.data.cards[0].name}
                  </h3>
                  <div className="flex gap-2">
                    <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10">
                      {item.data.cards[0].upright ? "Upright" : "Reversed"}
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-grow relative z-10 line-clamp-4">
                  {item.data.interpretation}
                </p>
                <div className="flex items-center text-xs text-amber-400 uppercase tracking-wider font-bold gap-1 mt-auto relative z-10">
                  Read Full Reading{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {item.type === "fortune" && (
              <div
                onClick={() => setSelectedItem(item)}
                className="p-6 h-full flex flex-col relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Star className="w-24 h-24" />
                </div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Star className="w-3 h-3" /> Horoscope
                  </div>
                  <div className="text-slate-500 text-xs">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="mb-4 relative z-10">
                  <h3 className="text-xl font-display font-bold text-white mb-1">
                    Daily Horoscope
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10">
                      Lucky #: {item.data.luckyNumber}
                    </span>
                    {(() => {
                      const colorString = item.data.luckyColor || "";
                      const hexMatch = colorString.match(
                        /\((#[0-9A-Fa-f]{6})\)/
                      );
                      const colorHex = hexMatch
                        ? hexMatch[1]
                        : colorString.toLowerCase() || "#888";
                      const colorName = colorString.replace(
                        /\s*\(#[0-9A-Fa-f]{6}\)/,
                        ""
                      );

                      return (
                        <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colorHex }}
                          />
                          {colorName || item.data.luckyColor}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-grow relative z-10 line-clamp-4">
                  {item.data.oracleMessage}
                </p>
                <div className="flex items-center text-xs text-indigo-400 uppercase tracking-wider font-bold gap-1 mt-auto relative z-10">
                  Read Prophecy{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="justify-center mb-12"
        />
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 pt-16 bg-black/80 backdrop-blur-sm touch-none"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-mystic-900 border border-mystic-gold/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl scrollbar-hide overscroll-y-contain"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 right-0 p-4 flex justify-end z-50 pointer-events-none">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-white bg-black/50 backdrop-blur-md border border-white/10 p-2 rounded-full transition-all hover:scale-110 pointer-events-auto shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 pb-6 -mt-16">
                {" "}
                {/* Negative margin to pull content up under the sticky header area if needed, or just let it flow */}
                {selectedItem.type === "tarot" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      {(() => {
                          const persona = selectedItem.data.personaId ? TAROT_PERSONAS.find(p => p.id === selectedItem.data.personaId) : null;
                          if (persona) {
                              return (
                                  <div 
                                    className="w-14 h-14 flex items-center justify-center shrink-0 relative rounded-full border-2 bg-black/20"
                                    style={{ borderColor: persona.themeColor, boxShadow: `0 0 15px ${persona.themeColor}40` }}
                                  >
                                      <div className="absolute inset-0 rounded-full bg-white/5 blur-md" />
                                      <Image 
                                        src={persona.avatarUrl} 
                                        alt={persona.name} 
                                        fill 
                                        className="object-contain p-0.5 relative z-10" 
                                        sizes="56px" 
                                      />
                                  </div>
                              );
                          }
                          return (
                              <div className="p-3 bg-amber-500/20 rounded-xl">
                                <Sun className="w-6 h-6 text-amber-400" />
                              </div>
                          );
                      })()}
                      
                      <div>
                        <h3 className="text-2xl font-display font-bold text-white">
                          Tarot Reading
                        </h3>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                             <span>{new Date(selectedItem.date).toLocaleDateString()}</span>
                             {selectedItem.data.personaId && (() => {
                                 const p = TAROT_PERSONAS.find(x => x.id === selectedItem.data.personaId);
                                 return p ? (
                                     <>
                                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                                        <span className="text-indigo-300">Interpretation by {p.name}</span>
                                     </>
                                 ) : null;
                             })()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {selectedItem.data.cards.map((card, idx) => (
                        <div
                          key={idx}
                          className="bg-black/40 border border-white/10 p-4 rounded-xl text-center"
                        >
                          <div className="text-amber-400 font-bold font-display mb-1">
                            {card.name}
                          </div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider">
                            {card.upright ? "Upright" : "Reversed"}
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedItem.data.question && (
                      <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                          Question
                        </h4>
                        <p className="text-lg font-display text-white italic">
                          &quot;{selectedItem.data.question}&quot;
                        </p>
                      </div>
                    )}

                    <div className="rounded-xl">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Interpretation
                      </h4>
                      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base md:text-lg">
                        <Markdown
                          components={{
                            h1: ({ node: _node, ...props }) => (
                              <h3
                                className="text-amber-400 font-display font-bold text-xl md:text-2xl mt-6 mb-3"
                                {...props}
                              />
                            ),
                            h2: ({ node: _node, ...props }) => (
                              <h3
                                className="text-amber-400 font-display font-bold text-xl md:text-2xl mt-6 mb-3"
                                {...props}
                              />
                            ),
                            h3: ({ node: _node, ...props }) => (
                              <h3
                                className="text-amber-400 font-display font-bold text-xl md:text-2xl mt-6 mb-3"
                                {...props}
                              />
                            ),
                            strong: ({ node: _node, ...props }) => (
                              <strong
                                className="text-white font-bold"
                                {...props}
                              />
                            ),
                            p: ({ node: _node, ...props }) => (
                              <p
                                className="mb-4 leading-relaxed text-justify hyphens-auto"
                                {...props}
                              />
                            ),
                            li: ({ node: _node, ...props }) => (
                              <li
                                className="mb-1 marker:text-amber-400"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {selectedItem.data.interpretation}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                )}
                {selectedItem.type === "fortune" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <Star className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-white">
                          Daily Horoscope
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {new Date(selectedItem.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Lucky Number */}
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-lg shrink-0">
                          {selectedItem.data.luckyNumber}
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase">
                            Lucky Number
                          </div>
                        </div>
                      </div>

                      {/* Power Color */}
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                        {(() => {
                          const colorString =
                            selectedItem.data.luckyColor || "";
                          const hexMatch = colorString.match(
                            /\((#[0-9A-Fa-f]{6})\)/
                          );
                          const colorHex = hexMatch
                            ? hexMatch[1]
                            : colorString.toLowerCase() || "#888";
                          const colorName = colorString.replace(
                            /\s*\(#[0-9A-Fa-f]{6}\)/,
                            ""
                          );

                          return (
                            <>
                              <div
                                className="w-10 h-10 rounded-full border-2 border-white/20 shrink-0"
                                style={{ backgroundColor: colorHex }}
                              />
                              <div>
                                <div className="text-xs text-slate-500 uppercase">
                                  Power Color
                                </div>
                                <div className="text-sm font-bold text-white capitalize">
                                  {colorName || "Unknown"}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Peak Time */}
                      {selectedItem.data.dimensions.luckyTime && (
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center shadow-lg shrink-0">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 uppercase">
                              Peak Time
                            </div>
                            <div className="text-sm font-bold text-white font-display">
                              {selectedItem.data.dimensions.luckyTime}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Soul Match */}
                      {selectedItem.data.dimensions.compatibleZodiac && (
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shrink-0">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 uppercase">
                              Soul Match
                            </div>
                            <div className="text-sm font-bold text-white font-display">
                              {selectedItem.data.dimensions.compatibleZodiac}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/20">
                      <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-3">
                        Oracle Message
                      </h4>
                      <p className="text-white leading-relaxed font-serif text-xl italic">
                        &quot;{selectedItem.data.oracleMessage}&quot;
                      </p>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(selectedItem.data.dimensions)
                        .filter(
                          (entry): entry is [string, DailyFortuneDimension] => {
                            const [, v] = entry;
                            return (
                              typeof v === "object" &&
                              v !== null &&
                              "score" in v
                            );
                          }
                        )
                        .map(([key, dim]) => {
                          let Icon = Sparkles;
                          let color = "text-slate-400";
                          let barColor = "bg-slate-500";

                          if (key === "love") {
                            Icon = Heart;
                            color = "text-rose-400";
                            barColor = "bg-rose-500";
                          }
                          if (key === "career") {
                            Icon = Briefcase;
                            color = "text-amber-400";
                            barColor = "bg-amber-500";
                          }
                          if (key === "health") {
                            Icon = Activity;
                            color = "text-emerald-400";
                            barColor = "bg-emerald-500";
                          }
                          if (key === "creativity") {
                            Icon = Zap;
                            color = "text-purple-400";
                            barColor = "bg-purple-500";
                          }
                          if (key === "social") {
                            Icon = Users;
                            color = "text-blue-400";
                            barColor = "bg-blue-500";
                          }

                          return (
                            <div
                              key={key}
                              className="bg-black/20 p-4 rounded-xl border border-white/5"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={clsx(
                                      "p-1.5 rounded-lg bg-white/5",
                                      color
                                    )}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="capitalize text-slate-200 font-bold">
                                    {key}
                                  </span>
                                </div>
                                <span
                                  className={clsx("font-mono font-bold", color)}
                                >
                                  {dim.score}%
                                </span>
                              </div>

                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                                <div
                                  className={clsx(
                                    "h-full rounded-full",
                                    barColor
                                  )}
                                  style={{ width: `${dim.score}%` }}
                                />
                              </div>

                              <p className="text-sm text-slate-300 leading-relaxed mb-2">
                                {dim.summary}
                              </p>
                              <p className="text-xs text-slate-500 italic">
                                💡 {dim.advice}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
