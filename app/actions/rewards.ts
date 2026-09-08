"use server";

import { DAILY_LOGIN_BONUS, SubscriptionTier, User } from "@/types";
import { supabaseAdmin } from "@/services/supabase/admin";
import { createClient } from "@/services/supabase/server";

type ProfileRow = {
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
  last_bonus_date?: string | null;
  subscription_end_date?: string | null;
};

const mapProfileToUser = (profile: ProfileRow): User => ({
  id: profile.id,
  email: profile.email,
  name: profile.name ?? profile.email.split("@")[0],
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

export const applyLoginRewardsAction = async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const db = process.env.SUPABASE_SERVICE_ROLE_KEY ? supabaseAdmin : supabase;

  for (let attempt = 0; attempt < 2; attempt++) {
    const { data: profile, error: profileError } = await db
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return null;

    const tz = profile.timezone ?? "UTC";
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const lastBonusDate = (profile.last_bonus_date as string | null) ?? null;
    const currentCredits = Number(profile.credits ?? 0);

    const shouldApply = lastBonusDate !== today;

    if (!shouldApply) return mapProfileToUser(profile as ProfileRow);

    const bonusAmount = DAILY_LOGIN_BONUS;
    const nextCredits = currentCredits + bonusAmount;

    const updateQuery = db
      .from("profiles")
      .update({
        credits: nextCredits,
        last_bonus_date: today,
      })
      .eq("id", user.id)
      .eq("credits", currentCredits)
      .select("*");

    const { data: updatedProfile, error: updateError } = await updateQuery.maybeSingle();

    if (updateError) continue;

    if (!updatedProfile) {
      continue;
    }

    await db.from("transactions").insert({
      user_id: user.id,
      type: "BONUS",
      credits_change: bonusAmount,
      description: "Daily Login Bonus",
    });

    return mapProfileToUser(updatedProfile as ProfileRow);
  }

  const { data: finalProfile } = await db
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!finalProfile) return null;
  const tz = finalProfile.timezone ?? "UTC";
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const lastBonusDate = (finalProfile.last_bonus_date as string | null) ?? null;
  if (lastBonusDate !== today) {
    throw new Error("Failed to apply daily login bonus");
  }

  return mapProfileToUser(finalProfile as ProfileRow);
};
