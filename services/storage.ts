import { requireSupabase } from "./supabase/client";
import { DreamResult, User, SubscriptionTier, DailyFortune, TarotDraw, DAILY_LOGIN_BONUS, Transaction, TransactionType } from "../types";

interface ProfileRow {
  id: string;
  email: string;
  name: string | null;
  tier: SubscriptionTier;
  credits: number;
  birth_date?: string | null;
  birth_time?: string | null;
  birth_place?: string | null;
  zodiac?: string | null;
  timezone?: string | null;
  notification_opt_in?: boolean | null;
  last_bonus_date?: string | null; // YYYY-MM-DD
  subscription_end_date?: string | null;
}

interface TransactionRow {
  id: string;
  user_id: string;
  type: string;
  amount?: number;
  currency?: string;
  credits_change: number;
  description: string;
  created_at: string;
}

interface DreamRow {
  id: string;
  user_id: string;
  analysis: DreamResult['analysis'];
  image_url: string;
  timestamp: number;
  dream_input?: string;
}

const mapProfileToUser = (profile: ProfileRow): User => ({
  id: profile.id,
  email: profile.email,
  name: profile.name ?? profile.email.split('@')[0],
  tier: profile.tier,
  credits: profile.credits,
  subscriptionEndDate: profile.subscription_end_date ?? undefined,
  birthDate: profile.birth_date ?? undefined,
  birthTime: profile.birth_time ?? undefined,
  birthPlace: profile.birth_place ?? undefined,
  zodiac: profile.zodiac ?? undefined,
  timezone: profile.timezone ?? undefined,
  notificationOptIn: profile.notification_opt_in ?? undefined,
});

const mapDreamRow = (row: DreamRow): DreamResult => ({
  id: row.id,
  userId: row.user_id,
  analysis: row.analysis,
  imageUrl: row.image_url,
  timestamp: row.timestamp,
  dreamInput: row.dream_input,
});

const fetchProfile = async (userId: string): Promise<ProfileRow | null> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error("Error fetching profile:", error);
    throw error;
  }

  return data ?? null;
};

export const ensureProfile = async (userId: string, email: string, name?: string): Promise<ProfileRow> => {
  const existing = await fetchProfile(userId);
  if (existing) return existing;

  const defaults: ProfileRow = {
    id: userId,
    email,
    name: name ?? email.split('@')[0],
    tier: SubscriptionTier.NOVICE,
    credits: DAILY_LOGIN_BONUS,
    birth_date: null,
    birth_time: null,
    birth_place: null,
    zodiac: null,
    timezone: null,
    notification_opt_in: null,
    last_bonus_date: new Date().toISOString().slice(0, 10),
  };

  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .upsert(defaults, { onConflict: 'id', ignoreDuplicates: true })
    .select('*')
    .single();

  if (error) {
    // If ignoreDuplicates is true and row exists, it might return null data but no error (depending on driver),
    // or we might need to fetch again.
    // However, if it was a real error, throw it.
    throw error;
  }

  if (!data) {
    // If insert was ignored (because it exists), fetch the existing one
    return fetchProfile(userId) as Promise<ProfileRow>;
  }

  return data;
};

export interface RegistrationResult {
  user: User | null;
  confirmationRequired: boolean;
}

import { processReferralAction } from "@/app/actions/referral";
import { supabaseAdmin } from "@/services/supabase/admin";

