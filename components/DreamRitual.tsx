"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, SkipForward, Sparkles, Flame } from "lucide-react";
import {
  RITUAL_STEPS,
  RITUAL_OPENING,
  RITUAL_CLOSING,
  RitualAnswer,
  deriveSeat,
} from "../lib/dream-ritual";
import { nativeHaptics } from "../lib/native/haptics";

type Speaker = "stage" | "oracle" | "you";

interface Line {
  id: number;
  speaker: Speaker;
  text: string;
}

interface DreamRitualProps {
  /** Called with every answer given once the dreamer leaves the rite. */
  onComplete: (answers: RitualAnswer[]) => void;
  /** Called with whatever was answered before the dreamer walked out. */
  onSkip: (answers: RitualAnswer[]) => void;
  onAnswer?: (answer: RitualAnswer) => void;
}

const TYPE_SPEED_MS = 18;
const LINE_PAUSE_MS = 260;

/** The opening narration plus the first question, queued before anything else. */
const INTRO_LINES: Line[] = (() => {
  const first = RITUAL_STEPS[0];
  const texts: [Speaker, string][] = [
    ...RITUAL_OPENING.map((text) => ["stage", text] as [Speaker, string]),
    ...first.narration.map((text) => ["oracle", text] as [Speaker, string]),
    ["oracle", first.question],
  ];
  return texts.map(([speaker, text], idx) => ({ id: idx + 1, speaker, text }));
})();

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeToMotionPreference = (onChange: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getMotionPreference = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia(REDUCED_MOTION_QUERY).matches
    : false;

const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    () => false
  );

