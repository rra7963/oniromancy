"use client";

import React from "react";
import { HistoryView } from "../../components/HistoryView";
import { useApp } from "../../contexts/AppContext";
import { useRouter } from "next/navigation";
import { DreamResult } from "../../types";
import { trackEvent } from "../../services/analytics";

export default function HistoryPageClient() {
  const { user, isLoading } = useApp();
  const router = useRouter();

  // Use effect for redirection if user is missing
  React.useEffect(() => {
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
    return null;
  }

  const handleSelectDream = (dream: DreamResult) => {
    // Navigate to dream detail page (Home with dreamId param)
    trackEvent('view_dream', { dream_id: dream.id, source: 'history' });
    router.push(`/?dreamId=${dream.id}`);
  };

  return (
    <HistoryView 
      user={user} 
      onSelectDream={handleSelectDream} 
    />
  );
}
