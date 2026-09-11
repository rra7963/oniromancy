/**
 * Divination catalogue ported from chatgpt-tarot-divination.
 *
 * Every reading type here shares one server action, one generic view and one
 * history store; this file is the single client-safe description of them
 * (labels, fields, validation, cost). Prompts live server-side in
 * app/actions/divination.ts.
 */

import { CREDIT_COSTS } from "../types";

export type DivinationType =
  | "BAZI"
  | "NAME_ANALYSIS"
  | "NAME_GENERATOR"
  | "I_CHING"
  | "LOVE_MATCH";

export type DivinationFieldType =
  | "text"
  | "textarea"
  | "datetime"
  | "number"
  | "select";

export interface DivinationField {
  name: string;
  label: string;
  type: DivinationFieldType;
  placeholder?: string;
  help?: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
}

export interface DivinationConfig {
  type: DivinationType;
  /** URL segment, e.g. /bazi */
  slug: string;
  title: string;
  /** Short label used in navigation. */
  navLabel: string;
  tagline: string;
  description: string;
  origin: string;
  emoji: string;
  accent: string;
  cost: number;
  fields: DivinationField[];
  /** Bullet points shown on the public landing state. */
  highlights: string[];
  keywords: string[];
}

export const DIVINATIONS: DivinationConfig[] = [
  {
    type: "BAZI",
    slug: "bazi",
    title: "BaZi Four Pillars Reading",
    navLabel: "BaZi",
    tagline: "Your birth chart in Heavenly Stems and Earthly Branches",
    description:
      "Your exact birth moment is cast into the Four Pillars of Destiny — year, month, day and hour — then read for elemental balance, wealth, relationships, health and career.",
    origin: "Chinese astrology · 生辰八字",
    emoji: "🧭",
    accent: "from-amber-400 to-orange-500",
    cost: CREDIT_COSTS.BAZI,
    fields: [
      {
        name: "birthday",
        label: "Date & time of birth",
        type: "datetime",
        required: true,
        help: "The hour matters — it sets the fourth pillar. Use your local birth time.",
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: false,
        options: [
          { value: "", label: "Prefer not to say" },
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
        ],
      },
      {
        name: "focus",
        label: "What should the reading focus on? (optional)",
        type: "text",
        maxLength: 80,
        placeholder: "Career change, marriage, health…",
      },
    ],
    highlights: [
      "Four Pillars cast from your exact birth moment",
      "Five-element balance and your Day Master",
      "Guidance for wealth, love, health and career",
    ],
    keywords: [
      "BaZi",
      "Four Pillars of Destiny",
      "Chinese astrology",
      "birth chart reading",
      "生辰八字",
      "Day Master",
    ],
  },
  {
    type: "NAME_ANALYSIS",
    slug: "name-analysis",
    title: "Name Numerology Reading",
    navLabel: "Name Reading",
    tagline: "What your name says about your character and fate",
    description:
      "The Five Grids school of Chinese name numerology reads a name as a structure of numbers — heaven, personality, earth, external and total — each shaping temperament, fortune and relationships.",
    origin: "Chinese name numerology · 姓名五格",
    emoji: "🔡",
    accent: "from-emerald-400 to-teal-500",
    cost: CREDIT_COSTS.NAME_ANALYSIS,
    fields: [
      {
        name: "name",
        label: "Your name",
        type: "text",
        required: true,
        maxLength: 40,
        placeholder: "Chinese characters or a Latin name both work",
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: [
          { value: "", label: "Prefer not to say" },
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
        ],
      },
    ],
    highlights: [
      "Five Grids breakdown of your name",
      "Character, fortune and relationship tendencies",
      "Practical advice for using your name well",
    ],
    keywords: [
      "name numerology",
      "Chinese name analysis",
      "five grids",
      "姓名五格",
      "name meaning",
    ],
  },
  {
    type: "NAME_GENERATOR",
    slug: "name-generator",
    title: "Auspicious Name Generator",
    navLabel: "Name Generator",
    tagline: "Names chosen to balance your birth chart",
    description:
      "Traditional naming casts the Four Pillars first, finds which of the five elements the chart lacks, and only then chooses characters that restore the balance.",
    origin: "Chinese naming · 起名取名",
    emoji: "✒️",
    accent: "from-sky-400 to-indigo-500",
    cost: CREDIT_COSTS.NAME_GENERATOR,
    fields: [
      {
        name: "surname",
        label: "Surname",
        type: "text",
        required: true,
        maxLength: 20,
        placeholder: "李 / Li",
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
          { value: "neutral", label: "Gender neutral" },
        ],
      },
      {
        name: "birthday",
        label: "Date & time of birth",
        type: "datetime",
        required: true,
        help: "Used to cast the chart the name has to balance.",
      },
      {
        name: "wishes",
        label: "Any wishes for the name? (optional)",
        type: "text",
        maxLength: 60,
        placeholder: "Soft sounding, one character, evokes water…",
      },
    ],
    highlights: [
      "Chart cast before a single name is suggested",
      "Names picked for the elements your chart lacks",
      "Meaning, pronunciation and tone for each suggestion",
    ],
    keywords: [
      "Chinese name generator",
      "baby name",
      "auspicious name",
      "起名",
      "五行取名",
    ],
  },
  {
    type: "I_CHING",
    slug: "i-ching",
    title: "I Ching Plum Blossom Oracle",
    navLabel: "I Ching",
    tagline: "Two numbers, one hexagram, one answer",
    description:
      "Plum Blossom Numerology turns any two numbers into a hexagram: the first becomes the upper trigram, the second the lower, and their sum marks the line that is changing.",
    origin: "I Ching · 梅花易数",
    emoji: "☯️",
    accent: "from-violet-400 to-fuchsia-500",
    cost: CREDIT_COSTS.I_CHING,
    fields: [
      {
        name: "question",
        label: "Your question",
        type: "textarea",
        required: true,
        maxLength: 200,
        placeholder: "Should I take the offer I received this week?",
      },
      {
        name: "num1",
        label: "First number (upper trigram)",
        type: "number",
        required: true,
        min: 1,
        max: 9999,
      },
      {
        name: "num2",
        label: "Second number (lower trigram)",
        type: "number",
        required: true,
        min: 1,
        max: 9999,
      },
    ],
    highlights: [
      "Hexagram cast deterministically, not improvised",
      "Primary and relating hexagram with the moving line",
      "A clear yes / no / not yet, plus what to do about it",
    ],
    keywords: [
      "I Ching",
      "hexagram reading",
      "Plum Blossom Numerology",
      "梅花易数",
      "Book of Changes",
    ],
  },
  {
    type: "LOVE_MATCH",
    slug: "love-match",
    title: "Love Compatibility Oracle",
    navLabel: "Love Match",
    tagline: "How much fate is there between two names?",
    description:
      "A light-hearted compatibility reading: give two names and the oracle scores the connection, names its strengths and warns about the friction.",
    origin: "For entertainment · 姻缘占卜",
    emoji: "💞",
    accent: "from-rose-400 to-pink-500",
    cost: CREDIT_COSTS.LOVE_MATCH,
    fields: [
      {
        name: "name1",
        label: "First name",
        type: "text",
        required: true,
        maxLength: 40,
      },
      {
        name: "name2",
        label: "Second name",
        type: "text",
        required: true,
        maxLength: 40,
      },
      {
        name: "context",
        label: "Anything the oracle should know? (optional)",
        type: "text",
        maxLength: 80,
        placeholder: "We met at work last spring…",
      },
    ],
    highlights: [
      "A compatibility score with reasons behind it",
      "Where the two of you flow and where you clash",
      "One concrete thing to try this week",
    ],
    keywords: [
      "love compatibility",
      "name compatibility test",
      "soulmate reading",
      "姻缘",
      "relationship oracle",
    ],
  },
];

