"use client";
import React, { useEffect, useState } from "react";
import { User } from "../types";
import { getReferralStatsAction, getReferralsListAction } from "../app/actions/referral";
import { REFERRAL_BONUS } from "../types";
import { Users, Copy, Check, Gift, Clock, RefreshCw } from "lucide-react";
import { Pagination } from "./Pagination";
import clsx from 'clsx';

interface ReferralSectionProps {
  user: User;
}

interface ReferralRecord {
  id: string;
  createdAt: string;
  status: string;
  inviteeName: string;
  inviteeEmail: string;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({ user }) => {
  const [stats, setStats] = useState({ count: 0, creditsEarned: 0 });
  const [list, setList] = useState<ReferralRecord[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const LIMIT = 5;

  useEffect(() => {
    // Initial data load
    const loadData = async () => {
      setInitialLoading(true);
      try {
        const [statsRes, listRes] = await Promise.all([
          getReferralStatsAction(user.id),
          getReferralsListAction(user.id, 1, LIMIT)
        ]);
        setStats(statsRes);
        setList(listRes.data);
        setTotal(listRes.count);
      } catch (e) {
        console.error("Failed to load referral data", e);
      } finally {
        setInitialLoading(false);
      }
    };
    loadData();
  }, [user.id]);

  const loadList = async (p: number) => {
    setLoading(true);
    setPage(p);
    try {
      const res = await getReferralsListAction(user.id, p, LIMIT);
      setList(res.data);
      setTotal(res.count);
    } catch (e) {
      console.error("Failed to load referrals", e);
    } finally {
      setLoading(false);
    }
  };

  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}?ivt=${user.id}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 animate-fade-in">
      <div className="rounded-3xl bg-mystic-900/50 border border-white/10 relative overflow-hidden shadow-2xl backdrop-blur-sm">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Users className="w-64 h-64 text-mystic-gold" />
        </div>

        <div className="relative z-10 p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start min-w-0">
                <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-mystic-gold/10 rounded-xl border border-mystic-gold/20 backdrop-blur-sm shrink-0 mt-1">
                            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-mystic-gold" />
                        </div>
                        <h3 className="text-lg sm:text-2xl font-display font-bold text-white break-words leading-tight min-w-0">
                            Invite Friends & Earn Credits
                        </h3>
                    </div>

                    <p className="text-slate-300 text-sm mb-6 max-w-lg leading-relaxed break-words">
                        Share your unique link with friends. When they sign up, you <strong>both receive {REFERRAL_BONUS} credits</strong> instantly! 
                        Start building your cosmic circle today.
                    </p>

                    <div className="space-y-2 max-w-md w-full">
                        <label className="text-xs font-bold text-mystic-gold/70 uppercase tracking-wider">Your Unique Invite Link</label>
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 font-mono text-sm min-w-0 flex items-center">
                                <span className="truncate w-full block">{inviteLink}</span>
                            </div>
                            <button 
                                onClick={handleCopy}
                                className="bg-mystic-gold hover:bg-amber-400 text-black px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-mystic-gold/20 active:scale-95 flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                <span className="whitespace-nowrap">{copied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full md:w-auto min-w-0 md:min-w-[300px]">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/5 flex flex-col items-center justify-center text-center h-[100px]">
                        {initialLoading ? (
                            <div className="w-12 h-8 bg-white/10 rounded animate-pulse mb-1" />
                        ) : (
                            <div className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">{stats.count}</div>
                        )}
                        <div className="text-[10px] sm:text-xs text-indigo-200 uppercase tracking-wider">Friends Invited</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-amber-500/20 flex flex-col items-center justify-center text-center h-[100px]">
                        {initialLoading ? (
                            <div className="w-16 h-8 bg-amber-500/10 rounded animate-pulse mb-1" />
                        ) : (
                            <div className="text-2xl sm:text-3xl font-display font-bold text-amber-400 mb-1">+{stats.creditsEarned}</div>
                        )}
                        <div className="text-[10px] sm:text-xs text-amber-200 uppercase tracking-wider">Credits Earned</div>
                    </div>
                </div>
            </div>

            {/* Referral List */}
            {(initialLoading || total > 0) && (
                <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md min-h-[200px]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Referral History
                            </h4>
                            {!initialLoading && (
                                <div className="flex items-center gap-4">
                                    <div className="text-xs text-slate-500 hidden sm:block">
                                        Showing {list.length} of {total} records
                                    </div>
                                    <button
                                        onClick={() => loadList(page)}
                                        disabled={loading}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Refresh History"
                                    >
                                        <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {initialLoading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between items-center animate-pulse">
                                        <div className="w-1/4 h-4 bg-white/5 rounded" />
                                        <div className="w-1/4 h-4 bg-white/5 rounded" />
                                        <div className="w-1/6 h-4 bg-white/5 rounded" />
                                        <div className="w-1/6 h-4 bg-white/5 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-white/5">
                                            <th className="px-6 py-4 font-medium">Date</th>
                                            <th className="px-6 py-4 font-medium">Friend</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium text-right">Reward</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {list.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                                                    {new Date(item.createdAt).toLocaleString(undefined, {
                                                        year: 'numeric',
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-white font-medium">
                                                    {item.inviteeEmail}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        Completed
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-right text-amber-400 font-bold font-mono">
                                                    +{REFERRAL_BONUS}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* Pagination */}
                        {!initialLoading && totalPages > 1 && (
                            <div className="flex justify-between items-center p-4 border-t border-white/10 bg-white/5">
                                <div className="text-xs text-slate-500">
                                    Page {page} of {totalPages}
                                </div>
                                <Pagination 
                                    currentPage={page} 
                                    totalPages={totalPages} 
                                    onPageChange={(p) => loadList(p)} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
