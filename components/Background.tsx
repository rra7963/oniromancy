"use client";
import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const RUNES = [
  // Original & Key Symbols - Increased visibility
  { symbol: "☽", top: "15%", left: "5%", size: "text-6xl", color: "text-white/30", rotate: 12 },
  { symbol: "⌬", bottom: "20%", right: "8%", size: "text-8xl", color: "text-purple-200/30", rotate: -12 },
  { symbol: "✦", top: "30%", right: "15%", size: "text-4xl", color: "text-indigo-200/30", rotate: 45 },
  { symbol: "☿", bottom: "40%", left: "12%", size: "text-5xl", color: "text-white/30", rotate: -6 },
  { symbol: "∞", top: "50%", left: "50%", size: "text-[200px]", color: "text-white/10", rotate: 90, blur: "blur-sm", center: true },
  
  // Planets - Deeper colors
  { symbol: "♃", top: "8%", right: "35%", size: "text-3xl", color: "text-violet-300/30", rotate: 120 },
  { symbol: "♄", bottom: "15%", left: "30%", size: "text-4xl", color: "text-indigo-300/30", rotate: -30 },
  { symbol: "♅", top: "70%", left: "8%", size: "text-5xl", color: "text-blue-300/30", rotate: 15 },
  { symbol: "♆", top: "20%", right: "45%", size: "text-4xl", color: "text-cyan-300/30", rotate: -10 },
  { symbol: "♇", bottom: "10%", right: "15%", size: "text-3xl", color: "text-purple-400/30", rotate: 25 },

  // Zodiac - More saturated
  { symbol: "♒︎", top: "25%", left: "20%", size: "text-2xl", color: "text-indigo-200/30", rotate: 12 },
  { symbol: "♓︎", bottom: "35%", right: "25%", size: "text-3xl", color: "text-purple-200/30", rotate: -12 },
  { symbol: "♈︎", top: "5%", left: "15%", size: "text-4xl", color: "text-red-200/30", rotate: 20 },
  { symbol: "♉︎", bottom: "25%", left: "40%", size: "text-3xl", color: "text-emerald-200/30", rotate: -5 },
  { symbol: "♊︎", top: "45%", right: "5%", size: "text-5xl", color: "text-yellow-200/30", rotate: 10 },
  { symbol: "♋︎", bottom: "55%", left: "2%", size: "text-2xl", color: "text-slate-300/30", rotate: -15 },
  { symbol: "♌︎", top: "12%", right: "25%", size: "text-4xl", color: "text-amber-300/30", rotate: 30 },
  { symbol: "♍︎", bottom: "5%", right: "35%", size: "text-3xl", color: "text-emerald-300/30", rotate: -20 },
  { symbol: "♎︎", top: "65%", left: "35%", size: "text-5xl", color: "text-pink-300/30", rotate: 5 },
  { symbol: "♏︎", bottom: "45%", right: "10%", size: "text-4xl", color: "text-red-300/30", rotate: -25 },
  { symbol: "♐︎", top: "85%", right: "40%", size: "text-3xl", color: "text-purple-300/30", rotate: 40 },
  { symbol: "♑︎", top: "35%", left: "45%", size: "text-2xl", color: "text-slate-400/30", rotate: -10 },

  // Alchemy & Elements - Added more
  { symbol: "🜁", top: "60%", right: "10%", size: "text-6xl", color: "text-white/20", rotate: 15 },
  { symbol: "🜂", top: "10%", left: "45%", size: "text-4xl", color: "text-white/20", rotate: -45 },
  { symbol: "🜃", bottom: "5%", left: "5%", size: "text-5xl", color: "text-white/20", rotate: 30 },
  { symbol: "🜄", bottom: "50%", right: "40%", size: "text-3xl", color: "text-white/20", rotate: 60 },
  { symbol: "🜔", top: "18%", left: "30%", size: "text-3xl", color: "text-slate-300/30", rotate: 45 },
  { symbol: "🜕", bottom: "30%", right: "20%", size: "text-4xl", color: "text-slate-300/30", rotate: -30 },
  { symbol: "🜖", top: "82%", left: "12%", size: "text-4xl", color: "text-amber-100/20", rotate: 15 }, // Mercury (Alchemy)
  { symbol: "🜍", bottom: "18%", right: "5%", size: "text-3xl", color: "text-orange-200/20", rotate: -10 }, // Sulfur
  { symbol: "🜎", top: "42%", left: "8%", size: "text-5xl", color: "text-yellow-100/20", rotate: 25 }, // Gold

  // Mystical & Misc - Expanded
  { symbol: "☉", top: "40%", left: "5%", size: "text-4xl", color: "text-amber-200/20", rotate: -15 },
  { symbol: "♀", bottom: "10%", right: "50%", size: "text-5xl", color: "text-pink-200/20", rotate: 180 },
  { symbol: "⚔", top: "55%", right: "2%", size: "text-3xl", color: "text-slate-400/20", rotate: 90 },
  { symbol: "⚜", bottom: "60%", left: "8%", size: "text-5xl", color: "text-amber-200/20", rotate: 0 },
  { symbol: "⚘", top: "75%", right: "30%", size: "text-4xl", color: "text-rose-200/20", rotate: -10 },
  { symbol: "⚓︎", bottom: "8%", left: "55%", size: "text-3xl", color: "text-blue-200/20", rotate: 15 },
  { symbol: "⚛", top: "2%", right: "2%", size: "text-6xl", color: "text-purple-200/20", rotate: 60 },
  { symbol: "✦", bottom: "22%", left: "15%", size: "text-2xl", color: "text-white/30", rotate: 45 },
  { symbol: "✧", top: "48%", right: "48%", size: "text-xl", color: "text-white/40", rotate: 0 },
  
  // New Additions - Filling gaps & adding variety
  // { symbol: "⚝", top: "3%", left: "35%", size: "text-4xl", color: "text-purple-300/25", rotate: 30 }, // Pentagram
  // { symbol: "𖤐", bottom: "42%", left: "25%", size: "text-3xl", color: "text-red-300/20", rotate: -15 }, // Pentagram inverted
  // { symbol: "🝆", top: "92%", right: "18%", size: "text-5xl", color: "text-cyan-200/20", rotate: 10 }, // Crescent
  // { symbol: "∞", bottom: "65%", right: "5%", size: "text-4xl", color: "text-indigo-200/25", rotate: 0 }, // Infinity
  // { symbol: "👁", top: "28%", left: "42%", size: "text-3xl", color: "text-blue-200/20", rotate: 0 }, // Eye
  // { symbol: "🝤", bottom: "2%", right: "2%", size: "text-5xl", color: "text-emerald-200/20", rotate: -45 }, // Alchemical
  // { symbol: "🝐", top: "58%", left: "2%", size: "text-3xl", color: "text-yellow-200/20", rotate: 20 }, // Alchemical
  // { symbol: "⚕", bottom: "85%", right: "45%", size: "text-4xl", color: "text-green-200/20", rotate: -10 }, // Asclepius
  // { symbol: "☥", top: "15%", right: "8%", size: "text-5xl", color: "text-amber-300/20", rotate: 5 }, // Ankh
  // { symbol: "☯", bottom: "50%", left: "50%", size: "text-6xl", color: "text-white/10", rotate: 0, blur: "blur-sm" }, // Yin Yang
  // { symbol: "☸", top: "80%", left: "22%", size: "text-4xl", color: "text-orange-300/20", rotate: 25 }, // Wheel of Dharma
  // { symbol: "⚘", bottom: "38%", right: "32%", size: "text-2xl", color: "text-rose-300/20", rotate: -5 }, // Flower
  // { symbol: "☘", top: "33%", left: "3%", size: "text-3xl", color: "text-emerald-300/20", rotate: 15 }, // Shamrock
  // { symbol: "⚡", bottom: "75%", right: "22%", size: "text-4xl", color: "text-yellow-300/25", rotate: -20 }, // Bolt
  // { symbol: "❄", top: "5%", right: "55%", size: "text-3xl", color: "text-cyan-100/25", rotate: 45 }, // Snowflake
  // { symbol: "☾", bottom: "12%", left: "22%", size: "text-5xl", color: "text-indigo-100/25", rotate: -30 }, // Moon
  // { symbol: "⛰", top: "62%", right: "55%", size: "text-4xl", color: "text-stone-300/20", rotate: 0 }, // Mountain
  // { symbol: "⛲", bottom: "92%", left: "38%", size: "text-3xl", color: "text-blue-300/20", rotate: 0 }, // Fountain
];

