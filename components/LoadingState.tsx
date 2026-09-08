import React from 'react';
import { LoadingStage } from '../types';

interface LoadingStateProps {
  stage: LoadingStage;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ stage }) => {
  const getMessage = () => {
    switch (stage) {
      case LoadingStage.INTERPRETING:
        return "Deciphering Hidden Symbols...";
      case LoadingStage.VISUALIZING:
        return "Consulting the Creative Ether...";
      case LoadingStage.PAINTING:
        return "Materializing the Vision...";
      default:
        return "Awakening...";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto min-h-[400px] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      
      {/* Mystical Circle Loader */}
      <div className="relative w-32 h-32 mb-12">
        {/* Outer Ring */}
        <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-0 border-t border-purple-400 rounded-full animate-[spin_2s_linear_infinite]"></div>
        
        {/* Inner Ring */}
        <div className="absolute inset-4 border border-indigo-500/30 rounded-full animate-[spin_5s_reverse_infinite]"></div>
        <div className="absolute inset-4 border-b border-indigo-400 rounded-full animate-[spin_3s_reverse_infinite]"></div>

        {/* Center Core */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_25px_10px_rgba(168,85,247,0.6)] animate-pulse"></div>
        </div>
      </div>
      
      <h3 className="text-3xl font-display text-transparent bg-clip-text bg-linear-to-r from-purple-200 to-white mb-3 animate-pulse">
        {getMessage()}
      </h3>
      
      <p className="text-slate-500 font-serif italic">
        &quot;The dream realm is shifting...&quot;
      </p>
    </div>
  );
};