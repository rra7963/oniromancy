
export interface DreamAnalysis {
  title: string;
  interpretation: string; // Deep psychological analysis
  oracleMessage: string; // Short, cryptic, poetic quote (viral hook)
  actionableAdvice: string; // Practical step for the user
  symbols: string[];
  mood: string;
  psycheScore: number; // 0-100 (Lucidity/Intensity)
  luckyNumber: number;
  element: 'Fire' | 'Water' | 'Air' | 'Earth' | 'Ether'; // New: Elemental association
}

export interface DreamResult {
  id: string;
  userId: string;
  analysis: DreamAnalysis;
  imageUrl: string;
  timestamp: number;
  dreamInput?: string; // The original user input
}

export enum LoadingStage {
  IDLE = 'IDLE',
  INTERPRETING = 'INTERPRETING', // Text analysis
  VISUALIZING = 'VISUALIZING', // Prompt engineering
  PAINTING = 'PAINTING', // Image generation
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export enum SubscriptionTier {
  NOVICE = 'NOVICE',
  PRO = 'PRO',
}

export const CREDIT_COSTS = {
  DREAM_ANALYSIS: 5,
  TAROT_READING: 2,
  TAROT_SPREAD_3: 5,
  HOROSCOPE: 1,
  IMAGE_GENERATION: 5, // Included in Dream Analysis usually, but could be separate
  // Ported divination types (chatgpt-tarot-divination)
  BAZI: 4,
  NAME_ANALYSIS: 2,
  NAME_GENERATOR: 4,
  I_CHING: 2,
  LOVE_MATCH: 1,
} as const;

export const REFERRAL_BONUS = 20;
export const DAILY_LOGIN_BONUS = 5;
export const MONTHLY_PRO_CREDITS = 500;

export interface Referral {
  id: string;
  inviterId: string;
  inviteeId: string;
  createdAt: string;
  status: string;
}

export interface DailyFortuneDimension {
  score: number;
  summary: string;
  advice: string;
}

export interface DailyFortune {
  id: string;
  userId: string;
  date: string;
  zodiac?: string;
  oracleMessage: string;
  luckyColor: string;
  luckyNumber: number;
  dimensions: {
    love: DailyFortuneDimension;
    career: DailyFortuneDimension;
    health: DailyFortuneDimension;
    creativity: DailyFortuneDimension;
    social: DailyFortuneDimension;
    // New engagement fields (stored in JSONB)
    luckyTime?: string; 
    compatibleZodiac?: string;
  };
}

export interface TarotCardPick {
  name: string;
  upright: boolean;
}

export interface TarotDraw {
  id: string;
  userId: string;
  date: string;
  timestamp?: number;
  spreadType: 'SINGLE' | 'THREE';
  cards: TarotCardPick[];
  interpretation: string;
  question?: string;
  personaId?: string;
} 

export interface User {
  id: string;
  email: string;
  name: string;
  tier: SubscriptionTier;
  credits: number;
  subscriptionEndDate?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  zodiac?: string;
  timezone?: string;
  notificationOptIn?: boolean;
}

export interface DivinationReading {
  id: string;
  userId: string;
  /** One of the DivinationType values in lib/divination.ts */
  type: string;
  /** The raw form values the reading was cast from. */
  input: Record<string, string>;
  /** Deterministic chart data (pillars, hexagram, …) when the type has one. */
  chart?: Record<string, unknown> | null;
  /** Markdown interpretation. */
  content: string;
  date: string;
  timestamp: number;
}

export type TransactionType = 'PURCHASE' | 'SUBSCRIPTION' | 'SUBSCRIPTION_RENEWAL' | 'BONUS' | 'SPEND_DREAM' | 'SPEND_TAROT' | 'SPEND_HOROSCOPE' | 'SPEND_DIVINATION' | 'REFUND' | 'REFERRAL_REWARD' | 'OTHER';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount?: number; // Real currency amount if applicable (e.g. 9.99)
  currency?: string; // e.g. 'USD'
  creditsChange: number; // Positive for gain, negative for spend
  description: string;
  createdAt: string; // ISO date string
}
