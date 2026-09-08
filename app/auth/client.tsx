"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthView } from "../../components/AuthView";
import { loginUser, registerUser } from "../../services/storage";
import { supabase } from "../../services/supabase/client";
import { useApp } from "../../contexts/AppContext";
import { trackEvent } from "../../services/analytics";
import { Browser } from "@capacitor/browser";
import { isNativeIOS } from "../../lib/native/platform";

export default function AuthPageClient() {
  const router = useRouter();
  const { setUser } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (
    mode: "login" | "signup",
    email: string,
    password: string,
    name?: string
  ) => {
    setError(null);
    setSuccess(null);
    try {
      // Read referral code from cookie
      let ivt: string | undefined;
      if (typeof document !== 'undefined') {
          const match = document.cookie.match(
            new RegExp("(^| )ivt_code=([^;]+)")
          );
          if (match) ivt = match[2];
      }

      if (mode === "login") {
        const u = await loginUser(email, password, ivt);
        trackEvent(mode, { method: 'email' });
        setUser(u);
        router.push("/");
        return { keepLoading: true };
      } else {
        const result = await registerUser(email, password, name, ivt);
        if (result.confirmationRequired) {
          setSuccess("Registration successful! Please check your email to confirm your account.");
          trackEvent(mode, { method: 'email', status: 'pending_confirmation' });
          return { keepLoading: false };
        } else if (result.user) {
          trackEvent(mode, { method: 'email' });
          setUser(result.user);
          router.push("/");
          return { keepLoading: true };
        }
      }
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    if (!supabase) {
      const err = new Error(
        "Supabase is not configured, Google login unavailable."
      );
      setError(err.message);
      throw err;
    }

    const nativeIOS = isNativeIOS();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = nativeIOS
      ? "oniromancy://auth/callback"
      : `${origin.replace(/\/$/, "")}/auth/callback`;
    
    trackEvent('login', { method: 'google' });

    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: nativeIOS,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      throw oauthError;
    }
    if (nativeIOS && data.url) {
      await Browser.open({ url: data.url, presentationStyle: "popover" });
    }
  };

  return (
    <AuthView
      onAuthenticate={handleAuth}
      onGoogleLogin={handleGoogleLogin}
      errorMessage={error}
      successMessage={success}
    />
  );
}
