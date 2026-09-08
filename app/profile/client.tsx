"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileView } from "../../components/ProfileView";
import { useApp } from "../../contexts/AppContext";
import { User } from "../../types";
import { trackEvent } from "../../services/analytics";

export default function ProfilePageClient() {
  const router = useRouter();
  const { user, setUser, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Or a loading spinner while redirecting
  }

  const handleSaved = (updatedUser: User) => {
    trackEvent('update_profile', { zodiac: updatedUser.zodiac });
    setUser(updatedUser);
  };

  return (
    <ProfileView user={user} onSaved={handleSaved} />
  );
}
