import React, { useEffect, useRef, useState } from "react";
import { TarotDraw, User, CREDIT_COSTS } from "../types";
import {
  getTarotDrawToday,
  hasCredits,
} from "../services/storage";
import { performTarotDrawAction } from "../app/actions/tarot";
import { todayKey } from "../utils";
import { getTarotCardImage } from "../lib/tarot-assets";
import { trackEvent } from "../services/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon, Coins, Layers, LayoutGrid, Share2, Check, HelpCircle, RotateCcw, User as UserIcon } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import Markdown from "react-markdown";
import { TarotChalice, TarotSword, TarotPentacle, TarotWand, TarotSun, TarotMoon } from "./TarotIcons";
import { InteractiveTarotDeck } from "./InteractiveTarotDeck";

import { MetricTooltip } from "./MetricTooltip";
import { TAROT_PERSONAS, DEFAULT_PERSONA, TarotPersona } from "../lib/tarot-personas";

import { ShareButtons } from "@/components/ShareButtons";
import { nativeHaptics } from "@/lib/native/haptics";
import { isNativeIOS } from "@/lib/native/platform";
import { shareContent } from "@/lib/native/share";

interface TarotViewProps {
  user: User | null;
  onUserUpdate?: (user: User) => void;
}

type SpreadType = 'SINGLE' | 'THREE';

