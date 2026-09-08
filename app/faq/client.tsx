"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  LucideIcon, 
  HelpCircle, 
  Shield, 
  Brain, 
  CreditCard,
  Sparkles,
  Moon,
  Wrench
} from "lucide-react";
import { trackEvent } from "../../services/analytics";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  iconName: string; 
  questions: FAQItem[];
}

interface FAQClientProps {
  faqs: FAQCategory[];
}

// Map string names to icons
const IconMap: Record<string, LucideIcon> = {
  HelpCircle,
  Shield,
  Brain,
  CreditCard,
  Sparkles,
  Moon,
  Wrench
};

// Map icons to specific colors/styles
const IconStyleMap: Record<string, string> = {
  HelpCircle: "text-blue-300 bg-blue-500/20 border-blue-500/30",
  Brain: "text-purple-300 bg-purple-500/20 border-purple-500/30",
  Sparkles: "text-amber-300 bg-amber-500/20 border-amber-500/30",
  Moon: "text-indigo-300 bg-indigo-500/20 border-indigo-500/30",
  CreditCard: "text-emerald-300 bg-emerald-500/20 border-emerald-500/30",
  Wrench: "text-slate-300 bg-slate-500/20 border-slate-500/30",
  Shield: "text-rose-300 bg-rose-500/20 border-rose-500/30",
};

export default function FAQClient({ faqs }: FAQClientProps) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    const isOpening = openIndex !== id;
    setOpenIndex(isOpening ? id : null);
    if (isOpening) {
       trackEvent('view_faq_question', { question_id: id });
    }
  };

  return (
    <div className="min-h-screen w-full relative">
       {/* Ambient Background Lights */}
       <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-mystic-gold shadow-lg shadow-black/20">
              Knowledge Base
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
              Frequently Asked <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mystic-gold via-amber-200 to-mystic-gold animate-shimmer bg-[length:200%_100%]">
                Questions
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-serif italic">
              &quot;The only way to discover the limits of the possible is to go beyond them into the impossible.&quot;
            </p>
          </motion.div>
        </section>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqs.map((cat, catIdx) => {
            const Icon = IconMap[cat.iconName] || HelpCircle;
            const iconStyle = IconStyleMap[cat.iconName] || IconStyleMap.HelpCircle;
            
            return (
              <motion.section
                key={catIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
              >
                {/* Decorative gradient inside card */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none opacity-50" />
                
                <div className="relative p-6 md:p-8">
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${iconStyle}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-wide">
                      {cat.category}
                    </h2>
                  </div>
                  
                  {/* Questions List */}
                  <div className="space-y-2">
                    {cat.questions.map((faq, idx) => {
                      const id = `${catIdx}-${idx}`;
                      const isOpen = openIndex === id;
                      
                      return (
                        <div 
                          key={idx}
                          className={`group border-b border-white/5 last:border-0 rounded-lg transition-colors duration-300 ${isOpen ? 'bg-white/5 border-transparent' : 'hover:bg-white/[0.02]'}`}
                        >
                          <button
                            onClick={() => toggleFAQ(id)}
                            className="w-full py-4 px-4 flex items-start justify-between text-left gap-4"
                          >
                            <span className={`text-lg transition-colors duration-300 ${isOpen ? 'text-mystic-gold font-medium' : 'text-slate-300 group-hover:text-white'}`}>
                              {faq.q}
                            </span>
                            <span className={`mt-1.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                              <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-mystic-gold' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            </span>
                          </button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="px-4 pb-6 text-slate-400 leading-relaxed pr-8 font-light">
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
