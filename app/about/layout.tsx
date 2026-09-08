import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Oniromancy AI | The Science of Dream Interpretation",
  description: "Discover how Oniromancy AI combines Jungian psychology, Tarot symbolism, and advanced Artificial Intelligence to help you decode your subconscious mind.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
