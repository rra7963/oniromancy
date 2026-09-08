import React, { useEffect, useState } from "react";
import { DailyFortune, User, CREDIT_COSTS } from "../types";
import {
  getDailyFortune,
  hasCredits,
} from "../services/storage";
import { generateDailyFortuneAction } from "../app/actions/horoscope";
import { trackEvent } from "../services/analytics";
import { todayKey } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Briefcase, Activity, Zap, Users, Sparkles, Star, Disc, Coins, Info, Clock, Share2, Check } from "lucide-react";
import clsx from "clsx";
import { MetricTooltip } from "./MetricTooltip";
import { ProfileGuidanceBanner } from "./ProfileGuidanceBanner";
import { ShareButtons } from "@/components/ShareButtons";
import { nativeHaptics } from "@/lib/native/haptics";
import { isNativeIOS } from "@/lib/native/platform";
import { shareContent } from "@/lib/native/share";

interface HoroscopeViewProps {
  user: User | null;
  onUserUpdate?: (user: User) => void;
}

export const HoroscopeView: React.FC<HoroscopeViewProps> = ({ user, onUserUpdate }) => {
  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [viewState, setViewState] = useState<'IDLE' | 'DRAWING' | 'RESULT'>('IDLE');
  const [isRecast, setIsRecast] = useState(false);
  const [showAltText, setShowAltText] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (viewState !== 'IDLE') return;
    const interval = setInterval(() => {
      setShowAltText(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, [viewState]);

  useEffect(() => {
    const fetchFortune = async () => {
      // 1. If we have it in memory, don't fetch
      if (fortune) return;
      
      if (!user?.id) {
        return;
      }
      
      try {
        const existing = await getDailyFortune(user.id, todayKey());

        if (existing) {
          setFortune(existing);
          setViewState('RESULT');
        }
      } catch (e) {
        console.error("Failed to fetch fortune:", e);
      }
    };
    fetchFortune();
  }, [user, fortune]);

  const handleDraw = async () => {
    if (!user) return;
    
    const COST = CREDIT_COSTS.HOROSCOPE;
    if (!hasCredits(user, COST)) {
      trackEvent('begin_checkout', { from: 'horoscope', reason: 'insufficient_credits', cost: COST });
      setErr(`The stars require an offering of ${COST} credits.`);
      return;
    }

    trackEvent('draw_horoscope', { cost: COST });
    void nativeHaptics.action();
    setViewState('DRAWING');
    setErr(null);
    
    // Artificial delay for ritual animation (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      // Call secure server action
      const f = await generateDailyFortuneAction(isRecast);
      
      // Optimistic update
      if (onUserUpdate) onUserUpdate({ ...user, credits: Math.max(0, user.credits - COST) });

      setFortune(f);
      setViewState('RESULT');
      setIsRecast(false); // Reset recast flag
      void nativeHaptics.reveal();
    } catch (e: unknown) {
      console.error("Fortune generation failed:", e);
      let message = "The stars are silent.";
      if (e instanceof Error) {
        message = e.message;
      }
      setErr(message);
      setViewState('IDLE');
      setIsRecast(false);
    }
  };

  const handleRedraw = () => {
    window.scrollTo(0, 0);
    setViewState('IDLE');
    setFortune(null);
    setIsRecast(true);
  };

  const handleShare = async () => {
    if (!fortune) return;
    const text = `✨ My Daily Prophecy ✨\n\n"${fortune.oracleMessage}"\n\nLucky Number: ${fortune.luckyNumber}\nPower Color: ${fortune.luckyColor}\n\nRead yours at Oniromancy AI`;

    if (isNativeIOS()) {
      await shareContent({
        title: "Oniromancy AI Horoscope",
        text: "Discover your daily horoscope with Oniromancy AI.",
        url: "https://www.oniromancy.com/horoscope",
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

  if (!user) {
    return (
      <div className="text-center py-20 text-slate-300 font-display text-xl">Please sign in</div>
    );
  }

  if (viewState === 'DRAWING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
        <motion.div 
          animate={{ rotate: [0, -5, 5, -5, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="w-64 h-64 rounded-full bg-mystic-gold/10 border-4 border-mystic-gold/30 flex items-center justify-center mb-8 shadow-[0_0_100px_rgba(216,180,254,0.3)]"
        >
          <Sparkles className="w-32 h-32 text-mystic-gold animate-pulse" />
        </motion.div>
        <p className="text-mystic-gold font-display text-2xl tracking-widest animate-pulse text-center">Aligning Constellations...</p>
      </div>
    );
  }

  if (viewState === 'IDLE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
         <ProfileGuidanceBanner user={user} />
         <div className="relative group cursor-pointer" onClick={handleDraw}>
            <div className="w-64 h-64 rounded-full bg-mystic-gold/5 border-2 border-mystic-gold/20 flex items-center justify-center relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:border-mystic-gold/50 group-hover:shadow-[0_0_50px_rgba(216,180,254,0.2)]">
               <Sparkles className="w-24 h-24 text-mystic-gold/50 animate-pulse" />
               <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
               <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_15s_reverse_linear_infinite]" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-center w-full px-4">
               <div className="h-16 flex items-center justify-center">
                 <AnimatePresence mode="wait">
                   {showAltText ? (
                     <motion.p
                       key="press-it"
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       transition={{ duration: 0.5 }}
                       className="text-mystic-gold font-display text-2xl font-bold tracking-widest uppercase drop-shadow-lg leading-relaxed"
                     >
                       PRESS IT
                     </motion.p>
                   ) : (
                     <motion.p
                       key="consult"
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       transition={{ duration: 0.5 }}
                       className="text-mystic-gold font-display text-2xl font-bold tracking-widest uppercase drop-shadow-lg leading-relaxed"
                     >
                       Consult <br />The Star
                     </motion.p>
                   )}
                 </AnimatePresence>
               </div>
               <p className="text-white/50 text-xs mt-10 font-serif flex items-center justify-center gap-1">
                  <Coins className="w-3 h-3" /> {CREDIT_COSTS.HOROSCOPE} Credit
               </p>
            </div>
         </div>

         <p className="mt-8 text-mystic-gold font-display text-lg md:text-xl tracking-widest uppercase animate-pulse text-center">
            the transformation begins
         </p>
         
         <div className="mt-8 max-w-lg text-center px-6 animate-fade-in-up delay-100">
            <h3 className="text-slate-300 font-display text-sm uppercase tracking-widest mb-3 flex items-center justify-center gap-2 opacity-80">
              <Star className="w-4 h-4 text-mystic-gold" /> 
              Daily Cosmic Guidance
            </h3>
            <p className="text-slate-400 font-serif leading-relaxed text-sm">
              Unlock the secrets of your day. Our oracle analyzes celestial alignments to reveal insights for your <span className="text-rose-300">Love</span>, <span className="text-amber-300">Career</span>, and <span className="text-emerald-300">Vitality</span>.
            </p>
         </div>
         {err && <p className="mt-4 text-red-400 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/20">{err}</p>}
      </div>
    );
  }

  if (err) {
    return (
      <div className="w-full max-w-md mx-auto mt-10 p-6 bg-red-900/20 border border-red-500/30 rounded-2xl text-center">
        <p className="text-red-200 mb-2">The stars are clouded.</p>
        <p className="text-red-300 text-sm">{err}</p>
        <button onClick={handleRedraw} className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (!fortune) return null;

  const defaultDim = { score: 50, summary: "The stars are aligning...", advice: "Patience is key." };
  const rawDims = fortune.dimensions || {};
  const dims = {
    love: rawDims.love || defaultDim,
    career: rawDims.career || defaultDim,
    health: rawDims.health || defaultDim,
    creativity: rawDims.creativity || defaultDim,
    social: rawDims.social || defaultDim,
    luckyTime: rawDims.luckyTime,
    compatibleZodiac: rawDims.compatibleZodiac,
  };

  const items = [
    { key: "Love", label: "Love", icon: Heart, data: dims.love, color: "text-rose-400", bar: "bg-rose-500" },
    { key: "Career", label: "Career", icon: Briefcase, data: dims.career, color: "text-amber-400", bar: "bg-amber-500" },
    { key: "Health", label: "Vitality", icon: Activity, data: dims.health, color: "text-emerald-400", bar: "bg-emerald-500" },
    { key: "Creativity", label: "Creation", icon: Zap, data: dims.creativity, color: "text-purple-400", bar: "bg-purple-500" },
    { key: "Social", label: "Social", icon: Users, data: dims.social, color: "text-blue-400", bar: "bg-blue-500" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto pb-20"
    >
      <ProfileGuidanceBanner user={user} />
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm mb-4 font-mono">
          <Sparkles className="w-3 h-3 text-mystic-gold" />
          {fortune.date}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tight">
          Daily Prophecy
        </h1>
        <p className="text-slate-400 text-lg font-serif italic">
          {user.zodiac ? `For ${user.zodiac}` : "Written in the Stars"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Oracle Message Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-mystic-900/60 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-600/20 transition-colors duration-700" />
            
            <div className="absolute top-4 right-4 z-20">
               <button 
                 onClick={handleShare}
                 className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/20 transition-colors text-white/50 hover:text-white border border-white/5 hover:border-white/20 text-xs font-medium backdrop-blur-md"
                 title="Share Prophecy"
               >
                 {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                 <span>{copied ? "Copied" : "Share"}</span>
               </button>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-display font-bold text-mystic-gold mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 fill-mystic-gold" />
                Oracle&apos;s Whisper
              </h3>
              <blockquote className="text-2xl md:text-3xl font-serif text-white leading-relaxed mb-8 italic opacity-90">
                &quot;{fortune.oracleMessage}&quot;
              </blockquote>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <span className="text-black font-bold text-sm">#</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider">Lucky Number</div>
                    <div className="text-xl font-bold text-white font-display">{fortune.luckyNumber}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                  {(() => {
                    const colorString = fortune.luckyColor || '';
                    const hexMatch = colorString.match(/\((#[0-9A-Fa-f]{6})\)/);
                    const colorHex = hexMatch ? hexMatch[1] : (colorString.toLowerCase() || '#888');
                    const colorName = colorString.replace(/\s*\(#[0-9A-Fa-f]{6}\)/, '');

                    return (
                      <>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-white/20" style={{ backgroundColor: colorHex }}>
                          <Disc className="w-4 h-4 text-white/80 mix-blend-difference" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider">Power Color</div>
                          <div className="text-xl font-bold text-white font-display capitalize">{colorName || 'Unknown'}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Lucky Time */}
                {dims.luckyTime && (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-500 flex items-center justify-center shadow-lg">
                       <Clock className="w-4 h-4 text-white" />
                     </div>
                     <div>
                       <div className="text-xs text-slate-500 uppercase tracking-wider">Peak Time</div>
                       <div className="text-lg font-bold text-white font-display">{dims.luckyTime}</div>
                     </div>
                  </div>
                )}
                
                {/* Compatible Zodiac */}
                {dims.compatibleZodiac && (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                       <Users className="w-4 h-4 text-white" />
                     </div>
                     <div>
                       <div className="text-xs text-slate-500 uppercase tracking-wider">Soul Match</div>
                       <div className="text-lg font-bold text-white font-display">{dims.compatibleZodiac}</div>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Dimensions */}
          <div className="space-y-4">
             {items.map((item, idx) => (
               <motion.div 
                 key={item.key}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 * idx }}
                 className="bg-black/20 backdrop-blur-sm border border-white/5 p-5 rounded-2xl hover:bg-white/5 transition-colors"
               >
                 <div className="flex items-start gap-4">
                   <div className={clsx("p-3 rounded-xl bg-white/5", item.color)}>
                     <item.icon className="w-6 h-6" />
                   </div>
                   <div className="flex-grow">
                     <div className="flex justify-between items-center mb-2">
                       <h4 className="font-bold text-white">{item.label}</h4>
                       <span className={clsx("font-mono font-bold", item.color)}>{item.data.score}%</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.data.score}%` }}
                         transition={{ duration: 1, delay: 0.2 + (0.1 * idx) }}
                         className={clsx("h-full rounded-full", item.bar)}
                       />
                     </div>
                     <p className="text-slate-300 text-sm leading-relaxed">{item.data.summary}</p>
                     <p className="text-slate-500 text-xs mt-2 italic">💡 {item.data.advice}</p>
                   </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>

        {/* Sidebar / Summary - Cosmic Alignment */}
        <div className="block space-y-6">
          <div className="lg:sticky lg:top-24">
            <div className="bg-gradient-to-b from-mystic-900/80 to-black/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-mystic-gold/5 rounded-full blur-3xl pointer-events-none" />
              
              <MetricTooltip title="Cosmic Alignment" description="An aggregate score of your celestial harmony today (0-100%). Higher percentages indicate stronger alignment with cosmic forces, suggesting a favorable time for action. Lower scores advise caution and introspection.">
                <div>
                  <h4 className="text-white font-bold mb-4 font-display tracking-wider uppercase text-sm flex items-center justify-center gap-2">
                    Cosmic Alignment 
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                  </h4>
                  
                  <div className="w-full aspect-square relative flex items-center justify-center mb-6">
                     {/* Background Rings */}
                     <div className="absolute inset-0 rounded-full border border-white/5" />
                     <div className="absolute inset-4 rounded-full border border-white/5" />
                     
                     {/* Animated Rings */}
                     <div className="absolute inset-2 rounded-full border border-mystic-gold/20 border-dashed animate-[spin_20s_linear_infinite]" />
                     <div className="absolute inset-8 rounded-full border border-mystic-gold/10 animate-[spin_15s_reverse_linear_infinite]" />
                     
                     {/* Center Content */}
                     <div className="relative z-10 flex flex-col items-center justify-center w-32 h-32 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 shadow-[0_0_30px_rgba(216,180,254,0.1)]">
                       <span className="text-xs text-mystic-gold/60 font-serif uppercase tracking-widest mb-1">Total</span>
                       <div className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-mystic-gold via-white to-mystic-gold drop-shadow-sm">
                         {Math.round(items.reduce((acc, curr) => acc + curr.data.score, 0) / 5)}%
                       </div>
                     </div>
                  </div>
                </div>
              </MetricTooltip>

              <p className="text-sm text-slate-300 mb-6 leading-relaxed border-t border-white/5 pt-4">
                 Cosmic alignment fluctuates daily based on planetary transits relative to your birth chart.
              </p>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Share Your Fortune</h4>
                <div className="flex justify-center">
                  <ShareButtons 
                    title={`My Daily Horoscope: ${fortune.oracleMessage}`} 
                    url="https://www.oniromancy.com/horoscope" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
