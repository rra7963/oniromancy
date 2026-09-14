"use server";

import { GoogleGenAI, Type } from "@/services/ai";
import { DailyFortune, CREDIT_COSTS } from "../../types";
import { createClient } from "../../services/supabase/server";
import { supabaseAdmin } from "../../services/supabase/admin";
import { uuid, todayKey } from "../../utils";

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
      }
    }
  });
};

export const generateDailyFortuneAction = async (isRecast: boolean = false): Promise<DailyFortune> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Action Unauthorized - getUser failed:", authError);
    throw new Error("Unauthorized: Please sign in again.");
  }

  // 1. Fetch Profile (Credits + Zodiac)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) throw new Error("Profile not found");

  // 2. Check Credits
  const COST = CREDIT_COSTS.HOROSCOPE;
  if (profile.credits < COST) throw new Error("Insufficient credits");

  // 3. Fetch Recent Dreams (for context)
  const { data: dreams } = await supabaseAdmin
    .from('dreams')
    .select('analysis')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })
    .limit(3);

  // 4. Deduct Credits
  let currentCredits = Number(profile.credits ?? 0);
  let didDeduct = false;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { data: updated, error: deductError } = await supabaseAdmin
      .from('profiles')
      .update({ credits: currentCredits - COST })
      .eq('id', user.id)
      .eq('credits', currentCredits)
      .select('credits')
      .maybeSingle();

    if (!deductError && updated) {
      didDeduct = true;
      break;
    }

    const { data: refreshed, error: refreshError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (refreshError || !refreshed) throw new Error("Profile not found");
    currentCredits = Number(refreshed.credits ?? 0);
    if (currentCredits < COST) throw new Error("Insufficient credits");
  }

  if (!didDeduct) throw new Error("Transaction failed");

  await supabaseAdmin.from('transactions').insert({
    user_id: user.id,
    type: 'SPEND_HOROSCOPE',
    credits_change: -COST,
    description: isRecast ? 'Recast Daily Horoscope' : 'Daily Horoscope'
  });

  try {
    // 5. Run AI
    const ai = getAI();
    const dreamHints = (dreams as { analysis: { mood: string; symbols: string[] } }[])
      ?.map((d) => `${d.analysis.mood}; ${d.analysis.symbols.join(" ")}`)
      .join(" | ");
      
    let contents = `You are a celestial navigator and fortune teller. Create a daily fortune.
      Zodiac: ${profile.zodiac || "Unknown"}
      Dream hints: ${dreamHints || "None"}
      
      Return JSON with fields: 
      - oracleMessage: A profound, mystical, and poetic message about today's energy (max 2 sentences). Use metaphorical language.
      - luckyColor: A specific, evocative color name followed by its hex code in parentheses (e.g., "Midnight Blue (#191970)", "Pale Gold (#E6BE8A)").
      - luckyNumber: Integer 0-99.
      - dimensions: An object containing { love, career, health, creativity, social }.
        Also include:
        - luckyTime: A specific time range for peak luck (e.g. "14:00 - 16:00").
        - compatibleZodiac: The zodiac sign most compatible with them today (e.g. "Leo").
        
        Each of the 5 main dimensions (love, career, etc.) must have:
        - score: Integer 0-100.
        - summary: A detailed, insightful analysis of this aspect for today (approx 25-40 words). Be specific.
        - advice: A small, performable ritual or practical tip (e.g., "Wear something silver," "Avoid crowded places").`;

    if (isRecast) {
        contents += `\n\nIMPORTANT: This is a RECAST. The user is seeking a better fate.
        You MUST provide a significantly MORE POSITIVE, LUCKY, and OPTIMISTIC reading than usual.
        Boost the scores (mostly > 80).
        The Oracle Message should reflect turning tides, second chances, or defying fate.`;
    }
        
    const response = await ai.models.generateContent({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            oracleMessage: { type: Type.STRING },
            luckyColor: { type: Type.STRING },
            luckyNumber: { type: Type.INTEGER },
            dimensions: {
              type: Type.OBJECT,
              properties: {
                love: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, summary: { type: Type.STRING }, advice: { type: Type.STRING } }, required: ["score","summary","advice"] },
                career: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, summary: { type: Type.STRING }, advice: { type: Type.STRING } }, required: ["score","summary","advice"] },
                health: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, summary: { type: Type.STRING }, advice: { type: Type.STRING } }, required: ["score","summary","advice"] },
                creativity: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, summary: { type: Type.STRING }, advice: { type: Type.STRING } }, required: ["score","summary","advice"] },
                social: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, summary: { type: Type.STRING }, advice: { type: Type.STRING } }, required: ["score","summary","advice"] },
                luckyTime: { type: Type.STRING },
                compatibleZodiac: { type: Type.STRING }
              },
              required: ["love","career","health","creativity","social", "luckyTime", "compatibleZodiac"],
            },
          },
          required: ["oracleMessage","luckyColor","luckyNumber","dimensions"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Invalid fortune JSON");
    const parsed = JSON.parse(text);

    const date = todayKey();
    
    const { data: existing } = await supabaseAdmin
        .from('daily_fortunes')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', date)
        .single();
        
    const idToUse = existing?.id || uuid();

    const fortune: DailyFortune = {
      id: idToUse,
      userId: user.id,
      date,
      zodiac: profile.zodiac,
      oracleMessage: parsed.oracleMessage,
      luckyColor: parsed.luckyColor,
      luckyNumber: parsed.luckyNumber,
      dimensions: parsed.dimensions,
    };

    // Save to DB
    const dbRow = {
      id: fortune.id,
      user_id: fortune.userId,
      date: fortune.date,
      zodiac: fortune.zodiac,
      oracle_message: fortune.oracleMessage,
      lucky_color: fortune.luckyColor,
      lucky_number: fortune.luckyNumber,
      dimensions: fortune.dimensions,
    };

    const { error: saveError } = await supabaseAdmin
        .from('daily_fortunes')
        .upsert(dbRow); 
        
    if (saveError) throw saveError;

    return fortune;

  } catch (error: unknown) {
    console.error("AI API Error (generateDailyFortune):", error);
    // Refund
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data: currentProfile } = await supabaseAdmin
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (!currentProfile) break;
      const refundFrom = Number(currentProfile.credits ?? 0);
      const refundTo = refundFrom + COST;
      const { data: refunded, error: refundError } = await supabaseAdmin
        .from('profiles')
        .update({ credits: refundTo })
        .eq('id', user.id)
        .eq('credits', refundFrom)
        .select('credits')
        .maybeSingle();

      if (!refundError && refunded) break;
    }
    
    if (error instanceof Error && (error.message.includes("fetch failed") || error.message.includes("Failed to fetch"))) {
      throw new Error("The stars are clouded (Network Error). Please check your connection or VPN.");
    }
    throw error;
  }
};
