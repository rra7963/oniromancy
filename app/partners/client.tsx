"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Coins, Copy, Check, Wand2, Zap, Brain, Youtube, Instagram, Twitter } from "lucide-react";
import clsx from "clsx";

export default function PartnersClient() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: 'tiktok',
    handle: '',
    customRef: ''
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate link');
      }

      const link = `https://www.oniromancy.com/?ref=${data.refCode}`;
      setGeneratedLink(link);
      setSuccessMessage(data.message || 'You are initiated!');
      setFormState('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setFormState('idle');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Global Background Elements */}
      <div className="fixed inset-0 bg-[#020205] -z-20" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-50 mix-blend-screen" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30" />

      <div className="max-w-6xl mx-auto space-y-32 pb-20 px-4 pt-12">
        {/* Hero Section */}
        <section className="text-center space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-mystic-gold/10 border border-mystic-gold/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-mystic-gold" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-mystic-gold">Partner Program</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight drop-shadow-2xl leading-[1.1]">
              Weave the <span className="text-transparent bg-clip-text bg-gradient-to-r from-mystic-gold to-[#F5E1A4]">Dream</span><br />
              Share the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Reward</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-serif italic opacity-90">
              &quot;Join our circle of mystics and guides. Help others unlock their subconscious while building your own abundance.&quot;
            </p>

            <div className="mt-10">
              <button 
                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 hover:scale-105"
              >
                <span className="text-mystic-gold font-bold tracking-wide">Start Earning</span>
                <Wand2 className="w-4 h-4 text-mystic-gold group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-mystic-gold/50 transition-all" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Benefits Grid */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Coins,
              title: "30% Revenue Share",
              desc: "Earn a generous 30% commission on every subscription and credit pack purchased through your link, recurring for the first 12 months.",
              color: "text-yellow-400"
            },
            {
              icon: Zap,
              title: "Complimentary Access",
              desc: "Active partners receive complimentary Pro Initiate status to generate unlimited dream interpretations for content creation.",
              color: "text-purple-400"
            },
            {
              icon: Brain,
              title: "AI-Powered Conversion",
              desc: "Our unique AI visualizer converts curiosity into purchases effectively. Users don't just read interpretations; they see them.",
              color: "text-blue-400"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-[#0B0C15]/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm hover:bg-[#0B0C15]/80 transition-all duration-500 hover:border-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-white mb-4 relative z-10">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* How it Works */}
        <section className="relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Simple steps to start your journey as an Oracle Ambassador.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent -z-10" />

            {[
              { step: "01", title: "Join", desc: "Fill out the form below to instantly generate your unique tracking link." },
              { step: "02", title: "Share", desc: "Create content about dreams and share your link in your bio or description." },
              { step: "03", title: "Earn", desc: "Track your earnings in real-time and get paid monthly via PayPal, Stripe or Bank Transfer." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center relative"
              >
                <div className="w-20 h-20 mx-auto bg-[#0B0C15] border border-mystic-gold/30 rounded-full flex items-center justify-center text-2xl font-display font-bold text-mystic-gold mb-8 shadow-[0_0_30px_rgba(212,175,55,0.15)] z-10 relative">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Application Form Section */}
        <section id="application-form" className="relative max-w-2xl mx-auto">
          {/* Decorative Elements */}
          <div className="absolute -inset-1 bg-gradient-to-r from-mystic-gold/20 via-purple-500/20 to-mystic-gold/20 rounded-[2rem] blur-xl opacity-50" />
          
          <div className="relative bg-[#0B0C15]/90 border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-white mb-3">Join the Circle</h2>
            <p className="text-slate-400">Generate your unique referral link instantly.</p>
          </div>

          <AnimatePresence mode="wait">
            {formState !== 'success' ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {errorMessage && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-[#0B0C15] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mystic-gold/50 focus:border-transparent transition-all shadow-inner"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Email</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-[#0B0C15] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mystic-gold/50 focus:border-transparent transition-all shadow-inner"
                      placeholder="contact@email.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Primary Platform</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: 'tiktok', name: 'TikTok', icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                        </svg>
                      )},
                      { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4" /> },
                      { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
                      { id: 'twitter', name: 'Twitter / X', icon: <Twitter className="w-4 h-4" /> }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({...formData, platform: p.id})}
                        className={clsx(
                          "px-2 py-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-2 hover:scale-105 active:scale-95",
                          formData.platform === p.id 
                            ? "bg-mystic-gold text-black border-mystic-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                            : "bg-[#0B0C15] text-slate-400 border-white/10 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {p.icon}
                        <span className="text-xs">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Handle / Channel</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">@</span>
                    <input
                      required
                      type="text"
                      className="w-full bg-[#0B0C15] border border-white/10 rounded-xl pl-8 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mystic-gold/50 focus:border-transparent transition-all shadow-inner"
                      placeholder="username"
                      value={formData.handle}
                      onChange={e => setFormData({...formData, handle: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                    Custom Referral Code <span className="text-slate-600 normal-case font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0B0C15] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mystic-gold/50 focus:border-transparent transition-all shadow-inner"
                    placeholder={formData.handle ? formData.handle.replace(/[^a-zA-Z0-9]/g, '') : "Leave empty to use handle"}
                    value={formData.customRef}
                    onChange={e => setFormData({...formData, customRef: e.target.value})}
                  />
                  <p className="text-xs text-slate-500 pl-1">This will be the end of your link: www.oniromancy.com/?ref=<b>code</b></p>
                </div>

                <button
                  disabled={formState === 'submitting'}
                  type="submit"
                  className="w-full bg-gradient-to-r from-mystic-gold via-[#F5E1A4] to-mystic-gold bg-[length:200%_auto] animate-gradient text-black font-bold text-lg py-4 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {formState === 'submitting' ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Conjuring Link...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Generate Oracle Link
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-4">
                  Already a partner? Enter your email above to retrieve your link.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 py-8"
              >
                <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                  <Check className="w-12 h-12 text-green-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-display font-bold text-white">{successMessage}</h3>
                  <p className="text-slate-400">Here is your unique tracking link.</p>
                </div>

                <div className="bg-[#0B0C15] border border-white/10 rounded-2xl p-5 flex items-center gap-3 max-w-md mx-auto shadow-inner relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-mystic-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <code className="flex-1 text-left text-mystic-gold font-mono text-sm truncate relative z-10">
                    {generatedLink}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white relative z-10"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 text-sm text-blue-200/80 max-w-md mx-auto text-left flex gap-4 backdrop-blur-sm">
                  <div className="shrink-0 pt-0.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300">i</div>
                  </div>
                  <div>
                    <p className="font-bold mb-2 text-blue-200">Payment & Retrieval:</p>
                    <ul className="space-y-2 opacity-80">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500/50 mt-1.5">•</span>
                        <span>We support payouts via <b>PayPal, Stripe, or Bank Transfer</b>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500/50 mt-1.5">•</span>
                        <span>Please email <a href="mailto:partners@oniromancy.com" className="text-white hover:text-mystic-gold transition-colors underline decoration-white/30 underline-offset-4">partners@oniromancy.com</a> with your preferred method after your first sale.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500/50 mt-1.5">•</span>
                        <span><b>Lost your link?</b> Just fill out this form with your email again to retrieve it!</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFormState('idle');
                    setFormData({ ...formData, customRef: '' }); // Clear custom ref for next entry
                  }}
                  className="text-slate-500 hover:text-white text-sm transition-colors py-2"
                >
                  Generate another link
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
    </div>
  );
}
