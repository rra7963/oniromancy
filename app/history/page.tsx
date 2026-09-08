import { Metadata } from "next";
import HistoryPageClient from "./client";

export const metadata: Metadata = {
  title: "Grimoire | Oniromancy AI",
  description: "Your personal Grimoire. Revisit your past dream interpretations and tarot readings.",
};

export default function HistoryPage() {
  return <HistoryPageClient />;
}
