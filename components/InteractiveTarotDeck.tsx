"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Sun } from "lucide-react";

interface InteractiveTarotDeckProps {
  spreadType: 'SINGLE' | 'THREE';
  onComplete: () => void;
  isDrawing: boolean;
}

export const InteractiveTarotDeck: React.FC<InteractiveTarotDeckProps> = ({
  spreadType,
  onComplete,
  isDrawing
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const totalCards = 22; // Major Arcana count
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reset selection if spreadType changes or drawing resets
  useEffect(() => {
    if (!isDrawing) {
      const timer = setTimeout(() => setSelectedIndices([]), 0);
      return () => clearTimeout(timer);
    }
  }, [spreadType, isDrawing]);

  const handleCardClick = (index: number) => {
    if (isDrawing) return;
    
    // Allow deselection
    if (selectedIndices.includes(index)) {
      setSelectedIndices(prev => prev.filter(i => i !== index));
      return;
    }

    const limit = spreadType === 'THREE' ? 3 : 1;
    
    if (selectedIndices.length < limit) {
      const newSelection = [...selectedIndices, index];
      setSelectedIndices(newSelection);
      
      // Check if we reached the limit
      if (newSelection.length === limit) {
        // Small delay to let the user see the selection visual
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[300px] py-4 relative">
       {/* Instructions */}
       <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-indigo-200/60 text-sm mb-6 font-medium tracking-widest uppercase text-center"
      >
        {selectedIndices.length === 0 
          ? `Select ${spreadType === 'THREE' ? '3 Cards' : '1 Card'} from the deck` 
          : selectedIndices.length === (spreadType === 'THREE' ? 3 : 1) 
            ? "Gathering energy..."
            : `Select ${spreadType === 'THREE' ? 3 - selectedIndices.length : 1} more...`
        }
      </motion.p>

      {/* Deck Container - Absolute Positioning for Perfect Fit */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-4xl h-32 sm:h-44 md:h-52 lg:h-60 mx-auto px-4"
      >
          {Array.from({ length: totalCards }).map((_, i) => {
            const isSelected = selectedIndices.includes(i);
            
            // Calculate horizontal position to spread cards evenly
            // Leaving ~12% space at the end for the last card to fit
            const leftPos = (i / (totalCards - 1)) * 88; 
            
            return (
              <motion.div
                key={i}
                layoutId={`card-${i}`}
                className={clsx(
                  "absolute top-2 sm:top-4",
                  // Responsive sizing to ensure fit
                  "w-12 h-20 sm:w-16 sm:h-28 md:w-20 md:h-36 lg:w-24 lg:h-44",
                  "rounded-lg shadow-xl cursor-pointer origin-bottom transition-all duration-300"
                )}
                style={{
                    left: `${leftPos}%`,
                    zIndex: isSelected ? 100 : i + 10
                }}
                initial={{ y: 0, scale: 1 }}
                animate={{ 
                  y: isSelected ? -30 : 0, 
                  scale: isSelected ? 1.1 : 1,
                  filter: isDrawing && !isSelected ? "grayscale(1) brightness(0.5)" : "none",
                  zIndex: isSelected ? 100 : i + 10
                }}
                whileHover={!isDrawing && !isSelected ? { 
                  y: -25, 
                  scale: 1.05,
                  zIndex: 50,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                } : {}}
                onClick={() => handleCardClick(i)}
              >
                <CardBack isLoading={isDrawing && isSelected} />
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

// Reusing the exquisite card back design from TarotView
const CardBack = ({ isLoading }: { isLoading?: boolean }) => {
  return (
    <div className={clsx(
        "absolute inset-0 w-full h-full rounded-lg shadow-2xl overflow-hidden",
        "border-[1px] border-[#d4af37]/60 bg-[#1e1b2e]"
    )}>
        {/* 1. Base Layer - Deep Cosmic Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a103c] via-[#2e1065] to-[#0f0720] opacity-100"></div>
        
        {/* 2. Complex Mandala Pattern (CSS) */}
        <div className="absolute inset-0 opacity-15" 
             style={{ 
                 backgroundImage: `
                    radial-gradient(circle at 50% 50%, transparent 10%, rgba(212,175,55,0.2) 11%, transparent 12%),
                    radial-gradient(circle at 50% 50%, transparent 25%, rgba(212,175,55,0.15) 26%, transparent 27%),
                    radial-gradient(circle at 50% 50%, transparent 40%, rgba(212,175,55,0.1) 41%, transparent 42%),
                    linear-gradient(45deg, transparent 48%, rgba(212,175,55,0.1) 50%, transparent 52%),
                    linear-gradient(-45deg, transparent 48%, rgba(212,175,55,0.1) 50%, transparent 52%)
                 `,
                 backgroundSize: '100% 100%'
             }}>
        </div>

        {/* 3. Decorative Corners */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#d4af37]/60 rounded-tl"></div>
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#d4af37]/60 rounded-tr"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#d4af37]/60 rounded-bl"></div>
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#d4af37]/60 rounded-br"></div>

        {/* 4. Inner Golden Border */}
        <div className="absolute inset-1.5 border border-[#d4af37]/30 rounded-md"></div>
        
        {/* 5. Center Motif with Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className={clsx(
                  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-[#d4af37]/40 rounded-full flex items-center justify-center absolute",
                  isLoading ? "animate-spin" : "animate-spin-slow"
                )} style={{ animationDuration: isLoading ? '3s' : '20s' }}></div>
                
                <div className={clsx(
                  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-[#d4af37]/40 rounded-full flex items-center justify-center absolute rotate-45",
                   isLoading && "animate-pulse"
                )}></div>

                {/* Inner Symbol - Pulsing when loading */}
                <div className={clsx(
                  "relative z-10 text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]",
                  isLoading && "animate-pulse scale-110 duration-700"
                )}>
                   <Sun className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
            </div>
        </div>
        
        {/* 6. Loading Overlay Effect */}
        <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0f172a]/60 flex items-center justify-center backdrop-blur-[1px] z-20"
              >
                  {/* Rotating Magic Circles */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[120%] h-[60%] border border-dashed border-[#d4af37]/40 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[100%] h-[50%] border border-dotted border-indigo-400/40 rounded-full"
                  />
              </motion.div>
            )}
        </AnimatePresence>
        
        {/* 7. Subtle Shine Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 pointer-events-none"></div>
    </div>
  );
};
