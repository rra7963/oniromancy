
import React, { useState } from 'react';
import { Sparkles, Moon, Zap, Coins, Crown, Flame, RotateCcw } from 'lucide-react';
import { User, SubscriptionTier, CREDIT_COSTS } from '../types';
import { nativeHaptics } from '../lib/native/haptics';
import { RitualAnswer, describeRite } from '../lib/dream-ritual';

interface DreamInputProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
  user: User | null;
  /** Answers given during the opening rite; empty when it was skipped. */
  ritualAnswers?: RitualAnswer[];
  onReplayRitual?: () => void;
}

const PRESETS = [
  "I walked through a neon-lit cyberpunk forest where the trees were circuit boards pulsating with data, and digital foxes watched me from the shadows.",
  "I was floating in a zero-gravity cathedral made of stained glass, and every time the bell tolled, the colors of the glass changed to match my emotions.",
  "I found an old pocket watch that didn't tell time but showed me alternate versions of my life, ticking backwards as I walked through a desert of blue sand.",
  "I was wandering through a library of floating books, and when I opened one, it didn't have words, but played a movie of a childhood memory I had forgotten.",
  "I was lost in a labyrinth of mirrors in a snowy forest; my reflection stepped out of the glass and handed me a lantern that glowed with a heartbeat."
];

export const DreamInput: React.FC<DreamInputProps> = ({
  onSubmit,
  isProcessing,
  user,
  ritualAnswers = [],
  onReplayRitual,
}) => {
  const [text, setText] = useState('');
  const rite = describeRite(ritualAnswers);
  const hasRite = rite.chips.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 5) {
      void nativeHaptics.action();
      onSubmit(text);
    }
  };

  const handleRandom = () => {
    const random = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setText(random);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="relative bg-mystic-800/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-8 shadow-2xl">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mystic-gold opacity-30 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mystic-gold opacity-30 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mystic-gold opacity-30 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mystic-gold opacity-30 rounded-br-lg"></div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-white/10 mb-4 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] animate-float">
            <Moon className="w-5 h-5 md:w-6 md:h-6 text-purple-200" />
          </div>
          <h2 className="text-2xl md:text-4xl font-display text-white mb-2 tracking-wide">
            Dream Interpretation
          </h2>

          {/* Credit Display */}
          {user && (
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-sans uppercase tracking-widest text-mystic-gold mb-2">
              {user.tier === SubscriptionTier.PRO ? (
                <>
                  <Crown className="w-4 h-4" /> The Mystic Active
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" /> {user.credits} Credits Available
                </>
              )}
            </div>
          )}

          <p className="text-slate-400 font-serif text-base md:text-lg italic">
            &quot;What visions haunted your slumber?&quot;
          </p>
        </div>

        {/* What the opening rite recorded — folded into the reading */}
        {(hasRite || onReplayRitual) && (
          <div className="mb-6 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <Flame className="w-3.5 h-3.5 text-mystic-gold shrink-0" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  {hasRite ? (
                    <>
                      Seated as{' '}
                      <span className="text-mystic-gold font-bold">
                        {rite.seat.name}
                      </span>
                    </>
                  ) : (
                    'The rite was skipped'
                  )}
                </span>
              </div>
              {onReplayRitual && (
                <button
                  type="button"
                  onClick={onReplayRitual}
                  disabled={isProcessing}
                  className="text-xs flex items-center gap-1 text-slate-500 hover:text-purple-300 transition-colors disabled:opacity-40"
                >
                  <RotateCcw className="w-3 h-3" />
                  {hasRite ? 'Sit again' : 'Sit with the Oracle'}
                </button>
              )}
            </div>

            {hasRite && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {rite.chips.map((chip) => (
                  <span
                    key={chip}
                    className="text-[11px] text-slate-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-1"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
            <textarea
              id="dream-input"
              name="dream"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isProcessing}
              placeholder="Describe your dream details..."
              className="relative w-full bg-mystic-900/80 text-slate-100 border border-white/10 rounded-xl p-4 md:p-5 pb-12 md:pb-5 h-36 md:h-44 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 placeholder-slate-600 resize-none text-base md:text-lg font-serif leading-relaxed transition-all"
            />
            <button
              type="button"
              onClick={handleRandom}
              disabled={isProcessing}
              className="absolute bottom-4 right-4 text-xs flex items-center gap-1 text-slate-500 hover:text-purple-300 transition-colors bg-black/30 px-2 py-1 rounded-md border border-white/5"
            >
              <Zap className="w-3 h-3" /> Surprise Me
            </button>
          </div>

          {/* Pro Tip for Novices */}
          <div className="flex items-start gap-2 text-xs text-slate-500 px-1 -mt-2">
            <p>
              <span className="text-mystic-gold font-bold">Tip:</span> For the
              most vivid visualization, describe colors, specific objects,
              emotions, and the atmosphere of your dream. The more details, the
              clearer the vision.
            </p>
          </div>

          <button
            type="submit"
            disabled={isProcessing || text.trim().length < 5}
            className={`w-full relative group overflow-hidden rounded-lg py-4 px-6 transition-all duration-500 ${
              isProcessing || text.trim().length < 5
                ? "opacity-50 grayscale"
                : "hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 opacity-100 border border-white/10"></div>
            {/* Shimmer effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shimmer" />

            <div className="relative flex items-center justify-center gap-2 md:gap-3 text-purple-100 font-display tracking-widest uppercase text-xs md:text-sm">
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Divining...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Manifest Vision ({CREDIT_COSTS.DREAM_ANALYSIS} Credits)
                  </span>
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};
