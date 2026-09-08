import React, { useEffect, useState } from "react";
import { User } from "../types";
import { updateUserProfile, getCurrentUser } from "../services/storage";
import { Calendar, Clock, MapPin, Globe, Bell, Save, Star, RefreshCw, CreditCard, ShieldCheck } from "lucide-react";
import { zodiacOf } from "../utils";
import clsx from "clsx";
import Link from "next/link";
import { ReferralSection } from "./ReferralSection";

interface ProfileViewProps {
  user: User | null;
  onSaved: (user: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onSaved }) => {
  const [birthDate, setBirthDate] = useState(user?.birthDate || "");
  const [birthTime, setBirthTime] = useState(user?.birthTime || "");
  const [birthPlace, setBirthPlace] = useState(user?.birthPlace || "");
  const [timezone, setTimezone] = useState(
    user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || ""
  );
  const [notificationOptIn, setNotificationOptIn] = useState(
    !!user?.notificationOptIn
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    setError(null);
    if (user) {
      setBirthDate(user.birthDate || "");
      setBirthTime(user.birthTime || "");
      setBirthPlace(user.birthPlace || "");
      setTimezone(user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "");
      setNotificationOptIn(!!user.notificationOptIn);
    }
  }, [user]);

  // Auto-fetch on mount if data seems missing (fallback mode)
  useEffect(() => {
    if (user && !user.birthDate && !refreshing) {
       // Only try to refresh once on mount if birthDate is missing
       handleRefresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await getCurrentUser();
      if (fresh) {
        onSaved(fresh);
      }
    } catch (e) {
      console.error("Failed to refresh profile", e);
    } finally {
      setRefreshing(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl text-slate-300 font-display">Please sign in</h3>
      </div>
    );
  }

  const z = zodiacOf(birthDate) || user?.zodiac;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateUserProfile({
        birth_date: birthDate || null,
        birth_time: birthTime || null,
        birth_place: birthPlace || null,
        timezone: timezone || null,
        zodiac: z || null,
        notification_opt_in: notificationOptIn,
      });
      onSaved(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: unknown) {
      let message = "Failed to save";
      if (e instanceof Error) {
        message = e.message;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-20">
      
      {/* Referral Section (Prominent) */}
      <ReferralSection user={user} />

      {/* Profile Settings Card */}
      <div className="bg-mystic-900/80 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shrink-0">
              {user.name?.charAt(0).toUpperCase() ||
                user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl text-white font-display font-bold">
                {user.name || "Traveler"}
              </h2>
              <p className="text-slate-400 text-sm break-all">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 ml-auto sm:ml-0">
            <div className="flex items-center gap-2">
              <Link
                href="/orders"
                className="text-slate-500 hover:text-mystic-gold transition-colors p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
                title="View Orders"
              >
                <CreditCard className="w-5 h-5" />
              </Link>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-slate-500 hover:text-mystic-gold transition-colors p-2 rounded-full hover:bg-white/5 disabled:opacity-50 border border-transparent hover:border-white/10"
                title="Refresh Profile Data"
              >
                <RefreshCw
                  className={clsx("w-5 h-5", refreshing && "animate-spin")}
                />
              </button>
            </div>

            {z && (
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Sun Sign
                </div>
                <div className="text-2xl text-mystic-gold font-display font-bold flex items-center gap-2 justify-end">
                  <Star className="w-5 h-5" />
                  {z}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/30 border border-green-500/30 text-green-200 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
            <span>✨</span> Profile updated successfully
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative group">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Calendar className="w-3 h-3 text-mystic-gold" /> Birth Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-mystic-gold/50 focus:ring-1 focus:ring-mystic-gold/50 transition-all appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-mystic-gold transition-colors" />
            </div>
          </div>

          <div className="space-y-2 relative group">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Clock className="w-3 h-3 text-mystic-gold" /> Birth Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-mystic-gold/50 focus:ring-1 focus:ring-mystic-gold/50 transition-all appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-mystic-gold transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <MapPin className="w-3 h-3 text-mystic-gold" /> Birth Place
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="City, Country"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-mystic-gold/50 focus:ring-1 focus:ring-mystic-gold/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Globe className="w-3 h-3 text-mystic-gold" /> Timezone
            </label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-mystic-gold/50 focus:ring-1 focus:ring-mystic-gold/50 transition-all"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <div
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => setNotificationOptIn(!notificationOptIn)}
          >
            <div
              className={clsx(
                "w-5 h-5 rounded-md flex items-center justify-center border transition-colors",
                notificationOptIn
                  ? "bg-mystic-gold border-mystic-gold text-black"
                  : "border-slate-500"
              )}
            >
              {notificationOptIn && <Bell className="w-3 h-3" />}
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                Daily Cosmic Guidance
              </div>
              <div className="text-xs text-slate-400">
                Receive daily notifications about your horoscope and tarot.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="p-5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-mystic-gold" />
              <h4 className="text-sm font-bold text-slate-200">
                Privacy & Precision
              </h4>
            </div>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <p>
                <strong className="text-slate-300">
                  Secure Cloud Profile:
                </strong>{" "}
                Your data is securely encrypted and stored in your private cloud
                account. We respect your privacy and never share your personal
                details.
              </p>
              <p>
                <strong className="text-slate-300">Why we need this:</strong>
                <span className="block mt-1 ml-2">
                  • To calculate precise planetary positions for your Horoscope
                </span>
                <span className="block ml-2">
                  • To align Tarot readings with your numerology
                </span>
                <span className="block ml-2">
                  • To provide personalized context for Dream Analysis
                </span>
              </p>
              <p>
                <strong className="text-slate-300">Accuracy:</strong> Exact
                birth time and location ensure your readings are astronomically
                correct and uniquely tailored to you.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-8 bg-gradient-to-r from-mystic-gold to-amber-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Profile
            </>
          )}
        </button>
      </div>
    </div>
  );
};
