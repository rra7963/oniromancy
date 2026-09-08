import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
        title="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">Prev</span>
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all",
              currentPage === page
                ? "bg-mystic-gold text-black font-bold shadow-lg shadow-mystic-gold/20"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
        title="Next Page"
      >
        <span className="hidden sm:inline text-sm">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
