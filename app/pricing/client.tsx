"use client";

import React from "react";
import { PricingView } from "../../components/PricingView";
import { useApp } from "../../contexts/AppContext";
import { useRouter } from "next/navigation";
import { trackEvent } from "../../services/analytics";
import { requireSupabase } from "../../services/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { isNativeIOS } from "../../lib/native/platform";

export default function PricingPageClient() {
  const { user, isLoading: isAuthLoading } = useApp();
  const router = useRouter();
  const [hasPurchasedStarterPack, setHasPurchasedStarterPack] = React.useState<boolean>(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = React.useState<boolean>(true);
  const [isIOSApp, setIsIOSApp] = React.useState(false);

  React.useEffect(() => {
    setIsIOSApp(isNativeIOS());
    trackEvent('view_pricing');
    // Check for cancellation
    const params = new URLSearchParams(window.location.search);
    if (params.get('canceled')) {
      toast.error("Payment canceled. You have not been charged.", {
        style: {
          background: '#1F2937',
          color: '#fff',
          border: '1px solid #374151',
        },
      });
      // Clean URL
      router.replace('/pricing');
    }
  }, [router]);

  React.useEffect(() => {
    // If auth is still loading, wait
    if (isAuthLoading) return;

    // If no user, not purchased, stop checking
    if (!user) {
        setIsCheckingPurchase(false);
        setHasPurchasedStarterPack(false);
        return;
    }

    // User exists, start checking
    setIsCheckingPurchase(true);
    const checkStarterPack = async () => {
      try {
        const supabase = requireSupabase();
        const { data } = await supabase
          .from('transactions')
          .select('id')
          .eq('user_id', user.id)
          .eq('credits_change', 30)
          .limit(1);
        
        if (data && data.length > 0) {
          setHasPurchasedStarterPack(true);
        } else {
          setHasPurchasedStarterPack(false);
        }
      } catch (e) {
        // Supabase might not be configured or network error
        setHasPurchasedStarterPack(false);
      } finally {
        setIsCheckingPurchase(false);
      }
    };
    checkStarterPack();
  }, [user, isAuthLoading]);

  const handleUpgrade = async (cycle: 'monthly' | 'yearly') => {
    if (isNativeIOS()) {
      toast.error("Purchases are temporarily unavailable in the iOS app.");
      return;
    }
    if (!user) {
        router.push('/auth');
        return;
    }
    trackEvent('begin_checkout', { type: 'subscription', cycle });
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                email: user.email,
                type: 'SUBSCRIPTION',
                cycle
            })
        });
        
        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error(data.error || 'Failed to initiate checkout');
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            toast.error(e.message, {
                style: {
                    background: '#1F2937',
                    color: '#fff',
                    border: '1px solid #374151',
                },
            });
        } else {
            toast.error("An unknown error occurred.", {
                style: {
                    background: '#1F2937',
                    color: '#fff',
                    border: '1px solid #374151',
                },
            });
        }
    }
  };

  const handleBuyCredits = async (amount: number, cost: number) => {
      if (isNativeIOS()) {
          toast.error("Purchases are temporarily unavailable in the iOS app.");
          return;
      }
      if (!user) {
          router.push('/auth');
          return;
      }
      trackEvent('begin_checkout', { type: 'credits', amount, cost });
      try {
          const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                email: user.email,
                type: 'CREDITS',
                amount
            })
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error(data.error || 'Failed to initiate checkout');
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
            alert(e.message);
        } else {
            alert("An unknown error occurred.");
        }
      }
  };

  if (isIOSApp) {
    return (
      <section className="w-full max-w-lg mx-auto min-h-[65dvh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full border border-mystic-gold/40 bg-mystic-gold/10 text-mystic-gold grid place-items-center text-2xl mb-6">✦</div>
        <h1 className="text-3xl font-display text-white mb-4">Purchases on iOS</h1>
        <p className="text-slate-300 leading-relaxed mb-3">Purchases are temporarily unavailable in the iOS app.</p>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">Your existing and free credits remain available. StoreKit purchases will be added in a future release.</p>
        <Link href="/profile" className="min-h-12 px-7 rounded-xl bg-mystic-gold text-black font-semibold flex items-center justify-center">Return to Profile</Link>
      </section>
    );
  }

  return (
    <PricingView 
        user={user} 
        hasPurchasedStarterPack={hasPurchasedStarterPack}
        isLoadingPurchaseHistory={isCheckingPurchase || isAuthLoading}
        onUpgrade={handleUpgrade} 
        onBuyCredits={handleBuyCredits} 
    />
  );
}
