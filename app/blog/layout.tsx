import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosmic Blog | Oniromancy AI",
  description: "Read the latest insights on spirituality, psychology, and the mystical arts from the Oniromancy AI grimoire.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
