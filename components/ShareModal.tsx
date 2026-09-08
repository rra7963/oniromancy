"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Link as LinkIcon, Check, Download } from 'lucide-react';
import { trackEvent } from '../services/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    id: string;
    title: string;
    text: string;
    url: string;
  };
  onDownload: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, result, onDownload }) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Avoid hydration mismatch
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Simple scroll lock to prevent background scrolling
      // We add padding to prevent layout shift when scrollbar disappears
      const scrollbarWidth = window.innerWidth - document.body.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // Focus the modal when it opens
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${result.text}\n\n${result.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('share_copy_link', { dream_id: result.id });
    } catch (err) {
      console.error(err);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'bg-black hover:bg-zinc-800',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.text)}&url=${encodeURIComponent(result.url)}`,
    },
    {
        name: 'Facebook',
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.411h3.045l-.502 3.667h-2.543v7.98H9.101Z" />
            </svg>
        ),
        color: 'bg-[#1877F2] hover:bg-[#1864c9]',
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(result.url)}`,
    },
    {
        name: 'WhatsApp',
        icon: (
             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
             </svg>
        ),
        color: 'bg-[#25D366] hover:bg-[#20bd5a]',
        url: `https://wa.me/?text=${encodeURIComponent(result.text + ' ' + result.url)}`,
    },
    {
        name: 'Reddit',
        icon: (
             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
             </svg>
        ),
        color: 'bg-[#FF4500] hover:bg-[#e03d00]',
        url: `https://www.reddit.com/submit?url=${encodeURIComponent(result.url)}&title=${encodeURIComponent(result.title)}`,
    }
  ];

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4 animate-fade-in">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div 
            ref={modalRef}
            tabIndex={-1}
            className="relative w-full max-w-md bg-[#0f0f13] border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-enter focus:outline-none"
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-display font-bold text-white mb-2">Share your Vision</h3>
            <p className="text-sm text-slate-400 mb-6">
                Spread the wisdom of the Oracle to your circle.
            </p>

            <div className="grid grid-cols-4 gap-4 mb-6">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group"
                        onClick={() => trackEvent('share_social', { platform: link.name, dream_id: result.id })}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110 ${link.color}`}>
                            {link.icon}
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{link.name}</span>
                    </a>
                ))}
            </div>

            {/* TikTok & Instagram Section */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                         {/* Instagram & TikTok Icons */}
                        <div className="flex -space-x-2">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center border-2 border-[#0f0f13]">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                             </div>
                             <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border-2 border-[#0f0f13]">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.62-1.12-.01 2.95-.02 5.91-.01 8.87.01 5.2-5.4 9.4-10.42 7.25-2.6-1.16-4.22-3.79-4.24-6.66-.02-2.93 1.64-5.59 4.26-6.78.69-.32 1.42-.52 2.17-.61.01 1.34 0 2.69.01 4.03-.73.07-1.45.24-2.11.62-1.52.88-2.25 2.75-1.78 4.45.53 1.9 2.53 3.12 4.48 2.73 1.84-.37 3.23-1.99 3.24-3.87V.02h.32z"/></svg>
                             </div>
                        </div>
                        <span className="text-sm text-white font-medium">TikTok & Instagram</span>
                    </div>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                    Download the card image to share on visual platforms.
                </p>
                <button 
                    onClick={onDownload}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" /> Download Image
                </button>
            </div>

            <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-xl border border-white/5">
                <input 
                    type="text" 
                    readOnly 
                    value={result.url} 
                    className="bg-transparent flex-1 text-xs text-slate-400 px-2 focus:outline-none"
                />
                <button 
                    onClick={handleCopy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        copied ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                >
                    {copied ? <Check className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
        </div>
    </div>,
    document.body
  );
};
