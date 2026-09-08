import { Metadata } from "next";
import ProfilePageClient from "./client";

export const metadata: Metadata = {
  title: "Profile | Oniromancy AI",
  description: "Manage your profile, update your birth chart details, and view your subscription status.",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
