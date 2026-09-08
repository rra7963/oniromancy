
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { DreamResult } from '../types';
import { Share2, RefreshCcw, Download, Loader2, Check, Sparkles, Fingerprint, Info, Zap, Wind, Heart, List, Flame, Droplets, Mountain, Atom, Moon, Eye } from 'lucide-react';
import { MetricTooltip } from './MetricTooltip';
import { ShareModal } from './ShareModal';
import { trackEvent } from '../services/analytics';
import { isNativeIOS } from '../lib/native/platform';
import { shareContent } from '../lib/native/share';

interface DreamCardProps {
  result: DreamResult;
  onReset: () => void;
}

export const DreamCard: React.FC<DreamCardProps> = ({ result, onReset }) => {
  const { analysis, imageUrl } = result;
  const [copied, setCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [scale, setScale] = useState(0.85);
  const [artifactNumber] = useState(() => Math.floor(Math.random() * 9000) + 1000);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        // On mobile, scale to fit width with some padding
        // Card width is 540px. We want it to fit in (width - 32px)
        const newScale = Math.min(0.85, (width - 32) / 540);
        setScale(newScale);
      } else {
        setScale(0.85);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when preview is open
  useEffect(() => {
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPreviewOpen]);

  const appUrl = `https://www.oniromancy.com/?dreamId=${result.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}&color=000000&bgcolor=FFFFFF&margin=0`;

  const handleShare = async () => {
    trackEvent('share_dream', { dream_id: result.id, dream_title: analysis.title });
    const shareText = `🔮 The Oracle speaks: "${analysis.title}"\n\n${analysis.oracleMessage}\n\nInterpret yours at ${appUrl}`;

    if (isNativeIOS()) {
      await shareContent({
        title: "Oniromancy AI Dream Reading",
        text: "Create a dream reading with Oniromancy AI.",
        url: "https://www.oniromancy.com",
        dialogTitle: "Share Oniromancy AI",
      });
      return;
    }
    
    // Check for native share support (Mobile preferred)
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent);
    
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: 'Oniromancy AI',
          text: shareText,
          url: appUrl,
        });
        return;
      } catch {
        // Share cancelled
      }
    }

    // Desktop or fallback: Open Custom Modal
    setShowShareModal(true);
  };

  const handleDownload = async () => {
    trackEvent('download_dream', { dream_id: result.id });
    setIsDownloading(true);
    const element = document.getElementById('dream-tarot-card');

    if (element) {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(element, {
          backgroundColor: '#050505', 
          width: 540,
          height: 960,
          style: {
            transform: 'none',
            marginBottom: '0',
            margin: '0',
            boxShadow: 'none',
          },
          pixelRatio: 2,
          cacheBust: true,
          skipFonts: true,
        });
        
        const link = document.createElement('a');
        link.download = `oniromancy-${analysis.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Failed to capture card", err);
        alert("The vision could not be captured. Please try again.");
      }
    }
    setIsDownloading(false);
  };

  const dateStr = new Date(result.timestamp).toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).toUpperCase().split(' ').join(' . ');

  const getElementIcon = (el: string) => {
    const lower = el.toLowerCase();
    if (lower.includes('fire')) return <Flame className="w-5 h-5 text-amber-500 mx-auto mb-2" />;
    if (lower.includes('water')) return <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-2" />;
    if (lower.includes('earth')) return <Mountain className="w-5 h-5 text-emerald-400 mx-auto mb-2" />;
    if (lower.includes('air')) return <Wind className="w-5 h-5 text-sky-400 mx-auto mb-2" />;
    if (lower.includes('ether')) return <Atom className="w-5 h-5 text-purple-400 mx-auto mb-2" />;
    return <Wind className="w-5 h-5 text-sky-400 mx-auto mb-2" />;
  };

  return (
    <div className="w-full mx-auto animate-fade-enter pb-20 max-w-7xl px-4 md:px-8">
      {/* USER VISION BANNER (Above Both Columns) */}
      {result.dreamInput && (
        <div className="w-full mb-12 animate-slide-down">
          <div className="w-full max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium uppercase tracking-widest text-slate-400 mb-4">
              <Eye className="w-3 h-3" /> The Dreamer&apos;s Vision
            </div>
            <p className="font-serif text-xl md:text-2xl italic text-slate-200 leading-relaxed drop-shadow-lg">
              &quot;{result.dreamInput}&quot;
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
        {/* --- LEFT COLUMN: THE ARTIFACT (Capture Area) --- */}
        <div className="flex flex-col items-center shrink-0 w-full lg:w-auto lg:sticky lg:top-24">
          {/* Card Wrapper to prevent layout overflow while allowing visual scaling */}
          <div className="w-full overflow-hidden flex justify-center relative pb-4">
            <div
              style={{
                width: "540px",
                height: "960px",
                transform: `scale(${scale})`, // Responsive scale
                transformOrigin: "top center",
                marginBottom: `-${960 * (1 - scale)}px`, // Dynamic compensation for scale
              }}
            >
              <div
                id="dream-tarot-card"
                onClick={() => setIsPreviewOpen(true)}
                className="w-full h-full relative flex flex-col overflow-hidden shrink-0 shadow-2xl cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "#050505",
                  color: "#e2e8f0",
                }}
              >
              {/* 1. TEXTURE & ATMOSPHERE */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                }}
              ></div>

              <div className="absolute inset-3 border border-[#d4af37] opacity-20 pointer-events-none z-50 rounded-sm mix-blend-overlay"></div>

              {/* 2. IMAGE SECTION (Expanded to 75%) */}
              <div className="absolute top-0 left-0 w-full h-[75%] z-0">
                <Image
                  src={imageUrl}
                  alt={analysis.title}
                  fill
                  sizes="(max-width: 600px) 100vw, 540px"
                  className="object-cover opacity-90 contrast-110 saturate-[0.9]"
                />
                {/* Top Vignette */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#050505]/70 to-transparent z-10"></div>

                {/* Bottom Gradient - Smooth Transition */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10"></div>
                <div className="absolute -bottom-1 w-full h-[50%] bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-10"></div>
              </div>

              {/* 3. CONTENT CONTAINER */}
              <div className="relative z-20 flex flex-col h-full px-6 pb-6">
                {/* Header */}
                <div className="flex justify-between items-start pt-8 w-full">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 shadow-lg">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase text-[#d4af37]">
                      No. {artifactNumber}
                    </span>
                  </div>
                  <span className="text-[10px] tracking-[0.2em] font-mono text-white/90 bg-black/40 backdrop-blur-md px-2 py-1 rounded shadow-lg">
                    {dateStr}
                  </span>
                </div>

                {/* SPACER - Pushes content down */}
                <div className="flex-1"></div>

                {/* Main Typography Body */}
                <div className="flex flex-col items-center text-center mb-2">
                  {/* Symbols */}
                  <div className="flex items-center justify-center gap-4 mb-3">
                    {analysis.symbols.slice(0, 3).map((sym, i) => (
                      <div key={i} className="flex items-center justify-center">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                          {sym}
                        </span>
                        {i < 2 && (
                          <span className="mx-2 text-[8px] text-white/20">
                            •
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl font-display text-white uppercase tracking-[0.02em] leading-[0.9] mb-4 drop-shadow-[0_5px_10px_rgba(0,0,0,1)]">
                    {analysis.title}
                  </h1>

                  {/* Prophecy Quote */}
                  <div className="relative mb-4 max-w-[95%]">
                    <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-3 opacity-50"></div>
                    <p className="font-serif text-lg text-[#f0e6d2] italic leading-snug drop-shadow-lg">
                      &quot;{analysis.oracleMessage}&quot;
                    </p>
                    <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-3 opacity-50"></div>
                  </div>

                  {/* Interpretation */}
                  <div className="mb-5 px-2 relative group">
                    <p className="font-serif text-[14px] leading-6 text-slate-300 text-justify opacity-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-5">
                      {analysis.interpretation}
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-center gap-8 border-t border-white/10 py-3 w-full max-w-[280px] bg-black/30 backdrop-blur-sm rounded-lg px-4 mb-1 shadow-lg">
                    <div className="text-center">
                      <div className="text-[7px] uppercase tracking-widest text-slate-500 mb-0.5">
                        Lucidity
                      </div>
                      <div className="font-mono text-xs text-white">
                        {analysis.psycheScore}%
                      </div>
                    </div>
                    <div className="w-[1px] h-5 bg-white/10"></div>
                    <div className="text-center">
                      <div className="text-[7px] uppercase tracking-widest text-slate-500 mb-0.5">
                        Element
                      </div>
                      <div className="font-mono text-xs text-white">
                        {analysis.element}
                      </div>
                    </div>
                    <div className="w-[1px] h-5 bg-white/10"></div>
                    <div className="text-center">
                      <div className="text-[7px] uppercase tracking-widest text-slate-500 mb-0.5">
                        Lucky #
                      </div>
                      <div className="font-mono text-xs text-white">
                        {analysis.luckyNumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. FOOTER */}
                <div className="pt-4 flex items-end justify-between border-t border-[#d4af37]/30 relative mt-1">
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-[#d4af37] rotate-45 box-shadow-[0_0_10px_#d4af37]"></div>
                      <h3 className="font-display font-bold text-lg tracking-[0.25em] text-white/90">
                        ONIROMANCY
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-[#666] pl-4">
                      <Fingerprint className="w-3 h-3 opacity-50" />
                      <span className="text-[8px] font-sans uppercase tracking-[0.2em]">
                        ID: {result.userId.slice(-6)}
                      </span>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-1 bg-[#d4af37]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative p-1 bg-[#0a0a0a] border border-[#d4af37]/40">
                      <Image
                        src={qrCodeUrl}
                        alt="QR"
                        width={44}
                        height={44}
                        className="opacity-90 invert mix-blend-screen contrast-125"
                      />
                    </div>
                    <div className="absolute -top-px -right-px w-1.5 h-1.5 border-t border-r border-[#d4af37]"></div>
                    <div className="absolute -bottom-px -left-px w-1.5 h-1.5 border-b border-l border-[#d4af37]"></div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="mt-4 w-full flex flex-col sm:flex-row gap-4 justify-center max-w-[540px]">
            <button
              onClick={onReset}
              className="flex-1 sm:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-full font-sans text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> New Dream
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 sm:flex-none px-8 py-3 bg-[#d4af37] hover:bg-amber-400 text-black rounded-full font-sans text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:-translate-y-1"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Save Artifact
            </button>

            <button
              onClick={handleShare}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-full font-sans text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
                copied
                  ? "bg-green-600 border-green-500 text-white"
                  : "bg-[#1a1a24] border-white/20 text-white hover:bg-[#252530]"
              }`}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN: DETAILED ANALYSIS (Grimoire Entry) --- */}
        <div className="flex-1 w-full max-w-2xl animate-slide-up-fade delay-200">
          <div className="bg-mystic-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl sticky top-24">
            <div className="flex items-center gap-3 border-b border-white/10 pb-6 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Moon className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-display text-white">
                  {analysis.title}
                </h2>
              </div>
            </div>

            <div className="space-y-8">
              {/* 0. The Prophecy (New Section) */}
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> The Prophecy
                </h3>
                <p className="text-white font-serif text-xl italic leading-relaxed relative z-10">
                  &quot;{analysis.oracleMessage}&quot;
                </p>
              </div>

              {/* 1. Full Interpretation */}
              <div>
                <h3 className="text-sm font-bold text-mystic-gold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Moon className="w-4 h-4" /> The Interpretation
                </h3>
                <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed font-serif text-lg">
                  {analysis.interpretation.split("\n").map((paragraph, idx) => (
                    <p key={idx} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* 2. Actionable Advice */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Actionable Guidance
                </h3>
                <p className="text-slate-200 italic font-serif border-l-2 border-emerald-500/50 pl-4">
                  &quot;{analysis.actionableAdvice}&quot;
                </p>
              </div>

              {/* 3. Symbols */}
              <div>
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <List className="w-4 h-4" /> Key Symbols
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.symbols.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200 text-sm"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Elemental & Emotional Alignment (Interactive) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <MetricTooltip
                  title="Dream Mood"
                  description="The dominant emotional tone of your dreamscape, reflecting your subconscious state."
                >
                  <div className="h-full p-4 bg-black/20 rounded-xl border border-white/5 text-center hover:bg-black/40 transition-colors flex flex-col justify-center items-center">
                    <Heart className="w-5 h-5 text-rose-400 mb-2" />
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                      Mood <Info className="w-3 h-3 opacity-50" />
                    </div>
                    <div className="text-white font-medium capitalize">
                      {analysis.mood}
                    </div>
                  </div>
                </MetricTooltip>

                <MetricTooltip
                  title="Elemental Energy"
                  description="The primary elemental force (Fire, Water, Air, Earth, Ether) influencing your vision."
                >
                  <div className="h-full p-4 bg-black/20 rounded-xl border border-white/5 text-center hover:bg-black/40 transition-colors flex flex-col justify-center items-center">
                    {getElementIcon(analysis.element)}
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                      Element <Info className="w-3 h-3 opacity-50" />
                    </div>
                    <div className="text-white font-medium">
                      {analysis.element}
                    </div>
                  </div>
                </MetricTooltip>

                <MetricTooltip
                  title="Lucidity Score"
                  description="Measures the clarity and self-awareness of your dream state (0-100%). Higher scores indicate vivid, lucid experiences where you may control the narrative."
                >
                  <div className="h-full p-4 bg-black/20 rounded-xl border border-white/5 text-center hover:bg-black/40 transition-colors flex flex-col justify-center items-center">
                    <Zap className="w-5 h-5 text-amber-400 mb-2" />
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                      Lucidity <Info className="w-3 h-3 opacity-50" />
                    </div>
                    <div className="text-white font-medium">
                      {analysis.psycheScore}%
                    </div>
                  </div>
                </MetricTooltip>

                <MetricTooltip
                  title="Lucky Number"
                  description="A numerological anchor derived from the symbols in your dream to guide your waking life."
                >
                  <div className="h-full p-4 bg-black/20 rounded-xl border border-white/5 text-center hover:bg-black/40 transition-colors flex flex-col justify-center items-center">
                    <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                      Lucky # <Info className="w-3 h-3 opacity-50" />
                    </div>
                    <div className="text-white font-medium">
                      {analysis.luckyNumber}
                    </div>
                  </div>
                </MetricTooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        result={{
          id: result.id,
          title: analysis.title,
          text: `🔮 The Oracle speaks: "${analysis.title}"\n\n${analysis.oracleMessage}`,
          url: appUrl
        }}
        onDownload={handleDownload}
      />

      {/* PREVIEW MODAL */}
      {isPreviewOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt={analysis.title}
              className="max-w-[95vw] max-h-[85vh] md:max-h-[95vh] object-contain shadow-2xl pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
              }} 
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
