"use server";

import { GoogleGenAI } from "@/services/ai";
import { DivinationReading } from "../../types";
import { createClient } from "../../services/supabase/server";
import { supabaseAdmin } from "../../services/supabase/admin";
import { uuid, todayKey } from "../../utils";
import {
  DIVINATION_BY_TYPE,
  DivinationInput,
  DivinationType,
  validateDivinationInput,
} from "../../lib/divination";
import { castBaziChart, parseBirthMoment } from "../../lib/bazi";
import { castHexagram } from "../../lib/iching";

const getAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Please add it to your .env.local file.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        Referer: process.env.NEXT_PUBLIC_SITE_URL || "https://www.oniromancy.com",
      },
    },
  });
};

const HOUSE_STYLE = `You are an oracle of Oniromancy, an AI divination house.
Write in English, in a warm, grounded, mystical voice. Never invent facts about
the person beyond what is given. Keep every reading practical: the reader should
finish knowing what to actually do next. Output GitHub-flavoured Markdown using
### headings, and never mention that you are an AI model or that this is a prompt.
Close every reading with a one-line reminder that divination is for reflection
and entertainment, not medical, legal or financial advice.`;

interface BuiltPrompt {
  prompt: string;
  chart: Record<string, unknown> | null;
  /** Short label used in the credit transaction + history list. */
  label: string;
}

