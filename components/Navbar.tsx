"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../contexts/AppContext";
import { SubscriptionTier } from "../types";
import { signOutAction } from "../app/auth/actions";
import { trackEvent } from "../services/analytics";
import { Sparkles, History, Crown, LogOut, User as UserIcon, Moon, Sun, Coins, Menu, X, LucideIcon, Star, Gem, BookOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

const NavItem = ({ to, icon: Icon, label, pathname }: { to: string; icon: LucideIcon; label: string; pathname: string }) => {
  const isActive = pathname === to;
  return (
    <Link
      href={to}
      onClick={() => trackEvent('select_content', { content_type: 'navigation', item_id: label })}
      className={clsx(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
        isActive
          ? "text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={clsx("w-4 h-4", isActive && "text-mystic-gold")} />
      <span className="hidden md:inline text-sm font-medium">{label}</span>
    </Link>
  );
};

export const Navbar = () => {
  const { user, setUser } = useApp();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Force cleanup local state immediately for better UX
    setUser(null);
    setIsMobileMenuOpen(false);
    
    // Clear client-side Supabase storage just in case
    if (typeof window !== 'undefined') {
        Object.keys(window.localStorage).forEach(key => {
            if (key.startsWith('sb-')) window.localStorage.removeItem(key);
        });
    }

    try {
      await signOutAction();
    } catch (err: unknown) {
      // Should be caught in service, but double safety
      console.error("Logout error:", err);
    }
    
    // Optional: Redirect to home or auth page
    // router.push('/'); 
  };



  return (
    <nav className="app-web-navbar w-full border-b border-white/5 bg-mystic-900/50 backdrop-blur-md fixed top-0 left-0 right-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            // Logic for resetting state if needed, maybe handle in Home component
          }}
        >
          <Sparkles className="w-5 h-5 text-mystic-gold group-hover:rotate-12 transition-transform" />
          <span className="text-lg font-display font-bold tracking-wider text-slate-200 group-hover:text-white transition-colors">
            ONIROMANCY
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1 mr-2 border-r border-white/10 pr-4">
                <NavItem
                  to="/"
                  icon={Moon}
                  label="Dreams"
                  pathname={pathname}
                />
                <NavItem
                  to="/horoscope"
                  icon={Star}
                  label="Horoscope"
                  pathname={pathname}
                />
                <NavItem
                  to="/tarot"
                  icon={Sun}
                  label="Tarot"
                  pathname={pathname}
                />
                <NavItem
                  to="/history"
                  icon={History}
                  label="Grimoire"
                  pathname={pathname}
                />
              </div>

              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center gap-3 pl-2">
                <Link
                  href="/orders"
                  className={clsx(
                    "flex items-center gap-3 mr-2 px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                    pathname === "/orders"
                      ? "bg-mystic-gold/20 border-mystic-gold shadow-[0_0_10px_rgba(216,180,254,0.2)]"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  {user.tier === SubscriptionTier.PRO ? (
                    <div
                      className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider"
                      title="Pro Member"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Pro</span>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider"
                      title="Novice Member"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Novice</span>
                    </div>
                  )}
                  <div className="w-px h-3 bg-white/20"></div>
                  <div
                    className="flex items-center gap-1.5 text-xs font-mono text-mystic-gold"
                    title="Available Credits"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{user.credits}</span>
                  </div>
                </Link>

                <Link
                  href="/pricing"
                  className={clsx(
                    "relative flex items-center gap-2 px-4 py-1.5 rounded-full transition-all group overflow-hidden border",
                    pathname === "/pricing"
                      ? "bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                      : "bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:via-purple-500/20 hover:to-indigo-500/20 border-amber-500/20 hover:border-amber-500/40"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Gem className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-200 transition-colors" />
                  <span className="text-xs font-bold text-amber-100 group-hover:text-white tracking-wider">
                    Pricing
                  </span>
                </Link>

                {/* Referral Badge Link (Removed in favor of badge on profile) */}

                <Link
                  href="/profile"
                  className={clsx(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all border relative group",
                    pathname === "/profile"
                      ? "bg-mystic-gold/20 border-mystic-gold text-mystic-gold shadow-[0_0_10px_rgba(216,180,254,0.2)]"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
                  )}
                  title="Profile Settings"
                >
                  <UserIcon className="w-4 h-4" />
                  
                  {/* Earn Badge */}
                  <div className="absolute -top-1.5 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full border border-indigo-400/50 shadow-lg transform rotate-12 group-hover:rotate-0 transition-all z-10">
                    EARN
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-full"
                  title="Sever Connection"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Menu Trigger */}
              <button
                className="lg:hidden p-2 text-slate-200 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="px-5 py-2 rounded-full bg-white text-black font-semibold hover:bg-slate-200 transition-colors text-sm"
            >
              Sign Up / Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <div className="lg:hidden">
            {/* Clickable Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full border-t border-white/5 bg-mystic-900/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
            >
              <div className="flex flex-col p-4 gap-4">
                {/* User Stats */}
                <Link
                  href="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span
                          className={
                            user.tier === SubscriptionTier.PRO
                              ? "text-amber-400"
                              : "text-slate-400"
                          }
                        >
                          {user.tier}
                        </span>
                        <span>•</span>
                        <span className="text-mystic-gold">
                          {user.credits} Credits
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg text-slate-400">
                    <Coins className="w-4 h-4" />
                  </div>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10"
                  >
                    <Moon className="w-6 h-6 text-emerald-300 mb-2" />
                    <span className="text-sm text-slate-300">Dreams</span>
                  </Link>
                  <Link
                    href="/horoscope"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10"
                  >
                    <Star className="w-6 h-6 text-purple-300 mb-2" />
                    <span className="text-sm text-slate-300">Horoscope</span>
                  </Link>
                  <Link
                    href="/tarot"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10"
                  >
                    <Sun className="w-6 h-6 text-amber-300 mb-2" />
                    <span className="text-sm text-slate-300">Tarot</span>
                  </Link>
                  <Link
                    href="/history"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10"
                  >
                    <History className="w-6 h-6 text-indigo-300 mb-2" />
                    <span className="text-sm text-slate-300">Grimoire</span>
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10"
                  >
                    <Gem className="w-6 h-6 text-pink-300 mb-2" />
                    <span className="text-sm text-slate-300">Pricing</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 relative group"
                  >
                    <UserIcon className="w-6 h-6 text-slate-300 mb-2" />
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full border border-indigo-400/50 shadow-lg transform rotate-12">
                      EARN
                    </div>
                    <span className="text-sm text-slate-300">Profile</span>
                  </Link>
                </div>

                {user.tier === SubscriptionTier.NOVICE && (
                  <Link
                    href="/pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 bg-mystic-gold/20 border border-mystic-gold/30 rounded-xl text-mystic-gold font-bold text-center uppercase tracking-widest text-sm"
                  >
                    Upgrade to Pro
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-3 text-red-400 flex items-center justify-center gap-2 hover:bg-red-900/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};
