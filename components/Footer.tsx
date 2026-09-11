"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Instagram, Facebook, Mail, ArrowRight, Check } from "lucide-react";
import { subscribeToNewsletter } from "../app/actions/newsletter";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.901 3h3.654l-7.985 9.126 9.393 12.419h-7.355l-5.759-7.533-6.592 7.533H.546l8.455-9.667L0 3h7.527l5.26 6.958L18.901 3Zm-1.282 19.37h2.025L6.504 5.11H4.328l13.291 17.26Z" />
  </svg>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    
    try {
      const result = await subscribeToNewsletter(email);

      if (result.success) {
        setStatus('success');
        setEmail("");
      } else {
        console.error('Subscription error:', result.error);
        setStatus('error');
      }
    } catch (e) {
      console.error('Subscription error:', e);
      setStatus('error');
    }
  };

  return (
    <footer className="app-web-footer w-full bg-black/40 backdrop-blur-xl border-t border-white/5 pt-10 pb-8 md:pt-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-1 space-y-6 text-center lg:text-left">
            <Link
              href="/"
              className="flex items-center justify-center lg:justify-start gap-2 group"
            >
              <Sparkles className="w-6 h-6 text-mystic-gold group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-display font-bold tracking-wider text-white">
                ONIROMANCY
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              Your digital gateway to the subconscious. Blending ancient
              archetypes with modern intelligence to illuminate your path.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <a
                href="https://www.tiktok.com/@oniromancy_"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white hover:border-white/20 border border-transparent transition-all duration-300"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/oniromancy"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white hover:border-white/20 border border-transparent transition-all duration-300"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/_oniromancy"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61585929398365"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">
              Explore
            </h3>
            <ul className="space-y-4 w-full max-w-[120px] md:max-w-none">
              <li>
                <Link
                  href="/horoscope"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Horoscope
                </Link>
              </li>
              <li>
                <Link
                  href="/tarot"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Tarot
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Dreams
                </Link>
              </li>
              {[
                { href: "/divination", label: "All Divination" },
                { href: "/bazi", label: "BaZi" },
                { href: "/i-ching", label: "I Ching" },
                { href: "/name-analysis", label: "Name Reading" },
                { href: "/name-generator", label: "Name Generator" },
                { href: "/love-match", label: "Love Match" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/history"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Grimoire
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1 flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">
              Resources
            </h3>
            <ul className="space-y-4 w-full max-w-[120px] md:max-w-none">
              <li>
                <Link
                  href="/faq"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Partners
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/symbolism-guide"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Dream Dictionary
                </Link>
              </li>
              <li>
                <Link
                  href="/tarot-meanings"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Tarot Meanings
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-mystic-gold transition-colors text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 text-center lg:text-left">
              Join the Circle
            </h3>
            <p className="text-slate-400 text-sm mb-4 text-center lg:text-left">
              Receive weekly insights and celestial updates directly to your
              inbox.
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto lg:mx-0">
              {status === "success" ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3 text-green-400">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Welcome to the circle.
                  </span>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-mystic-gold/50 transition-colors"
                      disabled={status === "loading"}
                      autoComplete="off"
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    disabled={status === "loading"}
                    className="w-full bg-mystic-gold text-black font-bold text-sm py-2.5 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      "Joining..."
                    ) : (
                      <>
                        Subscribe <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  {status === "error" && (
                    <p className="text-red-400 text-xs text-center lg:text-left">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Oniromancy AI. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