function buildPrompt(type: DivinationType, input: DivinationInput, tzOffset: number): BuiltPrompt {
  const value = (k: string) => (input[k] ?? "").trim();

  switch (type) {
    case "BAZI": {
      const moment = parseBirthMoment(value("birthday"), tzOffset);
      if (!moment) throw new Error("Please give a valid date and time of birth.");
      const chart = castBaziChart(moment);
      const gender = value("gender");
      const focus = value("focus");
      return {
        chart: chart as unknown as Record<string, unknown>,
        label: "BaZi Four Pillars Reading",
        prompt: `${HOUSE_STYLE}

You are a traditional Chinese BaZi (Four Pillars of Destiny) master.
The chart has ALREADY been cast for you — use it exactly as given and do not
re-calculate or second-guess the pillars.

Birth moment: ${value("birthday")} (local time)
${gender ? `Gender: ${gender}` : ""}
Chart: ${chart.summary}

Write the reading with these sections:

### The Chart
(Name the four pillars and the Day Master, and say plainly what kind of energy this chart carries.)

### Elemental Balance
(Which elements are strong, which are missing, and what that means day to day.)

### Wealth & Career
### Relationships
### Health & Energy
(3-5 sentences each, specific rather than generic.)

### Favourable & Unfavourable
(Elements, colours, directions and seasons that help or hinder this chart.)

### What To Do Next
(4-6 concrete, doable steps.${focus ? ` The reader specifically asked about: "${focus}" — address it directly here.` : ""})`,
      };
    }

    case "NAME_ANALYSIS": {
      const name = value("name");
      const gender = value("gender");
      return {
        chart: null,
        label: "Name Numerology Reading",
        prompt: `${HOUSE_STYLE}

You are a master of Chinese name numerology (姓名五格, the Five Grids school).

Name: ${name}
${gender ? `Gender: ${gender}` : ""}

Write the reading with these sections:

### The Name
(Its literal meaning, sound and character — for a non-Chinese name, work from its roots, letters and numerology instead, and say so.)

### The Five Grids
(Heaven, Personality, Earth, External and Total grid: give each a number where you can compute it, and explain what it governs for this person.)

### Character
### Fortune & Career
### Relationships
(3-4 sentences each.)

### Living Well With This Name
(4-5 practical suggestions — how to introduce yourself, which nicknames or signatures suit you, what to lean into.)`,
      };
    }

    case "NAME_GENERATOR": {
      const moment = parseBirthMoment(value("birthday"), tzOffset);
      if (!moment) throw new Error("Please give a valid date and time of birth.");
      const chart = castBaziChart(moment);
      const wishes = value("wishes");
      return {
        chart: chart as unknown as Record<string, unknown>,
        label: "Auspicious Name Suggestions",
        prompt: `${HOUSE_STYLE}

You are a traditional Chinese naming master. The birth chart has ALREADY been
cast — use it as given, do not re-calculate it.

Surname: ${value("surname")}
Gender: ${value("gender")}
Birth moment: ${value("birthday")} (local time)
Chart: ${chart.summary}
${wishes ? `The family's wishes: "${wishes}"` : ""}

Write with these sections:

### What The Chart Needs
(Which elements are lacking or excessive, and therefore what the name must supply.)

### Six Names
(Six suggestions, surname first. For each give: the full name in Chinese characters
with pinyin and tones, a literal meaning, the element it supplies, and one line on
the kind of person it suits. Present them as a Markdown list, not a table.)

### Two Names In Latin Script
(Two options that work internationally and echo the same elemental intent.)

### How To Choose
(3-4 sentences on how to pick between them, including how the name should sound said aloud.)`,
      };
    }

    case "I_CHING": {
      const n1 = Number(value("num1"));
      const n2 = Number(value("num2"));
      if (!Number.isFinite(n1) || !Number.isFinite(n2)) {
        throw new Error("Both numbers are required.");
      }
      const cast = castHexagram(n1, n2);
      return {
        chart: cast as unknown as Record<string, unknown>,
        label: "I Ching Reading",
        prompt: `${HOUSE_STYLE}

You are a master of the I Ching in the Plum Blossom Numerology tradition.
The hexagram has ALREADY been cast from the querent's two numbers — read it
exactly as given, do not cast a different one.

Question: "${value("question")}"
Numbers chosen: ${n1} and ${n2}
Cast: ${cast.summary}

Write with these sections:

### The Cast
(Name the trigrams and what their images — ${cast.upper.image} over ${cast.lower.image} — say about the situation.)

### Hexagram ${cast.number}: ${cast.name} (${cast.chinese})
(The classical judgement and image, in plain modern language, tied to the question.)

### The Moving Line
(What line ${cast.movingLine} is pointing at, and what it warns or promises.)

### Where It Is Heading
(What the relating hexagram ${cast.relating.number} ${cast.relating.name} says about the outcome.)

### The Answer
(Answer the question directly — yes, no, or not yet — then 3-5 practical steps.)`,
      };
    }

    case "LOVE_MATCH": {
      const context = value("context");
      return {
        chart: null,
        label: "Love Compatibility Reading",
        prompt: `${HOUSE_STYLE}

You are a playful compatibility oracle. This reading is entertainment — say so
lightly, and never claim certainty about real people.

First name: ${value("name1")}
Second name: ${value("name2")}
${context ? `Context: "${context}"` : ""}

Rules: if either entry is obviously a placeholder (John Doe, test, asdf) or the
two names are identical, say kindly that the oracle cannot read this pairing and
stop. Otherwise be generous — most pairings deserve an encouraging reading — but
stay honest about friction.

Write with these sections:

### The Verdict
(A compatibility score out of 100 on its own line, then 2-3 sentences on what the pairing feels like.)

### What Flows
### What Grates
(3-4 sentences each.)

### The Weather Ahead
(What the next few months tend to bring for a pairing like this.)

### One Thing To Try This Week
(A single small, specific, doable suggestion.)`,
      };
    }

    default:
      throw new Error("Unknown reading type.");
  }
}

export const performDivinationAction = async (
  type: DivinationType,
  input: DivinationInput,
  timezoneOffsetMinutes: number = 0
): Promise<DivinationReading> => {
  const config = DIVINATION_BY_TYPE[type];
  if (!config) throw new Error("Unknown reading type.");

  const validationError = validateDivinationInput(type, input);
  if (validationError) throw new Error(validationError);

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Action Unauthorized - getUser failed:", authError);
    throw new Error("Unauthorized: Please sign in again.");
  }

  // 1. Fetch profile (credits)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) throw new Error("Profile not found");

  // 2. Check credits
  const COST = config.cost;
  if (profile.credits < COST) throw new Error("Insufficient credits");

  // Build the prompt before spending anything so bad input never costs credits.
  const built = buildPrompt(type, input, timezoneOffsetMinutes);

  // 3. Deduct credits (optimistic concurrency, same pattern as tarot/horoscope)
  let currentCredits = Number(profile.credits ?? 0);
  let didDeduct = false;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { data: updated, error: deductError } = await supabaseAdmin
      .from("profiles")
      .update({ credits: currentCredits - COST })
      .eq("id", user.id)
      .eq("credits", currentCredits)
      .select("credits")
      .maybeSingle();

    if (!deductError && updated) {
      didDeduct = true;
      break;
    }

    const { data: refreshed, error: refreshError } = await supabaseAdmin
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (refreshError || !refreshed) throw new Error("Profile not found");
    currentCredits = Number(refreshed.credits ?? 0);
    if (currentCredits < COST) throw new Error("Insufficient credits");
  }

  if (!didDeduct) throw new Error("Transaction failed");

  await supabaseAdmin.from("transactions").insert({
    user_id: user.id,
    type: "SPEND_DIVINATION",
    credits_change: -COST,
    description: built.label,
  });

  try {
    // 4. Generate the interpretation
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      contents: built.prompt,
    });

    const content = response.text;
    if (!content) throw new Error("The oracle is silent. Please try again.");

    const reading: DivinationReading = {
      id: uuid(),
      userId: user.id,
      type,
      input,
      chart: built.chart,
      content,
      date: todayKey(),
      timestamp: Date.now(),
    };

    // 5. Persist (best effort — a history failure must not cost the reading)
    const { error: saveError } = await supabaseAdmin.from("divinations").insert({
      id: reading.id,
      user_id: reading.userId,
      type: reading.type,
      input: reading.input,
      chart: reading.chart,
      content: reading.content,
      date: reading.date,
      created_at: new Date().toISOString(),
    });

    if (saveError) {
      console.error("Failed to save divination reading:", saveError);
    }

    return reading;
  } catch (error: unknown) {
    console.error("AI API Error (performDivination):", error);
    // Refund
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data: currentProfile } = await supabaseAdmin
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

      if (!currentProfile) break;
      const refundFrom = Number(currentProfile.credits ?? 0);
      const { data: refunded, error: refundError } = await supabaseAdmin
        .from("profiles")
        .update({ credits: refundFrom + COST })
        .eq("id", user.id)
        .eq("credits", refundFrom)
        .select("credits")
        .maybeSingle();

      if (!refundError && refunded) break;
    }

    if (
      error instanceof Error &&
      (error.message.includes("fetch failed") || error.message.includes("Failed to fetch"))
    ) {
      throw new Error("The oracle is unreachable (Network Error). Please check your connection.");
    }
    throw error;
  }
};

/** Recent readings for the signed-in user, newest first. */
export const listDivinationsAction = async (
  limit: number = 20,
  type?: DivinationType
): Promise<DivinationReading[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabaseAdmin
    .from("divinations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error || !data) {
    if (error) console.error("Failed to load divination history:", error);
    return [];
  }

  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    userId: String(row.user_id),
    type: String(row.type),
    input: (row.input ?? {}) as Record<string, string>,
    chart: (row.chart ?? null) as Record<string, unknown> | null,
    content: String(row.content ?? ""),
    date: String(row.date ?? ""),
    timestamp: row.created_at ? new Date(String(row.created_at)).getTime() : 0,
  }));
};
