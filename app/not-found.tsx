import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Oniromancy AI",
  description: "You have wandered into the void. This path does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Mystical Background Elements */}
      <div className="absolute" />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h1 className="font-cinzel text-9xl text-mystic-gold opacity-20 mb-4 animate-pulse">404</h1>
        
        <div className="space-y-6">
          <h2 className="font-cinzel text-3xl md:text-4xl text-white mb-6">
            The Void Gazes Back
          </h2>
          
          <p className="font-cormorant text-xl md:text-2xl text-slate-300 leading-relaxed italic">
            &quot;You have wandered off the path known to the stars. <br/>
            This realm exists only in dreams that have been forgotten.&quot;
          </p>
          
          <div className="pt-8">
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-3 rounded-full bg-mystic-gold/10 border border-mystic-gold/30 text-mystic-gold hover:bg-mystic-gold/20 hover:scale-105 transition-all duration-300 font-cinzel tracking-wider group"
            >
              <span>Return to Reality</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Runes */}
      <div className="absolute top-1/4 left-1/4 text-white/5 text-6xl font-serif animate-pulse pointer-events-none">?</div>
      <div className="absolute bottom-1/4 right-1/4 text-white/5 text-6xl font-serif animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}>¿</div>
    </div>
  );
}
