import React from 'react';

export const TarotChalice = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20 C 20 50, 30 60, 50 60 C 70 60, 80 50, 80 20 L 75 20 C 75 45, 65 55, 50 55 C 35 55, 25 45, 25 20 Z" fill="currentColor" opacity="0.8" />
    <path d="M50 60 L 50 85 M 30 85 L 70 85 M 35 85 Q 50 75 65 85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 20 L 80 20" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="35" r="5" fill="currentColor" />
    <path d="M30 30 Q 50 45 70 30" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M40 85 L 40 90 M 60 85 L 60 90" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const TarotSword = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 L 50 75" stroke="currentColor" strokeWidth="4" />
    <path d="M50 10 L 45 20 L 50 15 L 55 20 Z" fill="currentColor" />
    <path d="M30 25 L 70 25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 25 Q 50 35 70 25" stroke="currentColor" strokeWidth="1" />
    <circle cx="50" cy="25" r="3" fill="currentColor" />
    <path d="M50 75 L 50 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="90" r="4" fill="currentColor" />
    <path d="M48 15 L 48 70" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

export const TarotPentacle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3" />
    <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" />
    <path d="M50 22 L 58 45 L 82 45 L 62 60 L 70 82 L 50 68 L 30 82 L 38 60 L 18 45 L 42 45 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="50" r="5" fill="currentColor" />
    <path d="M50 15 L 50 22 M 50 78 L 50 85 M 15 50 L 22 50 M 78 50 L 85 50" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const TarotWand = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 80 L 75 20" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M30 85 L 20 75" stroke="currentColor" strokeWidth="2" />
    <path d="M70 15 L 80 25" stroke="currentColor" strokeWidth="2" />
    <path d="M45 60 L 40 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M55 45 L 65 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="40" cy="50" r="2" fill="currentColor" />
    <circle cx="65" cy="50" r="2" fill="currentColor" />
    <path d="M35 68 Q 40 60 50 65" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const TarotSun = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.3" />
    <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
    <path d="M50 20 L 50 10 M 50 80 L 50 90 M 20 50 L 10 50 M 80 50 L 90 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M29 29 L 22 22 M 71 71 L 78 78 M 29 71 L 22 78 M 71 29 L 78 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 25 Q 65 35 80 20" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="none" />
    <path d="M50 75 Q 35 65 20 80" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="none" />
  </svg>
);

export const TarotMoon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 20 C 55 20, 70 35, 70 55 C 70 75, 55 90, 35 90 C 45 80, 50 70, 50 55 C 50 40, 45 30, 35 20 Z" fill="currentColor" opacity="0.8" />
    <circle cx="70" cy="30" r="3" fill="currentColor" />
    <circle cx="80" cy="40" r="2" fill="currentColor" />
    <circle cx="75" cy="80" r="2" fill="currentColor" />
    <path d="M10 55 H 90" stroke="currentColor" strokeWidth="1" opacity="0.2" />
  </svg>
);
