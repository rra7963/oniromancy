import React, { useState } from "react";
import { Check, Crown, Sparkles, History, Coins, Sun, Zap } from "lucide-react";
import { User, SubscriptionTier, DAILY_LOGIN_BONUS, MONTHLY_PRO_CREDITS } from "../types";
import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";

interface PricingViewProps {
  user: User | null;
  hasPurchasedStarterPack?: boolean;
  isLoadingPurchaseHistory?: boolean;
  onUpgrade: (cycle: 'monthly' | 'yearly') => void;
  onBuyCredits: (amount: number, cost: number) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ user, hasPurchasedStarterPack, isLoadingPurchaseHistory, onUpgrade, onBuyCredits }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [buying, setBuying] = useState<number | null>(null);
  const [upgrading, setUpgrading] = useState<boolean>(false);

  const handleBuy = async (amount: number, price: number) => {
    if (!user) {
        // Use router or window.location properly if needed, but here window.location is fine for full redirect
        // However, linter complains. Let's assume we can just return or use a callback.
        // But window.location is standard. Maybe the linter rule is strict about side effects in handlers?
        // Actually, let's just use window.location.assign() to be safer or ignore if it's a false positive.
        // Or better, let's use a prop for navigation if possible, but window.location is direct.
        // Let's try assign.
        window.location.assign('/auth');
        return;
    }
    setBuying(amount);
    try {
        await onBuyCredits(amount, price);
        // Simulate processing
        await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
        setBuying(null);
    }
    // Don't clear buying on success to keep loading state during redirect
  };
  
  const handleUpgradeClick = async () => {
      if (!user) {
          window.location.assign('/auth');
          return;
      }
      setUpgrading(true);
      try {
          await onUpgrade(billingCycle);
      } catch (e) {
          setUpgrading(false);
      }
  };

  const packs = React.useMemo(() => [
     ...(!hasPurchasedStarterPack ? [{ amount: 30, price: 0.99, name: "Starter Pack", special: true }] : []),
     { amount: 50, price: 4.99, name: "Handful of Dust" },
     { amount: 200, price: 9.99, name: "Bag of Stardust", popular: true },
     { amount: 500, price: 29.99, name: "Chest of Ether" }
  ], [hasPurchasedStarterPack]);

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in py-12 px-4">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-display text-white mb-6">
          Choose Your Destiny
        </h2>
        <p className="text-slate-400 font-serif text-xl italic mb-8 max-w-2xl mx-auto">
          &quot;The universe rewards those who seek deeper knowledge. Secure your place in the cosmos.&quot;
        </p>
        
        {user && (
          <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-mystic-gold hover:text-amber-300 transition-colors mb-8">
            <History className="w-4 h-4" />
            View Purchase History
          </Link>
        )}
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={clsx("text-sm font-bold uppercase tracking-widest transition-colors", billingCycle === 'monthly' ? "text-white" : "text-slate-500")}>Monthly</span>
          <button 
            aria-label="Toggle billing cycle"
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className="w-16 h-8 bg-white/10 rounded-full relative border border-white/20 transition-colors hover:border-mystic-gold/50"
          >
            <motion.div 
              className="absolute top-1 bottom-1 w-6 bg-mystic-gold rounded-full"
              animate={{ left: billingCycle === 'monthly' ? 4 : 34 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={clsx("text-sm font-bold uppercase tracking-widest transition-colors", billingCycle === 'yearly' ? "text-white" : "text-slate-500")}>
            Yearly <span className="text-mystic-gold text-xs ml-1">-30%</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20 items-start">
        {/* Free Tier - The Seeker */}
        <div className="bg-mystic-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col relative group hover:border-white/20 transition-colors h-full">
          <div className="mb-6">
            <div className="text-slate-400 font-sans text-sm uppercase tracking-widest mb-2">
              The Seeker
            </div>
            <div className="text-4xl font-display text-white">Free</div>
            <p className="text-slate-500 text-sm mt-2">For the curious wanderer.</p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <Check className="w-4 h-4 text-mystic-gold" /> <span className="text-white font-bold">{DAILY_LOGIN_BONUS} Daily Credits</span>
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <Check className="w-4 h-4 text-slate-500" /> Daily Horoscope (1 Credit)
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <Check className="w-4 h-4 text-slate-500" /> Single Card Tarot (2 Credits)
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm">
              <Check className="w-4 h-4 text-slate-500" /> Basic Dream Interpretation
            </li>
          </ul>
          {user && user.tier !== SubscriptionTier.PRO ? (
            <button className="w-full py-4 rounded-xl border border-white/10 text-slate-300 text-sm uppercase tracking-widest hover:bg-white/5 transition-colors" disabled>
              Current Plan
            </button>
          ) : !user ? (
            <Link href="/auth" className="block w-full py-4 rounded-xl border border-white/10 text-slate-300 text-sm uppercase tracking-widest hover:bg-white/5 transition-colors text-center">
              Sign Up Free
            </Link>
          ) : (
             <div className="text-center text-sm text-slate-500 py-4">Included in Mystic Plan</div>
          )}
        </div>

        {/* Pro Tier - The Mystic (Most Popular) */}
        <div className="bg-gradient-to-b from-mystic-800/90 to-mystic-900/90 backdrop-blur-xl border border-mystic-gold/50 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 transition-all duration-500 shadow-[0_0_50px_-10px_rgba(212,175,55,0.2)] z-10 h-full">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-mystic-gold text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
            <Crown className="w-3 h-3" /> Best Value
          </div>

          <div className="mb-6">
            <div className="text-mystic-gold font-sans text-sm uppercase tracking-widest mb-2">
              The Mystic
            </div>
            <div className="text-5xl font-display text-white">
              ${billingCycle === 'monthly' ? '9.99' : '6.99'}
              <span className="text-lg text-slate-400">/mo</span>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              {billingCycle === 'yearly' ? 'Billed $84 yearly' : 'Billed monthly'}
            </p>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white text-sm font-bold">
              <Coins className="w-4 h-4 text-mystic-gold" /> {MONTHLY_PRO_CREDITS} Monthly Credits
            </li>
            <li className="flex items-center gap-3 text-white text-sm">
               <span className="text-slate-400 text-xs ml-7">(Value: $30+)</span>
            </li>
            <li className="flex items-center gap-3 text-white text-sm">
              <Sparkles className="w-4 h-4 text-mystic-gold" /> Dream Image Generation
            </li>
            <li className="flex items-center gap-3 text-white text-sm">
              <Sun className="w-4 h-4 text-mystic-gold" /> 3-Card Tarot Spreads
            </li>
            <li className="flex items-center gap-3 text-white text-sm">
              <History className="w-4 h-4 text-mystic-gold" /> Unlimited Grimoire History
            </li>
            <li className="flex items-center gap-3 text-white text-sm">
              <Zap className="w-4 h-4 text-mystic-gold" /> Priority Processing
            </li>
          </ul>

          <button
            onClick={user?.tier === SubscriptionTier.PRO ? undefined : handleUpgradeClick}
            disabled={user?.tier === SubscriptionTier.PRO || upgrading}
            className={clsx(
                "w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg relative overflow-hidden group active:scale-[0.98]",
                user?.tier === SubscriptionTier.PRO ? "bg-white/10 text-slate-400 cursor-default" : "bg-mystic-gold hover:bg-amber-400 active:bg-amber-500 text-black",
                upgrading && "opacity-70 cursor-wait"
            )}
          >
            <span className="relative z-10">
                {user?.tier === SubscriptionTier.PRO ? "Active Plan" : upgrading ? "Processing..." : "Get Pro Access"}
            </span>
            {user?.tier !== SubscriptionTier.PRO && !upgrading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
          </button>
          {user?.tier !== SubscriptionTier.PRO && (
              <p className="text-center text-xs text-slate-500 mt-3">Cancel anytime. No commitment.</p>
          )}
        </div>
      </div>

      {/* Credit Packs */}
      <div className="border-t border-white/10 pt-16">
          <div className="text-center mb-12">
              <h3 className="text-2xl font-display text-white mb-2">Need More Visions?</h3>
              <p className="text-slate-400">Purchase instant credit packs. Never expire.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
             {isLoadingPurchaseHistory ? (
                // Loading Skeletons
                Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] h-[280px] animate-pulse">
                        <div className="w-24 h-4 bg-white/10 rounded mb-4 mt-2"></div>
                        <div className="w-32 h-8 bg-white/10 rounded mb-2"></div>
                        <div className="w-16 h-4 bg-white/10 rounded mb-8"></div>
                        <div className="w-full h-12 bg-white/10 rounded mt-auto"></div>
                    </div>
                ))
             ) : (
                packs.map((pack) => (
                 <div key={pack.amount} className={clsx(
                    "bg-black/40 border rounded-2xl p-6 flex flex-col items-center relative transition-all hover:-translate-y-1", 
                    "w-full sm:w-[calc(50%-12px)]",
                    packs.length === 4 ? "lg:w-[calc(25%-18px)]" : "lg:w-[calc(33.333%-16px)]",
                    (pack as any).popular ? "border-mystic-gold/50 bg-mystic-900/20" : 
                    (pack as any).special ? "border-purple-500/50 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "border-white/10"
                 )}>
                     {(pack as any).popular && (
                         <div className="absolute -top-3 bg-mystic-gold text-black text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                             Popular
                         </div>
                     )}
                     {(pack as any).special && (
                         <div className="absolute -top-3 bg-purple-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                             <Sparkles className="w-3 h-3" /> Special
                         </div>
                     )}
                     <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">{pack.name}</div>
                     <div className="text-3xl font-display text-white mb-1">{pack.amount} <span className="text-lg text-mystic-gold">Credits</span></div>
                     <div className="text-slate-500 text-sm mb-6">${pack.price}</div>
                     <button 
                        onClick={() => handleBuy(pack.amount, pack.price)}
                        disabled={buying !== null}
                        className={clsx(
                            "w-full py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2",
                            (pack as any).special ? "bg-purple-600 hover:bg-purple-500 text-white" : "border border-white/10 hover:bg-white/10 text-white"
                        )}
                     >
                         {buying === pack.amount ? (
                             <span className="animate-pulse">Processing...</span>
                         ) : (
                             <>Purchase</>
                         )}
                     </button>
                 </div>
             ))
            )}
          </div>
      </div>
    </div>
  );
};