export const Background = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement - slightly more responsive
  const springConfig = { damping: 20, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Mobile check to reduce listeners
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Center the coordinate system
      const { innerWidth, innerHeight } = window;
      const xPos = e.clientX - innerWidth / 2;
      const yPos = e.clientY - innerHeight / 2;
      
      mouseX.set(xPos);
      mouseY.set(yPos);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#050208]">
      {/* Deep rich base gradient - Midnight Mystic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a0b2e_0%,#050208_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0518]/50 to-[#050208]" />

      {/* Sacred Geometry / Astrolabe Ring - Rotating slowly */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] opacity-[0.03] animate-[spin_120s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full text-white">
           <defs>
             <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
               <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
             </pattern>
           </defs>
           {/* Outer Rings */}
           <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="4 4" />
           <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="0.1" />
           
           {/* Geometric Star/Hexagon */}
           <path d="M100 10 L125 85 L190 100 L125 115 L100 190 L75 115 L10 100 L75 85 Z" fill="none" stroke="currentColor" strokeWidth="0.1" opacity="0.5" />
           
           {/* Inner Circles */}
           <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2 2" />
           <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" />
           
           {/* Runes/Glyphs on ring (Simulated with dashes/dots for now) */}
           <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="1 8" opacity="0.2" />
        </svg>
      </div>

      {/* Floating Runic Symbols - Animated */}
      {RUNES.map((rune, i) => (
        <motion.div
          key={i}
          // Hide many runes on mobile to improve performance (md:block)
          className={`absolute font-serif select-none pointer-events-none mix-blend-screen ${rune.size} ${rune.color} ${rune.blur || ''} ${i % 2 !== 0 ? 'hidden md:block' : ''}`}
          style={{
            top: rune.top,
            left: rune.left,
            right: rune.right,
            bottom: rune.bottom,
            x: rune.center ? "-50%" : 0,
            y: rune.center ? "-50%" : 0,
            willChange: "transform, opacity",
          }}
          initial={{ rotate: rune.rotate, opacity: 0 }}
          animate={{
            rotate: [rune.rotate, rune.rotate + 10, rune.rotate - 10, rune.rotate],
            y: [0, -15, 0, 15, 0],
            opacity: [0.2, 0.4, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10 + i * 2, // Varied duration based on index
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5, // Staggered start
          }}
        >
          {rune.symbol}
        </motion.div>
      ))}

      {/* Interactive Spotlight - Brighter and larger (Hidden on mobile) */}
      <motion.div
        style={{ x, y }}
        className="hidden md:block absolute left-1/2 top-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/15 blur-[100px] mix-blend-screen pointer-events-none"
      />
      <motion.div
        style={{ x, y }}
        className="hidden md:block absolute left-1/2 top-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/10 blur-[60px] mix-blend-plus-lighter pointer-events-none"
      />

      {/* Static Mobile Ambient Light (Instead of interactive spotlight) */}
      <div className="md:hidden absolute left-1/2 top-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[80px] mix-blend-screen pointer-events-none" />

      {/* Secondary Ambient Lights - Deeper colors */}
      <div className="absolute top-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[140px] animate-pulse-slow" />
      <div 
        className="absolute bottom-[-10%] right-[10%] w-[45%] h-[45%] rounded-full bg-blue-900/10 blur-[140px] animate-pulse-slow"
        style={{ animationDelay: "4s" }} 
      />
      
      {/* Subtle Grid/Texture Overlay - Slightly more visible */}
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-screen" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} 
      />
      
      {/* Noise Texture for premium feel */}
      <div className="absolute inset-0 opacity-[0.12] bg-[url('/images/noise.svg')] mix-blend-soft-light" />
    </div>
  );
};
