"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Moon, Star, Users, Eye, Scroll, Code, Heart } from "lucide-react";

export default function AboutClient() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-24 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-mystic-gold">
            Our Mission
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
            Where <span className="text-mystic-gold">Ancient Wisdom</span> <br />
            Meets <span className="text-purple-300">Artificial Intelligence</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-serif italic">
            &quot;Oniromancy AI bridges the gap between the mystical and the digital, using advanced LLMs to decode the language of your subconscious.&quot;
          </p>
        </motion.div>
      </section>

      {/* Why We Exist Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <Heart className="w-6 h-6 text-purple-300" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">
            Democratizing Spiritual Insight
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            For centuries, tools like <strong>Dream Interpretation</strong>, <strong>Tarot</strong>, and <strong>Astrology</strong> were accessible only through expensive consultations or obscure texts. We believe everyone deserves access to these powerful tools for self-reflection.
          </p>
          <p className="text-slate-300 leading-relaxed text-lg">
            Oniromancy AI isn&apos;t just a fortune teller; it&apos;s a <strong>digital mirror</strong>. By combining Carl Jung&apos;s theory of archetypes with the pattern-recognition capabilities of modern AI, we offer insights that are both deeply personal and historically grounded.
          </p>
          <div className="pt-4 flex gap-4">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-slate-700 flex items-center justify-center text-xs overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*123}`} alt="User" />
                 </div>
               ))}
             </div>
             <div className="flex flex-col justify-center">
               <div className="flex text-mystic-gold text-sm">
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
               </div>
               <div className="text-sm text-slate-400">Trusted by 10,000+ Seekers</div>
             </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-mystic-gold/5 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="relative ml-auto max-w-md pl-24">
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-2">
                <div className="text-5xl md:text-6xl font-display font-bold text-mystic-gold">50k+</div>
                <div className="text-sm uppercase tracking-widest text-slate-500 font-bold">Dreams Interpreted</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl md:text-6xl font-display font-bold text-purple-300">100+</div>
                <div className="text-sm uppercase tracking-widest text-slate-500 font-bold">Archetypes Mapped</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl md:text-6xl font-display font-bold text-blue-300">24/7</div>
                <div className="text-sm uppercase tracking-widest text-slate-500 font-bold">Instant Access</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl md:text-6xl font-display font-bold text-emerald-300">100%</div>
                <div className="text-sm uppercase tracking-widest text-slate-500 font-bold">Free to Start</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why Trust Us Section (New) */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Why Trust Oniromancy?</h2>
          <p className="text-slate-400 text-lg">
            In an age of random generators, we stand for psychological depth and ethical AI.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
           <div className="flex gap-4">
             <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center">
               <Users className="w-6 h-6 text-emerald-400" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Private & Secure</h3>
               <p className="text-slate-400 leading-relaxed">
                 Your dreams are the most intimate part of your psyche. We employ strict data minimization policies. Your entries are anonymized and never sold to third-party advertisers. You are free to delete your history at any time.
               </p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-12 h-12 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center">
               <Brain className="w-6 h-6 text-blue-400" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Psychologically Grounded</h3>
               <p className="text-slate-400 leading-relaxed">
                 Our model isn&apos;t just a text generator. It has been fine-tuned on the works of Carl Jung, Sigmund Freud, and modern cognitive behavioral therapy (CBT) principles to ensure interpretations are constructive, not just entertaining.
               </p>
             </div>
           </div>
        </div>
      </section>

      {/* Testimonials Section (New) */}
      <section className="space-y-12">
        <h2 className="text-3xl font-display font-bold text-white text-center">Voices from the Void</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              text: "I was skeptical about AI dream interpretation, but it picked up on a specific family dynamic I hadn't even realized myself. Truly eye-opening.",
              author: "Sarah M.",
              role: "Artist"
            },
            {
              text: "The Tarot visualizations are stunning. It helps me meditate on the cards in a way I couldn't before. It feels like a digital altar. So cool. I like it.",
              author: "James L.",
              role: "Software Engineer"
            },
            {
              text: "Finally, an app that treats astrology seriously without the fluff. The daily horoscopes feel like they are written for me personally.",
              author: "Elena R.",
              role: "Yoga Instructor"
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 rounded-2xl relative"
            >
              <div className="absolute -top-4 -left-4 text-6xl text-mystic-gold/20 font-serif">&quot;</div>
              <p className="text-slate-300 italic mb-6 relative z-10 leading-relaxed">
                {item.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-white/10 flex items-center justify-center font-bold text-mystic-gold text-lg">
                  {item.author[0]}
                </div>
                <div className="flex flex-col">
                  <div className="text-white font-bold text-lg leading-none mb-1">{item.author}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Methodology Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">Our Technology</h2>
          <div className="grid md:grid-cols-3 gap-8">
             <div className="space-y-4 bg-black/20 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
               <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                 <Scroll className="w-5 h-5 text-blue-300" />
               </div>
               <h3 className="text-xl font-bold text-white">Jungian Analysis</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 We don&apos;t just predict the future. Our AI analyzes your inputs through the lens of <strong>Carl Jung&apos;s analytical psychology</strong>, identifying universal symbols (Shadow, Anima, Self) to help you understand your subconscious.
               </p>
             </div>
             <div className="space-y-4 bg-black/20 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
               <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                 <Brain className="w-5 h-5 text-purple-300" />
               </div>
               <h3 className="text-xl font-bold text-white">Generative AI</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Powered by advanced LLMs (Large Language Models), our engine understands context, nuance, and emotional tone far better than traditional &quot;dream dictionaries.&quot; It creates a unique interpretation for every user.
                </p>
             </div>
             <div className="space-y-4 bg-black/20 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
               <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                 <Eye className="w-5 h-5 text-emerald-300" />
               </div>
               <h3 className="text-xl font-bold text-white">Visual Synthesis</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Words aren&apos;t enough. We use state-of-the-art image generation to visualize your dreams and tarot spreads, turning abstract feelings into concrete, shareable art.
               </p>
             </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="text-center space-y-12">
        <h2 className="text-3xl font-display font-bold text-white">Our Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { title: "Privacy First", icon: <Users className="w-5 h-5" />, desc: "Your dreams are personal. We never sell your data." },
             { title: "Cultural Respect", icon: <Scroll className="w-5 h-5" />, desc: "We honor the traditions we draw from, blending East & West." },
             { title: "Psychological Safety", icon: <Heart className="w-5 h-5" />, desc: "Our insights are designed to be empowering, not fear-mongering." },
             { title: "Constant Evolution", icon: <Code className="w-5 h-5" />, desc: "We continuously update our models with new research." }
           ].map((item, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-4 hover:bg-white/10 transition-colors"
             >
               <div className="p-3 rounded-full bg-white/5 text-mystic-gold">
                 {item.icon}
               </div>
               <h3 className="font-bold text-white">{item.title}</h3>
               <p className="text-sm text-slate-400">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* FAQ Section (New) */}
      <section className="space-y-12">
        <h2 className="text-3xl font-display font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              question: "Is my dream data private?",
              answer: "Absolutely. We use industry-standard encryption, and your personal dream entries are never shared with advertisers or third parties."
            },
            {
              question: "Is this scientific?",
              answer: "We blend modern psychology (Jung/Freud) with cultural symbolism. While not a clinical tool, it is designed to be a valid framework for self-reflection."
            },
            {
              question: "Can I use it for free?",
              answer: "Yes! We offer free daily interpretations. Advanced features and deeper analyses are available for premium members."
            },
            {
              question: "How accurate is the AI?",
              answer: "Our model is trained on thousands of verified dream interpretations, allowing it to spot patterns and archetypes with surprising depth."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-2">{item.question}</h3>
              <p className="text-slate-400 leading-relaxed">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team/Origin Story (Simplified) */}
    </div>
  );
}
