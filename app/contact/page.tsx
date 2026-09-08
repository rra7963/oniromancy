"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitContactForm } from "../actions/contact";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      await submitContactForm(formState);
      setStatus('success');
      setFormState({ name: "", email: "", subject: "General Inquiry", message: "" });
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error(error);
      setStatus('idle');
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <section className="text-center space-y-6 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-mystic-gold">
            Support
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Contact the <span className="text-indigo-300">Oracle</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-serif italic">
            Questions about your journey? Technical issues with the grimoire? We are here to help.
          </p>
        </motion.div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6 font-display">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Email Us</div>
                  <div className="text-slate-400 text-sm">support@oniromancy.com</div>
                  <div className="text-slate-500 text-xs mt-1">Response within 24 hours</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Live Chat</div>
                  <div className="text-slate-400 text-sm">Available for Premium Members</div>
                  <div className="text-slate-500 text-xs mt-1">Mon-Fri, 9am - 5pm EST</div>
                </div>
              </div>

               <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Ethereal Plane</div>
                  <div className="text-slate-400 text-sm">123 Astral Ave, Suite 777</div>
                  <div className="text-slate-500 text-xs mt-1">Digital Realm</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl"
          >
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Message Received</h3>
                <p className="text-slate-300 mb-8">
                  Your inquiry has been sent to our support team. We will gaze into the crystal ball and get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Name</label>
                    <input
                      required
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-400/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Email</label>
                    <input
                      required
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-400/50 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Subject</label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({...formState, subject: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-400/50 transition-colors appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Account Support</option>
                    <option>Technical Issue</option>
                    <option>Feature Request</option>
                    <option>Partnership</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-400/50 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
