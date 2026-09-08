import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface ProfileGuidanceBannerProps {
  user: User;
}

export const ProfileGuidanceBanner: React.FC<ProfileGuidanceBannerProps> = ({ user }) => {
  // Check if profile is incomplete
  if (user.birthDate && user.birthTime && user.birthPlace) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-3xl mx-auto mb-12 p-[1px] bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent rounded-xl" 
    > 
       <div className="bg-mystic-900/60 backdrop-blur border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden group"> 
          <div className="absolute inset-0 bg-mystic-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" /> 
          <div className="flex items-center gap-4 relative z-10"> 
             <div className="p-3 bg-mystic-gold/10 rounded-full shrink-0"> 
                <Star className="w-5 h-5 text-mystic-gold" /> 
             </div> 
             <div className="text-center sm:text-left"> 
                <h4 className="text-white font-bold text-sm mb-1">Align Your Stars</h4> 
                <p className="text-slate-400 text-xs max-w-md">Complete your birth chart (Date, Time, Location) for precise astronomical predictions tailored to your unique energy.</p> 
             </div> 
          </div> 
          <Link href="/profile" className="relative z-10 px-5 py-2 bg-mystic-gold text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap flex items-center gap-2 shadow-lg shadow-amber-500/20"> 
             Complete Profile <ArrowRight className="w-3 h-3" /> 
          </Link> 
       </div> 
    </motion.div> 
  );
};
