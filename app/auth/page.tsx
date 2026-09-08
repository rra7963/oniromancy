import { Metadata } from "next";
import AuthPageClient from "./client";

export const metadata: Metadata = {
  title: "Sign In | Oniromancy AI",
  description: "Sign in to Oniromancy AI to save your dreams, track your journey, and access premium features.",
};

export default function AuthPage() {
  return <AuthPageClient />;
}