export const DreamRitual: React.FC<DreamRitualProps> = ({
  onComplete,
  onSkip,
  onAnswer,
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const lineId = useRef(INTRO_LINES.length);
  const logRef = useRef<HTMLDivElement>(null);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextLine = useCallback((speaker: Speaker, text: string): Line => {
    lineId.current += 1;
    return { id: lineId.current, speaker, text };
  }, []);

  const [revealed, setRevealed] = useState<Line[]>([]);
  const [pending, setPending] = useState<Line[]>(INTRO_LINES);
  const [typingText, setTypingText] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<RitualAnswer[]>([]);

  // Type out the head of the queue, character by character.
  useEffect(() => {
    const head = pending[0];
    if (!head) return;

    const commit = () => {
      setRevealed((prev) => [...prev, head]);
      setTypingText(null);
      setPending((prev) => prev.slice(1));
    };

    if (reducedMotion) {
      pauseTimer.current = setTimeout(commit, 0);
      return () => {
        if (pauseTimer.current) clearTimeout(pauseTimer.current);
      };
    }

    // typingText is left at null between lines, so the first tick below is what
    // puts the new line on screen - nothing is painted with stale text.
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setTypingText(head.text.slice(0, index));
      if (index >= head.text.length) {
        clearInterval(interval);
        pauseTimer.current = setTimeout(commit, LINE_PAUSE_MS);
      }
    }, TYPE_SPEED_MS);

    return () => {
      clearInterval(interval);
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };
  }, [pending, reducedMotion]);

  // Keep the newest line in view.
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTo({
      top: log.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [revealed, typingText, reducedMotion]);

  const isNarrating = pending.length > 0 || typingText !== null;
  const currentStep = RITUAL_STEPS[stepIndex];
  const isFinished = !currentStep && !isNarrating;
  const seat = useMemo(() => deriveSeat(answers), [answers]);

  const revealAll = () => {
    if (!isNarrating) return;
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    setRevealed((prev) => [...prev, ...pending]);
    setPending([]);
    setTypingText(null);
  };

  const handleChoice = (choiceId: string) => {
    if (!currentStep || isNarrating) return;

    const choice = currentStep.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    void nativeHaptics.action();

    const answer: RitualAnswer = { stepId: currentStep.id, choiceId: choice.id };
    setAnswers((prev) => [...prev, answer]);
    onAnswer?.(answer);

    setRevealed((prev) => [...prev, nextLine("you", choice.label)]);

    const upcoming: Line[] = [nextLine("oracle", choice.reply)];
    const nextStep = RITUAL_STEPS[stepIndex + 1];

    if (nextStep) {
      nextStep.narration.forEach((text) => upcoming.push(nextLine("oracle", text)));
      upcoming.push(nextLine("oracle", nextStep.question));
    } else {
      RITUAL_CLOSING.forEach((text) => upcoming.push(nextLine("stage", text)));
    }

    setPending(upcoming);
    setStepIndex((prev) => prev + 1);
  };

  const handleEnter = () => {
    void nativeHaptics.reveal();
    onComplete(answers);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="relative bg-mystic-800/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-8 shadow-2xl">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mystic-gold opacity-30 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mystic-gold opacity-30 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mystic-gold opacity-30 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mystic-gold opacity-30 rounded-br-lg"></div>

        {/* Header: phase tracker + skip */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-purple-900/50 to-indigo-900/40 border border-white/10 shrink-0">
              <Flame className="w-4 h-4 text-mystic-gold" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.25em] text-mystic-gold font-bold">
                The Opening Rite
              </p>
              <p className="text-xs text-slate-500 truncate">
                {currentStep ? currentStep.phase : "Dawn"} &middot;{" "}
                {Math.min(stepIndex + 1, RITUAL_STEPS.length)} of{" "}
                {RITUAL_STEPS.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5">
              {RITUAL_STEPS.map((step, idx) => (
                <span
                  key={step.id}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx < stepIndex
                      ? "w-6 bg-mystic-gold/80"
                      : idx === stepIndex
                        ? "w-6 bg-purple-400/70"
                        : "w-3 bg-white/10"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => onSkip(answers)}
              className="text-xs flex items-center gap-1 text-slate-500 hover:text-purple-300 transition-colors border border-white/5 bg-black/30 px-2 py-1 rounded-md"
            >
              <SkipForward className="w-3 h-3" /> Skip the rite
            </button>
          </div>
        </div>

        {/* Dialogue log */}
        <div
          ref={logRef}
          onClick={revealAll}
          className="no-scrollbar h-72 md:h-80 overflow-y-auto pr-1 space-y-4 text-left cursor-default"
        >
          {revealed.map((line, idx) => (
            <RitualLine
              key={line.id}
              line={line}
              grouped={revealed[idx - 1]?.speaker === line.speaker}
            />
          ))}
          {typingText !== null && pending[0] && (
            <RitualLine
              line={{ ...pending[0], text: typingText }}
              grouped={revealed[revealed.length - 1]?.speaker === pending[0].speaker}
              typing
            />
          )}
        </div>

        {isNarrating && (
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Tap to hear it all at once
          </p>
        )}

        {/* Choices */}
        <AnimatePresence mode="wait">
          {currentStep && !isNarrating && (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-5 space-y-2"
            >
              {currentStep.choices.map((choice, idx) => (
                <motion.button
                  key={choice.id}
                  type="button"
                  onClick={() => handleChoice(choice.id)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * idx, duration: 0.3 }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-mystic-900/70 border border-white/10 text-slate-200 font-serif text-base md:text-lg hover:border-purple-500/50 hover:bg-purple-900/20 hover:text-white transition-all"
                >
                  <span className="text-[10px] font-sans text-slate-600 border border-white/10 rounded px-1.5 py-0.5 shrink-0">
                    {idx + 1}
                  </span>
                  <span>{choice.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seat reveal + exit */}
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-5"
          >
            <div className="rounded-xl border border-mystic-gold/30 bg-gradient-to-b from-mystic-gold/10 to-transparent p-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2">
                Tonight you take the seat of
              </p>
              <p className="text-2xl md:text-3xl font-display text-mystic-gold mb-3">
                {seat.name}
              </p>
              <p className="text-slate-300 font-serif italic text-sm md:text-base">
                {seat.line}
              </p>
            </div>

            <button
              type="button"
              onClick={handleEnter}
              className="mt-4 w-full relative group overflow-hidden rounded-lg py-4 px-6 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 border border-white/10"></div>
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shimmer" />
              <div className="relative flex items-center justify-center gap-2 md:gap-3 text-purple-100 font-display tracking-widest uppercase text-xs md:text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Speak Your Dream</span>
              </div>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const RitualLine: React.FC<{
  line: Line;
  /** True when the previous line came from the same speaker. */
  grouped?: boolean;
  typing?: boolean;
}> = ({ line, grouped, typing }) => {
  if (line.speaker === "you") {
    return (
      <div className="flex justify-end animate-fade-in">
        <p className="max-w-[85%] rounded-xl rounded-br-sm bg-purple-900/30 border border-purple-500/20 px-4 py-2 text-slate-100 font-serif text-base md:text-lg">
          {line.text}
        </p>
      </div>
    );
  }

  if (line.speaker === "stage") {
    return (
      <p className="text-center text-slate-500 font-serif italic text-sm md:text-base px-2 animate-fade-in">
        {line.text}
        {typing && <Caret />}
      </p>
    );
  }

  return (
    <div className={`flex items-start gap-3 animate-fade-in ${grouped ? "-mt-2" : ""}`}>
      {grouped ? (
        <span className="w-8 shrink-0" aria-hidden="true" />
      ) : (
        <span className="mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-white/10 shrink-0">
          <Moon className="w-4 h-4 text-purple-200" />
        </span>
      )}
      <div className="min-w-0">
        {!grouped && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-mystic-gold mb-0.5">
            The Oracle
          </p>
        )}
        <p className="text-slate-200 font-serif text-base md:text-lg leading-relaxed">
          {line.text}
          {typing && <Caret />}
        </p>
      </div>
    </div>
  );
};

const Caret = () => (
  <span className="inline-block w-[2px] h-[1em] translate-y-[2px] ml-0.5 bg-purple-300 animate-pulse" />
);
