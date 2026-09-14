"use server";

import { GoogleGenAI, Type } from "@/services/ai";
import { DreamAnalysis, DreamResult, CREDIT_COSTS } from "../../types";
import { createClient } from "@/services/supabase/server";
import { supabaseAdmin } from "@/services/supabase/admin";

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

// Internal helper for AI analysis
async function runGeminiAnalysis(dreamText: string): Promise<DreamAnalysis> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      contents: `You are an ancient Oneiromancer and Jungian psychologist. 
      Analyze the following dream.
      
      Return a JSON object with:
      - title: A poetic, evocative title (max 5 words).
      - interpretation: A profound insight (approx 5-6 sentences). Connect the symbols to the dreamer's REAL LIFE situations and emotions. Avoid being overly abstract; ground the mystical in the practical.
      - oracleMessage: A cryptic, highly shareable, poetic one-liner about their destiny (e.g., "The stars whisper of a coming change...").
      - actionableAdvice: A specific, practical action they should take in the real world (e.g., "Call an old friend," "Clean your desk," "Take a 10-minute walk").
      - symbols: Array of 3 key archetypes/symbols found.
      - mood: The emotional atmosphere (e.g., "Ethereal," "Foreboding").
      - psycheScore: Integer 0-100 (intensity of the message).
      - luckyNumber: Integer 0-99.
      - element: One of 'Fire', 'Water', 'Air', 'Earth', 'Ether' that best fits the dream energy.
      
      Dream: "${dreamText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            interpretation: { type: Type.STRING },
            oracleMessage: { type: Type.STRING },
            actionableAdvice: { type: Type.STRING },
            symbols: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            mood: { type: Type.STRING },
            psycheScore: { type: Type.INTEGER },
            luckyNumber: { type: Type.INTEGER },
            element: {
              type: Type.STRING,
              enum: ["Fire", "Water", "Air", "Earth", "Ether"],
            },
          },
          required: [
            "title",
            "interpretation",
            "oracleMessage",
            "actionableAdvice",
            "symbols",
            "mood",
            "psycheScore",
            "luckyNumber",
            "element",
          ],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("The oracle remained silent (Invalid JSON).");
    return JSON.parse(jsonText) as DreamAnalysis;
}

// Internal helper for AI Image Prompt & Gen
async function runGeminiImage(dreamText: string, analysis: DreamAnalysis): Promise<string> {
    const ai = getAI();
    
    // Optimized: Skip separate prompt generation step to speed up response.
    // Construct a high-quality prompt directly from the analysis with dynamic style mapping.
    
    let styleModifier = "";
    switch (analysis.element) {
        case 'Fire': styleModifier = "warm lighting, dynamic energy, embers, gold and red tones, dramatic shadows, passion"; break;
        case 'Water': styleModifier = "fluid forms, underwater distortion, blue and teal palette, caustic lighting, flowing, deep emotion"; break;
        case 'Air': styleModifier = "ethereal, misty, pastel colors, soft focus, floating elements, dreamlike, intellect"; break;
        case 'Earth': styleModifier = "textured, organic, moss and stone, grounded, rich browns and greens, detailed nature, stability"; break;
        case 'Ether': styleModifier = "cosmic, starlight, nebulae, deep void, glowing geometric patterns, divine light, spirit"; break;
        default: styleModifier = "mystical, high contrast, cinematic lighting";
    }

    const refinedPrompt = `Surrealist Tarot Card art. Subject: "${dreamText}". ` +
      `Key Symbols: ${analysis.symbols.join(", ")}. ` +
      `Mood: ${analysis.mood}. ` +
      `Visual Style: ${styleModifier}. ` +
      `Quality: high contrast, mystical, grain, cinematic 8k resolution, oil painting texture, vertical composition, intricate details.`;

    const imageResponse = await ai.models.generateImages({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
      prompt: refinedPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "9:16",
      },
    });

    const base64ImageBytes =
      imageResponse.generatedImages?.[0]?.image?.imageBytes;

    if (!base64ImageBytes) {
      throw new Error("The vision could not be materialized.");
    }

    return `data:image/jpeg;base64,${base64ImageBytes}`;
}

/**
 * SECURE ACTION: Analyzes dream, deducts credits, saves to DB.
 */
export const analyzeDreamAction = async (dreamText: string): Promise<DreamResult> => {
    // 1. Validation
    if (!dreamText || dreamText.trim().length < 5) throw new Error("Dream text too short");
    if (dreamText.length > 5000) throw new Error("Dream text too long");

    // 2. Auth & Credit Check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        console.error("Action Unauthorized - getUser failed:", authError);
        throw new Error("Unauthorized: Please log in.");
    }

    // Fetch profile to check credits
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        throw new Error("Profile not found.");
    }

    const COST = CREDIT_COSTS.DREAM_ANALYSIS;
    if (profile.credits < COST) {
        throw new Error("Insufficient credits.");
    }

    // 3. Deduct Credits (Optimistic - we'll refund if AI fails)
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

        if (refreshError || !refreshed) {
            throw new Error("Profile not found.");
        }

        currentCredits = Number(refreshed.credits ?? 0);
        if (currentCredits < COST) {
            throw new Error("Insufficient credits.");
        }
    }

    if (!didDeduct) {
        throw new Error("Transaction failed.");
    }

    // Log transaction
    await supabaseAdmin.from('transactions').insert({
        user_id: user.id,
        type: 'SPEND_DREAM',
        credits_change: -COST,
        description: 'Dream Analysis'
    });

    try {
        // 4. Run Analysis
        const analysis = await runGeminiAnalysis(dreamText);
        
        // 5. Create Dream Record (without image initially)
        const dreamId = crypto.randomUUID();
        const timestamp = Date.now();
        
        const result: DreamResult = {
            id: dreamId,
            userId: user.id,
            analysis,
            imageUrl: '', 
            timestamp,
            dreamInput: dreamText,
        };

        // Save to DB using Admin to ensure write
        const { error: saveError } = await supabaseAdmin.from('dreams').insert({
            id: dreamId,
            user_id: user.id,
            analysis,
            image_url: '',
            timestamp,
            dream_input: dreamText,
        });
        
        if (saveError) throw saveError;

        return result;

    } catch (error) {
        // Refund credits if analysis fails
        console.error("Analysis failed, refunding credits...", error);
        let didRefund = false;
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

            if (!refundError && refunded) {
                didRefund = true;
                break;
            }
        }

        if (didRefund) {
            await supabaseAdmin.from('transactions').insert({
                user_id: user.id,
                type: 'REFUND',
                credits_change: COST,
                description: 'Refund: Analysis Failed'
            });
        }
        
        throw error;
    }
}

/**
 * SECURE ACTION: Generates image for an EXISTING dream.
 * Checks ownership. Does not charge extra (assuming cost covered in analysis).
 */
export const visualizeDreamAction = async (dreamId: string, dreamTextForPrompt: string): Promise<string> => {
    // 1. Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. Fetch Dream & Verify Owner
    const { data: dream, error: fetchError } = await supabaseAdmin
        .from('dreams')
        .select('*')
        .eq('id', dreamId)
        .single();
        
    if (fetchError || !dream) throw new Error("Dream not found.");
    if (dream.user_id !== user.id) throw new Error("Unauthorized access to this dream.");
    
    // Check if image already exists?
    if (dream.image_url && dream.image_url.length > 100) {
        return dream.image_url;
    }

    try {
        // 3. Generate Image
        const imageUrl = await runGeminiImage(dreamTextForPrompt, dream.analysis);
        
        // 4. Update DB
        await supabaseAdmin
            .from('dreams')
            .update({ image_url: imageUrl })
            .eq('id', dreamId);
            
        return imageUrl;
    } catch (error) {
        console.error("Image generation failed:", error);
        throw error;
    }
}
