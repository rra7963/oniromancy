"use server";

import { GoogleGenAI } from "@google/genai";
import { TarotDraw, CREDIT_COSTS, TarotCardPick } from "../../types";
import { createClient } from "../../services/supabase/server";
import { supabaseAdmin } from "../../services/supabase/admin";
import { uuid, todayKey } from "../../utils";
import { TAROT_PERSONAS, DEFAULT_PERSONA } from "../../lib/tarot-personas";

const MAJOR_ARCANA = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
];

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please add it to your .env.local file.");
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

// Internal helper to draw cards
function drawCards(count: number): TarotCardPick[] {
  const pool = [...MAJOR_ARCANA];
  const drawn: TarotCardPick[] = [];
  
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break;
    const idx = Math.floor(Math.random() * pool.length);
    const name = pool.splice(idx, 1)[0];
    drawn.push({
      name,
      upright: Math.random() < 0.7 // 70% chance of upright
    });
  }
  return drawn;
}

export const performTarotDrawAction = async (
  spreadType: 'SINGLE' | 'THREE',
  question?: string,
  personaId?: string
): Promise<TarotDraw> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Action Unauthorized - getUser failed:", authError);
    throw new Error("Unauthorized");
  }

  // 1. Fetch Profile (Credits)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) throw new Error("Profile not found");

  // 2. Check Credits
  const COST = spreadType === 'THREE' ? CREDIT_COSTS.TAROT_SPREAD_3 : CREDIT_COSTS.TAROT_READING;
  if (profile.credits < COST) throw new Error("Insufficient credits");

  // 3. Deduct Credits
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
    type: 'SPEND_TAROT',
    credits_change: -COST,
    description: spreadType === 'THREE' ? "3-Card Tarot Reading" : "Single Card Tarot Reading"
  });

  try {
    // 4. Draw Cards
    let cards: TarotCardPick[] = [];
    let prompt = "";
    const trimmedQuestion = question?.trim();
    const userQuestion = trimmedQuestion
      ? `User Question: "${trimmedQuestion}"`
      : "User Question: General Guidance";

    // 5. Select Persona
    const persona = TAROT_PERSONAS.find(p => p.id === personaId) || DEFAULT_PERSONA;
    const personaPrompt = persona.systemPrompt;

    if (spreadType === 'THREE') {
      cards = drawCards(3);
      // Add position info implicitly by order 0, 1, 2
      const cardsDesc = [
        `- Past: ${cards[0].name} (${cards[0].upright ? "Upright" : "Reversed"})`,
        `- Present: ${cards[1].name} (${cards[1].upright ? "Upright" : "Reversed"})`,
        `- Future: ${cards[2].name} (${cards[2].upright ? "Upright" : "Reversed"})`
      ].join("\n");

      prompt = `${personaPrompt}

Spread: Past / Present / Future.
Cards:
${cardsDesc}

${userQuestion}

Provide the reading in Markdown using this structure:

### Overview
(5-6 sentences directly answering the question)

### Card Meanings
(Explain each position in plain language; mention upright/reversed implications)

### The Advice
(3-6 practical, everyday steps the user can actually do; include what to do + why it helps)

### Final Guidance
(A concise takeaway + one reflective question + one small next action for today)`;
    } else {
      cards = drawCards(1);
      const card = cards[0];
      const pose = card.upright ? "upright" : "reversed";
      
      prompt = `${personaPrompt}

Card: ${card.name} (${pose}).
${userQuestion}

Provide the reading in Markdown using this structure:

### Overview
(3-4 sentences that answer the question)

### The Meaning
(Explain upright vs reversed meaning in plain language, and how it relates to the question)

### The Advice
(3-5 practical actions the user can do within 24 hours; be specific)

### Final Guidance
(A short takeaway + one thing to avoid + one small next step)`;
    }

    // 6. Generate Interpretation
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    
    const interpretation = response.text || "The cards are silent.";

    // 7. Save to DB
    const draw: TarotDraw = {
      id: uuid(),
      userId: user.id,
      date: todayKey(),
      spreadType,
      cards,
      interpretation,
      timestamp: Date.now(),
      question,
      personaId
    };

    const { error: saveError } = await supabaseAdmin.from('tarot_draws').insert({
      id: draw.id,
      user_id: draw.userId,
      date: draw.date,
      spread_type: draw.spreadType,
      cards: draw.cards,
      interpretation: draw.interpretation,
      created_at: new Date().toISOString(),
      question: draw.question,
      persona_id: draw.personaId
    });
    
    if (saveError) {
        console.error("Failed to save tarot draw:", saveError);
        // We don't throw here to avoid refunding after successful generation, 
        // returning the result is better for UX, even if history save failed.
        // But better to throw to ensure consistency? 
        // Let's log and return.
    }

    return draw;

  } catch (error: unknown) {
    console.error("Gemini API Error (performTarotDraw):", error);
    // Refund credits
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
      throw new Error("The cards are silent (Network Error). Please check your connection or VPN.");
    }
    throw error;
  }
};
