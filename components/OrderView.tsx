import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { User, Transaction, SubscriptionTier } from '../types';
import { getTransactionHistory } from '../services/storage';
import { motion } from 'framer-motion';
import { Calendar, Clock, Shield, Coins, CheckCircle2, History, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import Link from "next/link";
import { Pagination } from './Pagination';

interface OrderViewProps {
  user: User | null;
  refreshKey?: number;
}

export const OrderView: React.FC<OrderViewProps> = ({ user, refreshKey }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const userId = useMemo(() => user?.id ?? null, [user?.id]);
  const inFlightRef = useRef(false);
  const pendingRefetchRef = useRef(false);
  const lastAutoLoadKeyRef = useRef<string>("");

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    if (inFlightRef.current) {
      pendingRefetchRef.current = true;
      return;
    }

    inFlightRef.current = true;
    setLoading(true);
    try {
      const history = await getTransactionHistory(userId);
      history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTransactions(history);
    } catch (e) {
      console.error("Failed to load transaction history", e);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
      if (pendingRefetchRef.current) {
        pendingRefetchRef.current = false;
        void loadHistory();
      }
    }
  }, [userId]);

  useEffect(() => {
    const key = `${userId ?? ""}:${refreshKey ?? 0}`;
    if (key === lastAutoLoadKeyRef.current) return;
    lastAutoLoadKeyRef.current = key;
    setCurrentPage(1);
    void loadHistory();
  }, [loadHistory, refreshKey, userId]);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!user) {
    return (
      <div className="text-center py-20 text-slate-300 font-display text-xl">
        Please sign in to view your orders
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 text-center"
      >
        <h1 className="text-4xl font-display font-bold text-white mb-4">Account & Orders</h1>
        <p className="text-slate-400">Manage your membership, credits, and view transaction history.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Membership Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-mystic-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Membership</p>
              <h3 className="text-2xl font-display font-bold text-white">{user.tier === SubscriptionTier.PRO ? 'Pro Initiate' : 'Novice'}</h3>
              {user.subscriptionEndDate && user.tier === SubscriptionTier.PRO && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Valid until {new Date(user.subscriptionEndDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className={clsx("p-3 rounded-xl", user.tier === SubscriptionTier.PRO ? "bg-amber-500/20 text-amber-400" : "bg-slate-700/50 text-slate-400")}>
              <Shield className="w-6 h-6" />
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{user.tier === SubscriptionTier.PRO ? 'Advanced Dream Analysis' : 'Basic Dream Analysis'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{user.tier === SubscriptionTier.PRO ? 'Full Tarot Spreads' : 'Single Card Draws'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{user.tier === SubscriptionTier.PRO ? 'Monthly 500 Credits' : 'Daily Login Bonus'}</span>
            </div>
          </div>

          {user.tier !== SubscriptionTier.PRO && (
            <Link href="/pricing" className="block w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all text-center">
              Upgrade to Pro
            </Link>
          )}
        </motion.div>

        {/* Credits Card */}
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-mystic-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Balance</p>
              <h3 className="text-4xl font-display font-bold text-mystic-gold">{user.credits}</h3>
              <p className="text-xs text-slate-500 mt-1">Available Credits</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
          </div>
          
          <div className="space-y-4 mt-12">
             <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs">
                      +
                   </div>
                   <span className="text-sm text-white">Buy Credits</span>
                </div>
                <Link href="/pricing" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors">
                   Top Up
                </Link>
             </div>
          </div>
        </motion.div>

        {/* Quick Stats / Next Bonus */}
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3 }}
           className="bg-mystic-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col justify-center"
        >
           <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                 <Calendar className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Next Renewal</h3>
              <p className="text-slate-400 text-sm mb-6">
                 {user.tier === SubscriptionTier.PRO 
                    ? `Your subscription credits will replenish on ${user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'your next billing date'}.`
                    : "Login tomorrow for your daily 5 credits bonus."}
              </p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-3/4" />
              </div>
           </div>
        </motion.div>
      </div>

      {/* Transaction History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
           <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Transaction History
           </h3>
           <div className="flex items-center gap-4">
             <div className="text-xs text-slate-500 hidden sm:block">
                Showing {paginatedTransactions.length} of {transactions.length} records
             </div>
             <button
               onClick={loadHistory}
               disabled={loading}
               className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               title="Refresh History"
             >
               <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
             </button>
           </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
             <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
             Loading records...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
             No transactions found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-white/5">
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Type</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                    <th className="px-6 py-4 font-medium text-right">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                           <Clock className="w-3 h-3 text-slate-500" />
                           {new Date(tx.createdAt).toLocaleString(undefined, {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                           })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium max-w-[150px] truncate" title={tx.description}>
                        {tx.description}
                      </td>
                      <td className="px-6 py-4 text-sm hidden md:table-cell">
                         <span className={clsx(
                            "px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold",
                            tx.creditsChange > 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                         )}>
                            {tx.type.replace('SPEND_', '').replace('_', ' ')}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300 text-right font-mono">
                         {tx.amount ? `${tx.currency || '$'} ${tx.amount.toFixed(2)}` : '-'}
                      </td>
                      <td className={clsx("px-6 py-4 text-sm font-mono font-bold text-right", tx.creditsChange > 0 ? "text-emerald-400" : "text-rose-400")}>
                         {tx.creditsChange > 0 ? '+' : ''}{tx.creditsChange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-white/10 bg-white/5">
                 <div className="text-xs text-slate-500">
                    Page {currentPage} of {totalPages}
                 </div>
                 <Pagination 
                   currentPage={currentPage}
                   totalPages={totalPages}
                   onPageChange={setCurrentPage}
                 />
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};
