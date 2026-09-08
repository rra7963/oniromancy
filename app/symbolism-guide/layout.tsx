import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dream Dictionary & Symbolism Guide | Oniromancy AI",
  description: "Search our free Dream Dictionary to find meanings of common dream symbols (snakes, falling, flying, etc.). Decode your subconscious with Jungian psychology.",
  keywords: ["Dream Dictionary", "Dream Symbols", "Dream Meanings", "Dream Interpretation Guide", "Dream Encyclopedia", "Jungian Archetypes"],
  alternates: {
    canonical: "https://www.oniromancy.com/symbolism-guide",
  },
  openGraph: {
    title: "Dream Dictionary & Symbolism Guide | Oniromancy AI",
    description: "Search our free Dream Dictionary to find meanings of common dream symbols. Decode your subconscious with Jungian psychology.",
    url: "https://www.oniromancy.com/symbolism-guide",
    type: "website",
  },
};

export default function SymbolismGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
