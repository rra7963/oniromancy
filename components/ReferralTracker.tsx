"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function Tracker() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for both 'ivt' (new standard) and 'ref' (legacy)
    const ivt = searchParams.get("ivt");
    const ref = searchParams.get("ref");
    const code = ivt || ref;

    if (code) {
      // Store referral code in cookie for 30 days as 'ivt_code' (used by auth flows)
      const date = new Date();
      date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      document.cookie = `ivt_code=${code}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

      // Clean up URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("ivt");
      newParams.delete("ref");
      const newUrl = newParams.toString() 
        ? `${pathname}?${newParams.toString()}`
        : pathname;
      
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return null;
}

export function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
