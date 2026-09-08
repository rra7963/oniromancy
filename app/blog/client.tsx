"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { blogPosts } from "./data";

export default function BlogClient() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-16 pb-20">
      {/* Header */}
      <section className="text-center space-y-6 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] text-mystic-gold">
            Cosmic Blog
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Chronicles of the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-mystic-gold to-purple-200">
              Subconscious
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-serif italic">
            Insights, guides, and celestial updates to illuminate your spiritual journey.
          </p>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, idx) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors"
          >
            {/* Image */}
            <div className="h-48 relative overflow-hidden bg-black">
               <Image 
                 src={post.image} 
                 alt={post.title}
                 fill
                 className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-3 font-display group-hover:text-mystic-gold transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-500 border border-white/10">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <User className="w-3 h-3" />
                  {post.author}
                </div>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-mystic-gold text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Read <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
