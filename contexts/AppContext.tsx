"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, SubscriptionTier } from "../types";
import { supabase } from "../services/supabase/client";
import { getCurrentUser } from "../services/storage";
import { applyLoginRewardsAction } from "../app/actions/rewards";

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Local development bypass — pairs with DEV_SKIP_AUTH on the server
 * (see services/supabase/devStub.ts). The UI gates on `user` before it ever
 * calls a server action, so without a session here every feature bounces to
 * /auth and the action never runs.
 */
const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

const DEV_USER: User = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "dev@localhost",
  name: "Local Traveler",
  tier: SubscriptionTier.PRO,
  credits: 9999,
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(DEV_SKIP_AUTH ? DEV_USER : null);
  const [isLoading, setIsLoading] = useState(!DEV_SKIP_AUTH);
  const loadingRef = React.useRef(!DEV_SKIP_AUTH);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookieString = document.cookie;
    if (!cookieString) return;
    const entries = cookieString.split(";").map((part) => part.trim());
    const authCookies = entries
      .map((entry) => {
        const [name, ...rest] = entry.split("=");
        return [name, rest.join("=")] as [string, string];
      })
      .filter(
        ([name]) =>
          name.startsWith("sb-") && name.endsWith("-auth-token")
      );
    if (authCookies.length <= 1) return;
    const base64Cookie = authCookies.find(([, value]) =>
      value.startsWith("base64-")
    );
    const keepName =
      base64Cookie?.[0] ?? authCookies[authCookies.length - 1]?.[0];
    authCookies.forEach(([name]) => {
      if (name === keepName) return;
      document.cookie = `${name}=; path=/; max-age=0`;
    });
  }, []);

  useEffect(() => {
    loadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    // The stub user above already stands in for a session.
    if (DEV_SKIP_AUTH) return;

    let mounted = true;

    // Safety timeout - extended to 10s to avoid false positives on slow connections
    const safetyTimeout = setTimeout(() => {
      if (mounted && loadingRef.current) {
        console.warn("Auth check timed out - assuming guest");
        setIsLoading(false);
      }
    }, 10000);

    if (!supabase) {
      console.error("Supabase not configured");
      Promise.resolve().then(() => {
        if (mounted) setIsLoading(false);
      });
      return () => {
        mounted = false;
        clearTimeout(safetyTimeout);
      };
    }

    const handleSessionChange = async (session: any) => {
      if (!mounted) return;
      if (session?.user) {
        const fallbackUser: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || "Traveler",
          tier: SubscriptionTier.NOVICE,
          credits: 0,
        };
        setUser((prev) => {
          if (prev && prev.id === session.user.id) return prev;
          return fallbackUser;
        });
        if (mounted) setIsLoading(false);
        try {
          const fullProfile = await getCurrentUser();
          if (mounted && fullProfile) {
            setUser(fullProfile);
            try {
              const updated = await applyLoginRewardsAction();
              if (mounted && updated) setUser(updated);
            } catch (rewardErr) {
              console.warn("Failed to apply rewards:", rewardErr);
            }
          } else if (mounted) {
            console.warn("Profile fetch returned null, sticking with session fallback");
          }
        } catch (e) {
          console.warn("Background profile fetch skipped/failed (using session fallback):", e);
        }
      } else {
        if (mounted) setUser(null);
        if (mounted) setIsLoading(false);
      }
    };

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        handleSessionChange(data.session ?? null);
      })
      .catch((error) => {
        console.warn("Initial session load failed:", error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });

    const handleAppResume = () => {
      void supabase.auth.getSession().then(({ data }) => {
        if (mounted) void handleSessionChange(data.session ?? null);
      });
    };
    window.addEventListener("oniromancy:resume", handleAppResume);

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription?.unsubscribe();
      window.removeEventListener("oniromancy:resume", handleAppResume);
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
