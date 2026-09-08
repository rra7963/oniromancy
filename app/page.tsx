"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LandingView } from "../components/LandingView";
import {
  getDreamById,
} from "../services/storage";
import {
  DreamResult,
  LoadingStage,
  CREDIT_COSTS,
} from "../types";
import { useApp } from "../contexts/AppContext";
import { analyzeDreamAction, visualizeDreamAction } from "./actions/dream";
import { trackEvent } from "../services/analytics";
import { softwareAppJsonLd } from "./json-ld";

function HomeContent() {
  const router = useRouter();
  const { user, setUser } = useApp();
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(
    LoadingStage.IDLE
  );
  const [currentResult, setCurrentResult] = useState<DreamResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const lastFetchedDreamId = React.useRef<string | null>(null);

  useEffect(() => {
    // Capture Referral Code
    const ivt = searchParams.get('ivt');
    if (ivt) {
      const d = new Date();
      d.setTime(d.getTime() + (30*24*60*60*1000)); // 30 days
      document.cookie = `ivt_code=${ivt};expires=${d.toUTCString()};path=/`;
    }
  }, [searchParams]);

  useEffect(() => {
    const dreamId = searchParams.get('dreamId');

    // If dreamId exists and matches current result, ensure we are in COMPLETE state
    if (dreamId && currentResult?.id === dreamId) {
      if (loadingStage !== LoadingStage.COMPLETE) {
        setTimeout(() => setLoadingStage(LoadingStage.COMPLETE), 0);
      }
      return;
    }

    if (dreamId) {
      // Prevent loop if already loading or if we already tried this dreamId
      if (loadingStage === LoadingStage.PAINTING) return;
      if (lastFetchedDreamId.current === dreamId) return;

      lastFetchedDreamId.current = dreamId;

      // Use setTimeout to avoid synchronous setState warning.
      // We use a functional update to check if we are still in a state that needs loading
      // (in case the fetch finished incredibly fast, e.g. from cache).
      setTimeout(() => {
        setLoadingStage(prev => {
          if (prev === LoadingStage.COMPLETE) return prev;
          return LoadingStage.PAINTING;
        });
      }, 0);

      getDreamById(dreamId).then(dream => {
        if (dream) {
          setCurrentResult(dream);
          setLoadingStage(LoadingStage.COMPLETE);
          trackEvent('view_dream', { dream_id: dream.id });
        } else {
           // Invalid ID or not found
           setError("Dream not found");
           setLoadingStage(LoadingStage.IDLE);
           
           // Clear invalid dreamId from URL
           const newUrl = new URL(window.location.href);
           newUrl.searchParams.delete('dreamId');
           router.replace(newUrl.pathname + newUrl.search, { scroll: false });
           
           // Auto-dismiss error
           setTimeout(() => setError(null), 3000);
        }
      }).catch(err => {
         console.error(err);
         setError(err instanceof Error ? err.message : "Failed to load dream");
         setLoadingStage(LoadingStage.ERROR);

         // Clear invalid dreamId from URL
         const newUrl = new URL(window.location.href);
         newUrl.searchParams.delete('dreamId');
         router.replace(newUrl.pathname + newUrl.search, { scroll: false });

         // Auto-dismiss error
         setTimeout(() => setError(null), 3000);
      });
    }
  }, [searchParams, currentResult, loadingStage]);

  const isGenerating =
    loadingStage !== LoadingStage.IDLE &&
    loadingStage !== LoadingStage.COMPLETE &&
    loadingStage !== LoadingStage.ERROR;

  const handleDreamSubmit = async (dreamText: string) => {
    // Immediate scroll attempt
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    if (!user) {
      router.push("/auth");
      return;
    }

    // Client-side pre-check for UX (real check is on server)
    const COST = CREDIT_COSTS.DREAM_ANALYSIS;
    if (user.credits < COST) {
      trackEvent('begin_checkout', { from: 'dream_analysis', reason: 'insufficient_credits' });
      router.push("/pricing"); 
      return;
    }

    trackEvent('analyze_dream', { length: dreamText.length });
    setError(null);
    setLoadingStage(LoadingStage.INTERPRETING);
    setCurrentResult(null);

    // Force scroll to top again after state update to handle Firefox layout shifts
    setTimeout(() => {
       window.scrollTo(0, 0);
       document.documentElement.scrollTop = 0;
       document.body.scrollTop = 0;
    }, 100);

    try {
      // 1. Analyze (Server deducts credits & saves to DB)
      const resultWithoutImage = await analyzeDreamAction(dreamText);

      // Optimistically update local user credits
      setUser({ ...user, credits: Math.max(0, user.credits - COST) });

      // 2. Painting Phase
      setLoadingStage(LoadingStage.PAINTING);
      
      // We can show the analysis while painting if the UI supported it,
      // but for now we follow the existing flow.
      
      // 3. Visualize (Server updates DB with image)
      const imageUrl = await visualizeDreamAction(resultWithoutImage.id, dreamText);

      const finalResult: DreamResult = {
        ...resultWithoutImage,
        imageUrl,
      };
      
      setCurrentResult(finalResult);
      // We don't set COMPLETE here directly to avoid race conditions with the URL update.
      // The useEffect above will detect the matching ID and set COMPLETE.
      
      // Update URL with dreamId so navigation works correctly
      router.push(`/?dreamId=${finalResult.id}`, { scroll: false });
      
    } catch (err: unknown) {
      console.error(err);
      let message = "The spirits remained silent. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      trackEvent('error', { type: 'dream_analysis', message });
      setError(message);
      setLoadingStage(LoadingStage.ERROR);
    }
  };

  const handleResetResult = () => {
    setCurrentResult(null);
    setLoadingStage(LoadingStage.IDLE);
    // Also remove query param if present
    const url = new URL(window.location.href);
    if (url.searchParams.has('dreamId')) {
      url.searchParams.delete('dreamId');
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Reset to landing page if URL parameters are cleared (e.g. clicking Home/Logo)
  useEffect(() => {
    const dreamId = searchParams.get('dreamId');
    if (!dreamId) {
      // Only reset if we are NOT in the middle of generating
      // We check for specific "active" states to avoid resetting during generation
      const isGeneratingState = 
        loadingStage === LoadingStage.INTERPRETING || 
        loadingStage === LoadingStage.VISUALIZING || 
        loadingStage === LoadingStage.PAINTING;

      if (!isGeneratingState && (currentResult || error || loadingStage !== LoadingStage.IDLE)) {
        setTimeout(() => {
           setCurrentResult(null);
           setLoadingStage(LoadingStage.IDLE);
           setError(null);
        }, 0);
      }
    }
  }, [searchParams, loadingStage, currentResult, error]);



  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      {error && (
        <div className="w-full max-w-lg bg-red-900/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-xl mb-8 text-center backdrop-blur-sm animate-fade-in fixed top-24 left-1/2 -translate-x-1/2 z-50">
          {error}
        </div>
      )}
      <LandingView
        user={user}
        isGenerating={isGenerating}
        loadingStage={loadingStage}
        currentResult={currentResult}
        onDreamSubmit={handleDreamSubmit}
        onResetResult={handleResetResult}
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
