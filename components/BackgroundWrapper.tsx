"use client";

import dynamic from 'next/dynamic';

const Background = dynamic(() => import('./Background').then(mod => mod.Background), {
  ssr: false,
});

export function BackgroundWrapper() {
  return <Background />;
}
