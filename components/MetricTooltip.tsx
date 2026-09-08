import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface MetricTooltipProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({ title, description, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer to next tick to avoid synchronous setState warning and ensure hydration match
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 12, // 12px margin above the element
        left: rect.left + rect.width / 2
      });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsOpen(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePosition();
    setIsOpen(!isOpen);
  };

  // Close on scroll to prevent floating issues
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => setIsOpen(false);
      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, [isOpen]);

  return (
    <div 
      ref={triggerRef}
      className="relative cursor-pointer group inline-block"
      onClick={handleClick} 
      onMouseLeave={() => setIsOpen(false)}
      onMouseEnter={handleMouseEnter}
    >
      {children}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "-50%", y: "-90%", scale: 0.95 }}
              animate={{ opacity: 1, x: "-50%", y: "-100%", scale: 1 }}
              exit={{ opacity: 0, x: "-50%", y: "-90%", scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                top: coords.top,
                left: coords.left,
                position: 'fixed',
              }}
              className="w-64 p-4 bg-slate-900/95 backdrop-blur-xl text-xs text-slate-200 rounded-lg shadow-xl border border-white/10 z-[9999] text-center pointer-events-none"
            >
              <div className="font-bold text-mystic-gold mb-1 uppercase tracking-wider text-[10px]">{title}</div>
              <p className="leading-relaxed">{description}</p>
              
              {/* Triangle pointer */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900/95"></div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