export const registerUser = async (email: string, password: string, name?: string, referralCode?: string): Promise<RegistrationResult> => {
  const supabase = requireSupabase();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.user) {
    throw error || new Error("Registration failed");
  }

  // If email confirmation is enabled, session might be null.
  // In this case, we cannot create the profile yet (RLS would fail).
  // We should inform the user to check their email.
  if (!data.session) {
    return { user: null, confirmationRequired: true };
  }

  // Pass the authenticated client
  // ensureProfile internally handles upsert, but we want to be sure it's committed
  let profile = await ensureProfile(data.user.id, email, name);

  // Process Referral if present
  if (referralCode && referralCode !== profile.id) {
    // Retry logic to wait for profile availability
    // Even though ensureProfile returns a profile object, in distributed systems or with triggers,
    // subsequent selects (like in processReferralAction) might not see it immediately due to replication lag or transaction isolation.
    // We add a robust retry mechanism here.
    
    const maxRetries = 5;
    let ready = false;
    
    for (let i = 0; i < maxRetries; i++) {
        // Check if we can fetch it via admin client (which processReferralAction uses)
        const { data: check } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', profile.id)
            .single();
            
        if (check) {
            ready = true;
            break;
        }
        console.log(`[Referral] Profile ${profile.id} not visible to admin client yet. Retrying ${i + 1}/${maxRetries}...`);
        await new Promise(r => setTimeout(r, 800)); // Wait 800ms
    }

    if (!ready) {
        console.warn(`Referral skipped: Profile ${profile.id} not found via admin client after retries.`);
    } else {
        try {
            const res = await processReferralAction(profile.id, referralCode);
            if (res.success) {
                // Refresh profile to get updated credits
                const updated = await fetchProfile(profile.id);
                if (updated) profile = updated;
            } else {
                console.warn(`Referral skipped for ${profile.id}:`, res.error);
            }
        } catch (e) {
            console.error("Failed to process referral:", e);
        }
    }
  }

  return { user: mapProfileToUser(profile), confirmationRequired: false };
};

export const loginUser = async (email: string, password: string, referralCode?: string): Promise<User> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw error || new Error("Login failed");
  }

  // Pass the authenticated client
  let profile = await ensureProfile(data.user.id, email, data.user.user_metadata?.name);

  // Process Referral if present (e.g. late referral after email confirmation)
  if (referralCode && referralCode !== profile.id) {
    try {
      const res = await processReferralAction(profile.id, referralCode);
      if (res.success) {
        // Refresh profile to get updated credits
        const updated = await fetchProfile(profile.id);
        if (updated) profile = updated;
      }
    } catch (e) {
      console.error("Failed to process referral on login:", e);
    }
  }

  return mapProfileToUser(profile);
};

export const logoutUser = async () => {
  const supabase = requireSupabase();
  await supabase.auth.signOut({ scope: "global" });
};

export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = requireSupabase();

  const { data } = await supabase.auth.getSession();
  const authUser = data.session?.user;

  if (!authUser) return null;

  // Pass the client that we successfully retrieved the session from
  const profile = await ensureProfile(
    authUser.id,
    authUser.email || "",
    authUser.user_metadata?.name
  );

  return mapProfileToUser(profile);
};

export const upgradeUserTier = async (cycle: 'monthly' | 'yearly' = 'monthly'): Promise<User> => {
  void cycle;
  throw new Error("Please upgrade via Stripe Checkout.");
};

export const hasCredits = (user: User | null, amount: number = 1): boolean => {
  if (!user) return false;
  return user.credits >= amount;
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  const supabase = requireSupabase();
  const { error } = await supabase.from('transactions').insert({
    user_id: transaction.userId,
    type: transaction.type,
    amount: transaction.amount,
    currency: transaction.currency,
    credits_change: transaction.creditsChange,
    description: transaction.description,
  });

  if (error) {
    console.error("Failed to save transaction:", error);
    // We don't throw here to avoid breaking the main flow if logging fails
  }
};

export const getTransactionHistory = async (userId: string): Promise<Transaction[]> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: TransactionRow) => ({
    id: row.id,
    userId: row.user_id,
    type: row.type as TransactionType,
    amount: row.amount,
    currency: row.currency,
    creditsChange: row.credits_change,
    description: row.description,
    createdAt: row.created_at,
  }));
};

export const deductCredit = async (amount: number = 1, reason: string = "Service usage", type: TransactionType = 'SPEND_DREAM'): Promise<User> => {
  const supabase = requireSupabase();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) throw new Error("No user");

  const profile = await fetchProfile(authUser.id);
  if (!profile) {
    throw new Error("Profile missing");
  }

  if (profile.credits < amount) {
    throw new Error("Insufficient credits");
  }

  const { data: updated, error } = await supabase
    .from('profiles')
    .update({ credits: profile.credits - amount })
    .eq('id', authUser.id)
    .select('*')
    .single();

  if (error || !updated) {
    throw error || new Error("Failed to deduct credit");
  }

  // Log transaction
  await saveTransaction({
    userId: authUser.id,
    type,
    creditsChange: -amount,
    description: reason,
  });

  return mapProfileToUser(updated);
};

