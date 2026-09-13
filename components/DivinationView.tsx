"use client";

import React, { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Loader2, Share2, Check, RotateCcw, History as HistoryIcon, Sparkles } from "lucide-react";

import { DivinationReading, User } from "../types";
import {
  DivinationConfig,
  DivinationInput,
  validateDivinationInput,
} from "../lib/divination";
import { performDivinationAction } from "../app/actions/divination";
import {
  loadDivinationHistory,
  saveDivinationToHistory,
} from "../services/divinationHistory";
import { trackEvent } from "../services/analytics";
import { nativeHaptics } from "@/lib/native/haptics";
import { shareContent } from "@/lib/native/share";
import { isNativeIOS } from "@/lib/native/platform";
import { BaziChartCard, HexagramCard } from "./DivinationChart";

interface DivinationViewProps {
  config: DivinationConfig;
  user: User;
  onUserUpdate?: (user: User) => void;
}

const emptyInput = (config: DivinationConfig): DivinationInput =>
  config.fields.reduce((acc, field) => {
    acc[field.name] =
      field.type === "select" ? field.options?.[0]?.value ?? "" : "";
    return acc;
  }, {} as DivinationInput);

const markdownComponents = {
  h1: (props: React.ComponentProps<"h3">) => (
    <h3 className="text-mystic-gold font-display font-bold text-xl md:text-2xl mt-6 mb-3" {...props} />
  ),
  h2: (props: React.ComponentProps<"h3">) => (
    <h3 className="text-mystic-gold font-display font-bold text-xl md:text-2xl mt-6 mb-3" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="text-mystic-gold font-display font-bold text-xl md:text-2xl mt-6 mb-3" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="text-white font-bold" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-4 leading-relaxed" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="mb-1 marker:text-mystic-gold" {...props} />
  ),
};

export const DivinationView: React.FC<DivinationViewProps> = ({
  config,
  user,
  onUserUpdate,
}) => {
  const [input, setInput] = useState<DivinationInput>(() => emptyInput(config));
  const [reading, setReading] = useState<DivinationReading | null>(null);
  const [history, setHistory] = useState<DivinationReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackEvent("view_divination", { type: config.type });
    setHistory(loadDivinationHistory(config.type));
  }, [config.type]);

  const canAfford = user.credits >= config.cost;
  const shareUrl = useMemo(
    () => `https://www.oniromancy.com/${config.slug}`,
    [config.slug]
  );

  const handleChange = (name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
    setErr(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validateDivinationInput(config.type, input);
    if (validationError) {
      setErr(validationError);
      return;
    }
    if (!canAfford) {
      setErr("Not enough credits for this reading.");
      return;
    }

    setLoading(true);
    setErr(null);
    nativeHaptics.action();

    try {
      const result = await performDivinationAction(
        config.type,
        input,
        new Date().getTimezoneOffset()
      );
      setReading(result);
      setHistory(saveDivinationToHistory(config.type, result));
      trackEvent("cast_divination", { type: config.type, cost: config.cost });
      if (onUserUpdate) {
        onUserUpdate({ ...user, credits: user.credits - config.cost });
      }
    } catch (error: unknown) {
      setErr(
        error instanceof Error ? error.message : "The oracle could not be reached."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!reading) return;
    const text = `${config.title} — Oniromancy\n\n${reading.content}`;
    if (isNativeIOS()) {
      await shareContent({ title: config.title, text, url: shareUrl });
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
      setCopied(true);
      trackEvent("share_copy_link", { type: config.type });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErr("Could not copy the reading.");
    }
  };

  const chart = reading?.chart as Record<string, unknown> | null | undefined;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 md:py-16">
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-slate-400">
          {config.origin}
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
          <span className="mr-3">{config.emoji}</span>
          <span className={clsx("text-transparent bg-clip-text bg-gradient-to-r", config.accent)}>
            {config.title}
          </span>
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {config.description}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-6 md:p-8 space-y-5"
      >
        {config.fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label
              htmlFor={`div-${field.name}`}
              className="text-sm font-medium text-slate-200"
            >
              {field.label}
              {field.required && <span className="text-rose-400 ml-1">*</span>}
            </label>

            {field.type === "textarea" ? (
              <textarea
                id={`div-${field.name}`}
                value={input[field.name] ?? ""}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.name, e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-mystic-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-mystic-gold/60"
              />
            ) : field.type === "select" ? (
              <select
                id={`div-${field.name}`}
                value={input[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full rounded-xl bg-mystic-900/60 border border-white/10 px-4 py-3 text-slate-100 focus:outline-none focus:border-mystic-gold/60"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-mystic-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`div-${field.name}`}
                type={
                  field.type === "datetime"
                    ? "datetime-local"
                    : field.type === "number"
                    ? "number"
                    : "text"
                }
                value={input[field.name] ?? ""}
                maxLength={field.maxLength}
                min={field.min}
                max={field.max}
                placeholder={field.placeholder}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full rounded-xl bg-mystic-900/60 border border-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-mystic-gold/60"
              />
            )}

            {field.help && (
              <p className="text-xs text-slate-500">{field.help}</p>
            )}
          </div>
        ))}

        {err && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
            {err}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <span className="flex items-center gap-2 text-sm text-slate-400">
            <Coins className="w-4 h-4 text-mystic-gold" />
            {config.cost} credits · you have {user.credits}
          </span>

          <button
            type="submit"
            disabled={loading || !canAfford}
            className={clsx(
              "w-full sm:w-auto px-8 py-3 rounded-full font-bold tracking-wide transition-all",
              loading || !canAfford
                ? "bg-white/10 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Consulting the oracle…
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4" /> Cast the reading
              </span>
            )}
          </button>
        </div>

        {!canAfford && (
          <p className="text-xs text-center text-slate-400">
            You need {config.cost - user.credits} more credits.{" "}
            <a href="/pricing" className="text-mystic-gold underline">
              Get more credits
            </a>
            .
          </p>
        )}
      </form>

      <AnimatePresence>
        {reading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-10 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-6 md:p-8"
          >
            {config.type === "I_CHING" && chart && <HexagramCard chart={chart} />}
            {(config.type === "BAZI" || config.type === "NAME_GENERATOR") && chart && (
              <BaziChartCard chart={chart} />
            )}

            <div className="prose prose-invert max-w-none text-slate-300">
              <Markdown components={markdownComponents}>{reading.content}</Markdown>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors text-sm"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                <span>{copied ? "Copied to clipboard" : "Share reading"}</span>
              </button>

              <button
                onClick={() => {
                  setReading(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New reading</span>
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {history.length > 0 && (
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400 mb-4">
            <HistoryIcon className="w-4 h-4" /> Recent readings
          </h2>
          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setReading(item);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="block text-xs text-slate-500 mb-1">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <span className="block text-sm text-slate-300 line-clamp-2">
                  {item.content.replace(/[#*`>]/g, " ").slice(0, 160)}…
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DivinationView;