export const DIVINATION_BY_TYPE: Record<DivinationType, DivinationConfig> =
  DIVINATIONS.reduce((acc, cfg) => {
    acc[cfg.type] = cfg;
    return acc;
  }, {} as Record<DivinationType, DivinationConfig>);

export const getDivinationBySlug = (slug: string) =>
  DIVINATIONS.find((d) => d.slug === slug);

export type DivinationInput = Record<string, string>;

/** Shared validation, run on both the client and the server action. */
export function validateDivinationInput(
  type: DivinationType,
  input: DivinationInput
): string | null {
  const config = DIVINATION_BY_TYPE[type];
  if (!config) return "Unknown reading type.";

  for (const field of config.fields) {
    const raw = (input[field.name] ?? "").trim();
    if (!raw) {
      if (field.required) return `${field.label} is required.`;
      continue;
    }
    if (field.maxLength && raw.length > field.maxLength) {
      return `${field.label} must be ${field.maxLength} characters or fewer.`;
    }
    if (field.type === "number") {
      const n = Number(raw);
      if (!Number.isFinite(n)) return `${field.label} must be a number.`;
      if (field.min !== undefined && n < field.min)
        return `${field.label} must be at least ${field.min}.`;
      if (field.max !== undefined && n > field.max)
        return `${field.label} must be at most ${field.max}.`;
    }
    if (field.type === "datetime") {
      if (!/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
        return `${field.label} must include both a date and a time.`;
      }
    }
  }
  return null;
}