export const addCredits = async (amount: number, reason: string = "Bonus", type: TransactionType = 'BONUS', cost?: number, currency: string = 'USD'): Promise<User> => {
  const supabase = requireSupabase();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) throw new Error("No user");

  const profile = await fetchProfile(authUser.id);
  if (!profile) {
    throw new Error("Profile missing");
  }

  const { data: updated, error } = await supabase
    .from('profiles')
    .update({ credits: profile.credits + amount })
    .eq('id', authUser.id)
    .select('*')
    .single();

  if (error || !updated) {
    throw error || new Error("Failed to add credits");
  }

  // Log transaction
  await saveTransaction({
    userId: authUser.id,
    type,
    creditsChange: amount,
    description: reason,
    amount: cost,
    currency: cost ? currency : undefined
  });

  return mapProfileToUser(updated);
};

export const saveDreamToHistory = async (dream: DreamResult) => {
  const supabase = requireSupabase();
  const { error } = await supabase.from('dreams').insert({
    id: dream.id,
    user_id: dream.userId,
    analysis: dream.analysis,
    image_url: dream.imageUrl,
    timestamp: dream.timestamp,
    dream_input: dream.dreamInput,
  });

  if (error) {
    throw error;
  }
};

export const getDreamHistory = async (userId: string): Promise<DreamResult[]> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapDreamRow);
};

export const getDreamById = async (dreamId: string): Promise<DreamResult | null> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('id', dreamId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data ? mapDreamRow(data) : null;
};

export const updateUserProfile = async (updates: Partial<ProfileRow>): Promise<User> => {
  const supabase = requireSupabase();
  const { data } = await supabase.auth.getUser();
  const authUser = data.user;
  if (!authUser) throw new Error("No user");
  const { data: updated, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', authUser.id)
    .select('*')
    .single();
  if (error || !updated) {
    throw error || new Error("Failed to update profile");
  }
  return mapProfileToUser(updated);
};

export const getDailyFortune = async (userId: string, date: string): Promise<DailyFortune | null> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('daily_fortunes')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    date: data.date,
    zodiac: data.zodiac ?? undefined,
    oracleMessage: data.oracle_message,
    luckyColor: data.lucky_color,
    luckyNumber: data.lucky_number,
    dimensions: data.dimensions,
  };
};

export const saveDailyFortune = async (fortune: DailyFortune): Promise<void> => {
  const supabase = requireSupabase();
  const { error } = await supabase.from('daily_fortunes').upsert({
    id: fortune.id,
    user_id: fortune.userId,
    date: fortune.date,
    zodiac: fortune.zodiac ?? null,
    oracle_message: fortune.oracleMessage,
    lucky_color: fortune.luckyColor,
    lucky_number: fortune.luckyNumber,
    dimensions: fortune.dimensions,
  }, { onConflict: 'user_id,date' });
  if (error) throw error;
};

export const getTarotDrawToday = async (userId: string, date: string): Promise<TarotDraw | null> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('tarot_draws')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    date: data.date,
    spreadType: data.spread_type,
    cards: data.cards,
    interpretation: data.interpretation,
    question: data.question,
    personaId: data.persona_id,
  };
};

export const getTarotHistory = async (userId: string): Promise<TarotDraw[]> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('tarot_draws')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map(row => ({
    id: row.id,
    userId: row.user_id,
    date: row.date,
    spreadType: row.spread_type,
    cards: row.cards,
    interpretation: row.interpretation,
    question: row.question,
    personaId: row.persona_id,
  }));
};

export const getFortuneHistory = async (userId: string): Promise<DailyFortune[]> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from('daily_fortunes')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data ?? []).map(row => ({
    id: row.id,
    userId: row.user_id,
    date: row.date,
    zodiac: row.zodiac ?? undefined,
    oracleMessage: row.oracle_message,
    luckyColor: row.lucky_color,
    luckyNumber: row.lucky_number,
    dimensions: row.dimensions,
  }));
};

export const saveTarotDraw = async (draw: TarotDraw): Promise<void> => {
  const supabase = requireSupabase();
  // Changed from upsert with conflict on date to simple insert/upsert on ID
  // This allows multiple readings per day (history)
  const { error } = await supabase.from('tarot_draws').insert({
    id: draw.id,
    user_id: draw.userId,
    date: draw.date,
    spread_type: draw.spreadType,
    cards: draw.cards,
    interpretation: draw.interpretation,
    question: draw.question,
    persona_id: draw.personaId,
  });
  if (error) throw error;
};