export const TarotView: React.FC<TarotViewProps> = ({ user, onUserUpdate }) => {
  const [draw, setDraw] = useState<TarotDraw | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>('SINGLE');
  const [selectedPersona, setSelectedPersona] = useState<TarotPersona>(DEFAULT_PERSONA);
  const [copied, setCopied] = useState(false);
  const [question, setQuestion] = useState("");
  const newReadingAnchorRef = useRef<HTMLDivElement | null>(null);
  const [showFloatingNewReading, setShowFloatingNewReading] = useState(false);

  // Initial load check
  useEffect(() => {
    const loadToday = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const existing = await getTarotDrawToday(user.id, todayKey());
        if (existing) {
          setDraw(existing);
          if (existing.question) setQuestion(existing.question);
          // Auto-select spread based on loaded data
          if (existing.spreadType === 'THREE') {
            setSelectedSpread('THREE');
          } else {
            setSelectedSpread('SINGLE');
          }
          if (existing.personaId) {
            const p = TAROT_PERSONAS.find(px => px.id === existing.personaId);
            if (p) setSelectedPersona(p);
          }
          setIsFlipped(true);
        }
      } catch (e) {
        console.error("Failed to load tarot", e);
      } finally {
        setLoading(false);
      }
    };
    loadToday();
  }, [user?.id]);

  const getCost = (spread: SpreadType) => {
    return spread === 'THREE' ? CREDIT_COSTS.TAROT_SPREAD_3 : CREDIT_COSTS.TAROT_READING;
  };

  const handleDraw = async () => {
    if (!user || drawing) return;

    if (!question.trim()) {
      setErr("Please focus your intent and ask a question first.");
      return;
    }

    const COST = getCost(selectedSpread);
    if (!hasCredits(user, COST)) {
      trackEvent('begin_checkout', { from: 'tarot', reason: 'insufficient_credits', cost: COST });
      setErr(`The spirits require an offering of ${COST} credits.`);
      return;
    }

    trackEvent('draw_tarot', { spread: selectedSpread, cost: COST, persona: selectedPersona.id });
    void nativeHaptics.action();
    setDrawing(true);
    setErr(null);

    try {
      // Simulate shuffling
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call secure server action
      const d = await performTarotDrawAction(selectedSpread, question, selectedPersona.id);

      // Optimistic update
      if (onUserUpdate) onUserUpdate({ ...user, credits: Math.max(0, user.credits - COST) });

      // 1. Set data first (Cards are still face down, but now have content)
      setDraw(d);
      
      // 2. Wait a brief moment for React to render the new card components with data
      await new Promise(r => setTimeout(r, 100));
      
      // 3. Stop loading animation (remove spinner overlay)
      setDrawing(false);

      // 4. Wait another brief moment before flipping to reveal
      await new Promise(r => setTimeout(r, 300));
      setIsFlipped(true);
      void nativeHaptics.reveal();
      
    } catch (e: unknown) {
      console.error("Tarot draw failed:", e);
      let message = "The cards are silent right now. Please try again.";
      if (e instanceof Error) {
        message = e.message;
      }
      setErr(message);
      setDrawing(false);
    }
  };

  const handleRedraw = () => {
    window.scrollTo(0, 0);
    setDraw(null);
    setIsFlipped(false);
    setErr(null);
  };

  const handleShare = async () => {
    if (!draw) return;
    const cards = draw.cards.map(c => `${c.name} (${c.upright ? 'Upright' : 'Reversed'})`).join(', ');
    const text = `🔮 My Tarot Reading on Oniromancy AI\n\nReader: ${selectedPersona.name}\nCards: ${cards}\n\nRead my full interpretation...`;

    if (isNativeIOS()) {
      await shareContent({
        title: "Oniromancy AI Tarot",
        text: "Explore tarot readings with Oniromancy AI.",
        url: "https://www.oniromancy.com/tarot",
        dialogTitle: "Share Oniromancy AI",
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (!draw) {
      setShowFloatingNewReading(false);
      return;
    }

    const el = newReadingAnchorRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingNewReading(!entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [draw]);

  if (!user) {
    return (
      <div className="text-center py-20 text-slate-300 font-display text-xl">
        Please sign in to consult the cards
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
         <div className="w-12 h-12 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin mb-4" />
         <p className="text-indigo-300 font-display tracking-widest animate-pulse">Shuffling the Deck...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT SIDEBAR: Persona Selector */}
        {!draw && (
        <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="mb-6 text-center">
                    <h3 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 mb-2 flex items-center justify-center gap-2">
                        <UserIcon className="w-4 h-4 text-indigo-300" />
                        Select Your Guide
                    </h3>
                    <p className="text-xs text-indigo-200/60 leading-relaxed font-light px-2">
                        Each reader offers a unique perspective. Choose one that resonates with your query.
                    </p>
                </div>

                {/* Horizontal Avatar List */}
                <div className="flex flex-wrap justify-center gap-4">
                    {TAROT_PERSONAS.map((persona) => {
                        const isSelected = selectedPersona.id === persona.id;
                        return (
                            <button
                                key={persona.id}
                                onClick={() => !draw && !drawing && setSelectedPersona(persona)}
                                disabled={!!draw || drawing}
                                className={clsx(
                                    "relative group transition-all duration-300 rounded-full",
                                    (!!draw || drawing) && "cursor-not-allowed opacity-50 grayscale"
                                )}
                                title={persona.name}
                            >
                                {/* Avatar Bubble */}
                                <div className={clsx(
                                    "relative z-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                                    isSelected 
                                        ? `w-20 h-20 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-110 border-2` 
                                        : "w-16 h-16 opacity-60 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0",
                                )}
                                style={isSelected ? { borderColor: persona.themeColor, boxShadow: `0 0 20px ${persona.themeColor}40` } : {}}
                                >
                                    <div className={clsx(
                                        "w-full h-full relative transition-all duration-300",
                                        !isSelected && "opacity-80 group-hover:opacity-100"
                                    )}>
                                        <Image 
                                            src={persona.avatarUrl} 
                                            alt={persona.name} 
                                            fill
                                            className="object-contain p-1 drop-shadow-lg"
                                        />
                                    </div>
                                    
                                    {/* Active Dot Indicator */}
                                    {isSelected && (
                                        <motion.div 
                                            layoutId="active-indicator-dot" 
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" 
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Persona Detail Card (Mobile/Desktop) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedPersona.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative text-center group perspective-1000 mt-2"
                >
                    {/* Background Glow */}
                    <div className={clsx(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[80px] opacity-20 pointer-events-none transition-all duration-700 group-hover:opacity-40",
                        `bg-gradient-to-br ${selectedPersona.gradientFrom} ${selectedPersona.gradientTo}`
                    )} />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className={clsx(
                            "w-64 h-64 mb-2 p-1 transition-all duration-700 ease-out transform group-hover:scale-105 preserve-3d"
                        )}>
                            <div className="w-full h-full relative">
                                <video
                                    src={selectedPersona.avatarUrl.replace('.webp', '.webm')}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2 mb-5">
                            <h3 className="text-3xl font-display font-bold text-white tracking-wide drop-shadow-xl flex items-center gap-2">
                                {selectedPersona.name}
                                <MetricTooltip 
                                    title={`About ${selectedPersona.name}`}
                                    description={selectedPersona.description}
                                >
                                    <HelpCircle className="w-5 h-5 text-indigo-300/50 hover:text-indigo-300 cursor-pointer transition-colors" />
                                </MetricTooltip>
                            </h3>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-indigo-200/80 uppercase tracking-widest backdrop-blur-md shadow-sm">
                                {selectedPersona.role}
                            </span>
                        </div>
                        <p className="text-sm text-indigo-100/70 leading-relaxed italic max-w-[280px] mx-auto">
                            {selectedPersona.quote}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
        )}

        {/* RIGHT MAIN CONTENT */}
        <div className="flex-1 w-full min-w-0">
            <div className="text-center mb-10">
                <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4"
                >
                <Sun className="w-4 h-4" />
                <span>Tarot Reading</span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 mb-2">
                {draw ? (draw.spreadType === 'THREE' ? "Your 3-Card Reading" : "Your Daily Draw") : "Consult Tarot"}
                </h2>
                
                {/* Error Message Area (Moved Up) */}
                {err && (
                    <div className="max-w-md mx-auto mt-4 mb-8 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-center text-red-200 animate-fade-in">
                    {err}
                    </div>
                )}

                {/* Spread Selector only if no draw */}
                {!draw && (
                    <div className="flex flex-col items-center gap-6 mt-6 mb-8 w-full max-w-md mx-auto">
                        <div className="w-full relative">
                        <div className="absolute top-3 left-3 text-indigo-400 z-10">
                            <MetricTooltip 
                            title="Asking the Cards" 
                            description="Focus on open-ended questions like 'What should I know about...' or 'How can I improve...' rather than simple Yes/No queries for richer insights."
                            >
                            <HelpCircle className="w-5 h-5 hover:text-indigo-300 transition-colors" />
                            </MetricTooltip>
                        </div>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={`Ask ${selectedPersona.name} a question...`}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-900/10 transition-all text-center"
                            maxLength={100}
                        />
                        </div>

                        <div className="flex justify-center gap-4 w-full">
                        <button
                        onClick={() => setSelectedSpread('SINGLE')}
                        className={clsx(
                            "px-4 py-3 rounded-xl border transition-all flex flex-col items-center gap-2 flex-1",
                            selectedSpread === 'SINGLE' 
                            ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-100 ring-1 ring-indigo-400/50" 
                            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                        )}
                        >
                        <Layers className="w-6 h-6" />
                        <span className="text-xs font-medium">Single Card</span>
                        <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Coins className="w-3 h-3" /> {CREDIT_COSTS.TAROT_READING}
                        </span>
                        </button>
                        
                        <button
                        onClick={() => setSelectedSpread('THREE')}
                        className={clsx(
                            "px-4 py-3 rounded-xl border transition-all flex flex-col items-center gap-2 flex-1",
                            selectedSpread === 'THREE' 
                            ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-100 ring-1 ring-indigo-400/50" 
                            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                        )}
                        >
                        <LayoutGrid className="w-6 h-6" />
                        <span className="text-xs font-medium">Past/Present/Future</span>
                        <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Coins className="w-3 h-3" /> {CREDIT_COSTS.TAROT_SPREAD_3}
                        </span>
                        </button>
                        </div>
                    </div>
                )}

                {/* Persona Display when Result is Shown */}
                {draw && (
                    <div className="flex flex-col items-center gap-4 mb-8 animate-fade-in">
                        <div 
                            className="w-28 h-28 rounded-full flex items-center justify-center shrink-0 relative border-2 bg-white/5"
                            style={{ 
                                borderColor: selectedPersona.themeColor, 
                                boxShadow: `0 0 30px ${selectedPersona.themeColor}40` 
                            }}
                        >
                            <div className="w-full h-full relative">
                                <Image 
                                    src={selectedPersona.avatarUrl} 
                                    alt={selectedPersona.name} 
                                    fill
                                    sizes="112px"
                                    className="object-contain p-1 drop-shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Text Area */}
                <div className="max-w-lg mx-auto">
                <p className="text-slate-400 mb-2">
                    {draw 
                        ? (question ? `"${question}"` : "Reflect on the wisdom revealed.")
                        : `Focus on your intention...`}
                </p>

                </div>
            </div>

            <div className="flex flex-col md:flex-row items-start justify-center gap-10">
                {/* Card Display Area */}
                <div className={clsx(
                    "w-full flex flex-col items-center gap-6",
                    (!draw || draw?.spreadType === 'THREE') ? "md:w-full" : "md:w-1/3"
                )}>
                
                {/* Interactive Deck (Selection Phase) */}
                {!draw && (
                    <InteractiveTarotDeck 
                        spreadType={selectedSpread}
                        onComplete={handleDraw}
                        isDrawing={drawing}
                    />
                )}

                {/* 3-Card Result */}
                {draw && draw.spreadType === 'THREE' && (
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full">
                    {draw.cards.map((card, idx) => {
                        const pos = idx === 0 ? "Past" : idx === 1 ? "Present" : "Future";
                        return (
                            <div key={idx} className="flex flex-col items-center">
                                <TarotCard 
                                    card={card} 
                                    revealed={isFlipped} 
                                    isDrawing={drawing}
                                    delay={idx * 0.2}
                                    position={pos}
                                />
                                <span className="mt-2 text-xs text-slate-500 uppercase tracking-wider">{pos}</span>
                            </div>
                        );
                    })}
                    </div>
                )}

                {/* Single Card Result */}
                {draw && draw.spreadType === 'SINGLE' && (
                    <div 
                        className="relative w-auto h-auto flex flex-col items-center perspective-1000 cursor-pointer group" 
                    >
                    <TarotCard 
                        card={draw.cards[0]} 
                        revealed={isFlipped} 
                        isDrawing={drawing}
                    />
                    </div>
                )}

                </div>
            </div>

            {/* Sticky New Reading Button (Moved to be above Interpretation) */}
            {draw && (
                <div ref={newReadingAnchorRef} className="w-full flex justify-center sm:justify-end mt-8 mb-4">
                <button
                    onClick={handleRedraw}
                    className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-indigo-600/95 to-purple-600/95 hover:from-indigo-500 hover:to-purple-500 text-white border border-white/10 shadow-lg shadow-indigo-900/40 backdrop-blur-md transition-all active:scale-[0.98] group"
                >
                    <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                    <span className="font-medium text-sm sm:text-base">New Reading</span>
                </button>
                </div>
            )}

            {draw && (
                <motion.div
                initial={false}
                animate={showFloatingNewReading ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="fixed top-20 left-0 right-0 z-[90] flex justify-center px-4 pointer-events-none sm:left-auto sm:right-6 sm:px-0 sm:justify-end"
                >
                <button
                    onClick={handleRedraw}
                    className={clsx(
                    "w-full sm:w-auto max-w-[520px] flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-indigo-600/95 to-purple-600/95 hover:from-indigo-500 hover:to-purple-500 text-white border border-white/10 shadow-xl shadow-indigo-900/50 backdrop-blur-md transition-all active:scale-[0.98] group",
                    showFloatingNewReading ? "pointer-events-auto" : "pointer-events-none"
                    )}
                >
                    <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                    <span className="font-semibold text-sm sm:text-base">New Reading</span>
                </button>
                </motion.div>
            )}

            {/* Interpretation Section */}
            <AnimatePresence>
                {draw && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="w-full max-w-6xl mx-auto mt-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-10"
                >

                    <div className="rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                         {/* Reader Avatar in Result */}
                         <div className={clsx(
                            "w-12 h-12 flex items-center justify-center shrink-0 relative rounded-full border-2",
                        )}
                        style={{ borderColor: selectedPersona.themeColor, boxShadow: `0 0 15px ${selectedPersona.themeColor}40` }}
                        >
                            <div className="absolute inset-0 rounded-full bg-white/5 blur-md" />
                            <Image 
                                src={selectedPersona.avatarUrl} 
                                alt={selectedPersona.name} 
                                fill
                                sizes="48px"
                                className="object-contain p-0.5 relative z-10"
                            />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Interpretation by {selectedPersona.name}</h4>
                            <span className="text-xs text-slate-500">{selectedPersona.role}</span>
                        </div>
                    </div>
                   
                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base md:text-lg">
                        <Markdown
                        components={{
                            h1: ({node: _node, ...props}) => <h3 className="text-amber-400 font-display font-bold text-xl md:text-2xl mt-6 mb-3" {...props} />,
                            h2: ({node: _node, ...props}) => <h3 className="text-amber-400 font-display font-bold text-xl md:text-2xl mt-6 mb-3" {...props} />,
                            h3: ({node: _node, ...props}) => <h3 className="text-amber-400 font-display font-bold text-xl md:text-2xl mt-6 mb-3" {...props} />,
                            strong: ({node: _node, ...props}) => <strong className="text-white font-bold" {...props} />,
                            p: ({node: _node, ...props}) => <p className="mb-4 leading-relaxed text-justify hyphens-auto" {...props} />,
                            li: ({node: _node, ...props}) => <li className="mb-1 marker:text-amber-400" {...props} />,
                        }}
                        >
                        {draw.interpretation}
                        </Markdown>
                    </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors text-sm"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
                        <span>{copied ? "Copied to Clipboard" : "Share Reading"}</span>
                    </button>

                    <button 
                        onClick={handleRedraw}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 transition-colors text-sm"
                    >
                        <Coins className="w-4 h-4" />
                        <span>New Reading</span>
                    </button>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Subcomponent for Card (Refactored for Real Graphics)
const TarotCard = ({ card, revealed, isDrawing, onClick, delay = 0, position }: { 
    card: { name: string; upright: boolean } | null, 
    revealed: boolean, 
    isDrawing?: boolean, 
    onClick?: () => void,
    delay?: number,
    position?: string
}) => {
    const [isLocalFlipped, setIsLocalFlipped] = useState(revealed);
    const [drawMessageIndex, setDrawMessageIndex] = useState(0);
    const particleDurations = [2.2, 2.7, 2.4, 2.9, 2.5, 3.0];
    
    const drawMessages = [
        "Aligning Stars...",
        "Consulting Arcana...",
        "Weaving Fate...",
        "Unveiling Truth...",
        "Connecting..."
    ];

    useEffect(() => {
        setIsLocalFlipped(revealed);
    }, [revealed]);

    // Cycle messages when drawing
    useEffect(() => {
        if (!isDrawing) return;
        const interval = setInterval(() => {
            setDrawMessageIndex(prev => (prev + 1) % drawMessages.length);
        }, 2000); // Slowed down from 1200ms
        return () => clearInterval(interval);
    }, [isDrawing]);

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (card) {
            // Allow flip toggling for results
            setIsLocalFlipped(!isLocalFlipped);
        }
    };

    const imageSrc = card ? getTarotCardImage(card.name) : null;

    return (
        <motion.div
          className="w-52 md:w-60 aspect-[1086/1810] relative preserve-3d cursor-pointer perspective-1000"
          onClick={handleClick}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
        >
            {/* Inner container for the flip animation */}
            <motion.div 
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: isLocalFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, delay, type: "spring", stiffness: 200, damping: 25 }}
            >
                {/* Card Back - Ultra Exquisite Design v3.5 - Theme Aligned */}
                <div className={clsx(
                    "absolute inset-0 w-full h-full backface-hidden rounded-xl shadow-2xl overflow-hidden z-0",
                    "border-[1.5px] border-[#c0a062]/50 bg-[#1e1b2e]", // Warmer border
                    !card && "group-hover:shadow-[0_0_30px_rgba(217,119,6,0.3)] transition-all duration-500"
                )}>
                    {/* 1. Base Layer: Richer Indigo/Purple Gradient (Matching Site Theme) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2e1065] via-[#1e1b4b] to-[#0f172a] opacity-95"></div>
                    
                    {/* 2. Complex Mandala Pattern (CSS-only) - Slightly brighter */}
                    <div className="absolute inset-0 opacity-20" 
                         style={{ 
                             backgroundImage: `
                                radial-gradient(circle at 50% 50%, transparent 10%, rgba(212,175,55,0.15) 10.5%, transparent 11%),
                                radial-gradient(circle at 50% 50%, transparent 20%, rgba(212,175,55,0.15) 20.5%, transparent 21%),
                                radial-gradient(circle at 50% 50%, transparent 30%, rgba(212,175,55,0.15) 30.5%, transparent 31%),
                                radial-gradient(circle at 0% 0%, transparent 40%, rgba(255,255,255,0.08) 40.5%, transparent 41%),
                                radial-gradient(circle at 100% 0%, transparent 40%, rgba(255,255,255,0.08) 40.5%, transparent 41%),
                                radial-gradient(circle at 0% 100%, transparent 40%, rgba(255,255,255,0.08) 40.5%, transparent 41%),
                                radial-gradient(circle at 100% 100%, transparent 40%, rgba(255,255,255,0.08) 40.5%, transparent 41%)
                             `,
                             backgroundSize: '100% 100%'
                         }}>
                    </div>
                    
                    {/* 3. Mystical Symbols Pattern (Background) */}
                    <div className="absolute inset-0 opacity-10"
                         style={{
                             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                         }}>
                    </div>

                    {/* 4. Ornate Borders - More Golden */}
                    <div className="absolute inset-2 border border-[#c0a062]/30 rounded-lg"></div>
                    <div className="absolute inset-4 border border-[#c0a062]/20 rounded-md"></div>
                    
                    {/* Corner Flourishes - Art Deco Style */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#c0a062]/70 rounded-tl-lg"></div>
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#c0a062]/70 rounded-tr-lg"></div>
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#c0a062]/70 rounded-bl-lg"></div>
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#c0a062]/70 rounded-br-lg"></div>

                    {/* 5. Central Medallion */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            {/* Rotating Elements */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-[#c0a062]/20 border-dashed"
                            />
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 rounded-full border border-indigo-300/20"
                            />
                            
                            {/* Center Motif - Eye or Sun */}
                            <div className="relative z-10 text-[#c0a062] drop-shadow-[0_0_15px_rgba(192,160,98,0.5)]">
                                <Sun className="w-12 h-12" strokeWidth={1} />
                            </div>
                        </div>
                    </div>
                    
                    {/* 6. Drawing State Animation & Text */}
                    <AnimatePresence>
                        {isDrawing && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#0f172a]/85 flex flex-col items-center justify-center backdrop-blur-sm z-30 overflow-hidden"
                        >
                            {/* Mystical Background Effects */}
                            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
                            
                            {/* Rotating Magic Circles */}
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              className="absolute w-[140%] h-[80%] border border-dashed border-indigo-500/30 rounded-full opacity-50"
                            />
                            <motion.div 
                              animate={{ rotate: -360 }}
                              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                              className="absolute w-[120%] h-[70%] border border-dotted border-purple-500/30 rounded-full opacity-50"
                            />

                            {/* Central Mystical Symbol Cycler */}
                            <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
                                {/* Glow Effect */}
                                <motion.div 
                                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                  className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl"
                                />
                                
                                {/* Cycle through mystical icons */}
                                <AnimatePresence mode="wait">
                                    {(() => {
                                        const icons = [
                                            { Icon: TarotWand, color: "text-amber-500", key: "wand" },
                                            { Icon: TarotChalice, color: "text-cyan-400", key: "chalice" },
                                            { Icon: TarotSword, color: "text-indigo-300", key: "sword" },
                                            { Icon: TarotPentacle, color: "text-yellow-400", key: "pentacle" },
                                            { Icon: TarotSun, color: "text-orange-400", key: "sun" },
                                            { Icon: TarotMoon, color: "text-purple-300", key: "moon" },
                                        ];
                                        const current = icons[drawMessageIndex % icons.length];
                                        const IconComp = current.Icon;
                                        
                                        return (
                                            <motion.div
                                                key={current.key}
                                                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                exit={{ opacity: 0, scale: 1.5, rotate: 45 }}
                                                transition={{ duration: 0.5 }}
                                                className="relative z-10"
                                            >
                                                <IconComp className={`w-16 h-16 ${current.color} drop-shadow-[0_0_15px_currentColor]`} />
                                            </motion.div>
                                        );
                                    })()}
                                </AnimatePresence>
                                
                                {/* Floating Particles */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ 
                                                y: [0, -20, 0], 
                                                opacity: [0, 1, 0],
                                                scale: [0.5, 1, 0.5]
                                            }}
                                            transition={{ 
                                                duration: particleDurations[i] ?? 2.5, 
                                                repeat: Infinity, 
                                                delay: i * 0.3,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute left-1/2 top-1/2 w-1 h-1 bg-amber-100 rounded-full shadow-[0_0_5px_white]"
                                            style={{ 
                                                marginLeft: Math.cos(i * 60 * Math.PI / 180) * 35,
                                                marginTop: Math.sin(i * 60 * Math.PI / 180) * 35
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Cycling Text */}
                            <div className="h-8 flex items-center justify-center overflow-hidden relative z-20 px-4 text-center">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={drawMessageIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="text-xs font-display tracking-[0.2em] uppercase text-indigo-100 drop-shadow-md"
                                    >
                                        {drawMessages[drawMessageIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Card Front */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-2xl overflow-hidden bg-slate-950 border border-indigo-500/30 z-0">
                    {card && imageSrc ? (
                        <div className="relative w-full h-full group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                            {/* Full Image Fill - Matches aspect ratio exactly */}
                            <Image 
                                src={imageSrc} 
                                alt={card.name} 
                                fill
                                sizes="(max-width: 768px) 200px, 240px"
                                className={clsx(
                                    "object-cover",
                                    !card.upright && "rotate-180"
                                )}
                                unoptimized
                                priority
                            />

                            {/* Text Overlay - Clean & Minimal */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 pb-4 px-3 text-center z-20 pointer-events-none">
                                <h3 className="text-amber-50 font-display font-bold text-xl leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                                    {card.name}
                                </h3>
                                <div className="flex items-center justify-center gap-1.5 mt-1.5 opacity-90">
                                    {card.upright ? <Sun className="w-3.5 h-3.5 text-amber-300 drop-shadow-md" /> : <Moon className="w-3.5 h-3.5 text-indigo-300 drop-shadow-md" />}
                                    <p className="text-indigo-100 text-[10px] uppercase tracking-[0.2em] font-medium drop-shadow-md">
                                        {card.upright ? "Upright" : "Reversed"}
                                    </p>
                                </div>

                            </div>
                            
                             {/* Position Badge (Top) */}
                             {position && (
                                <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] text-amber-100/90 uppercase tracking-widest border border-amber-500/20 shadow-lg">
                                    {position}
                                </div>
                             )}
                        </div>
                    ) : (
                         // Fallback if no image
                         <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center border-2 border-indigo-500/50 bg-indigo-950/50">
                             <span className="text-2xl text-indigo-200 font-display">{card?.name}</span>
                             <span className="text-sm text-indigo-400 mt-2">{card?.upright ? "Upright" : "Reversed"}</span>
                         </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};
