"use client";

import React, { useEffect, Suspense } from "react";
import { OrderView } from "../../components/OrderView";
import { useApp } from "../../contexts/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUser } from "../../services/storage";
import { trackEvent } from "../../services/analytics";
import toast from "react-hot-toast";

function PaymentHandler({
  user,
  setUser,
  onHistoryRefresh,
}: {
  user: any;
  setUser: (u: any) => void;
  onHistoryRefresh: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledRef = React.useRef(false);

  useEffect(() => {
    const success = searchParams.get('success');
    if (!success || !user) return;
    if (handledRef.current) return;
    handledRef.current = true;

    // Show immediate success feedback
    toast.success("Payment successful! Updating your credits...", {
      duration: 4000,
      style: {
        background: '#1F2937',
        color: '#fff',
        border: '1px solid #374151',
      },
    });

    trackEvent('purchase', { status: 'success' });
    // Small delay to ensure webhook has processed
    const timer = setTimeout(async () => {
      try {
        const updatedUser = await getCurrentUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
        onHistoryRefresh();
      } catch (e) {
        console.error("Failed to refresh user after payment:", e);
      } finally {
        // Clean up URL
        router.replace('/orders');
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [searchParams, user, setUser, router, onHistoryRefresh]);

  return null;
}

export default function OrdersPageClient() {
  const { user, isLoading, setUser } = useApp();
  const router = useRouter();
  const [historyRefreshKey, setHistoryRefreshKey] = React.useState(0);

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
    return null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <PaymentHandler
          user={user}
          setUser={setUser}
          onHistoryRefresh={() => setHistoryRefreshKey((v) => v + 1)}
        />
      </Suspense>
      <OrderView user={user} refreshKey={historyRefreshKey} />
    </>
  );
}
