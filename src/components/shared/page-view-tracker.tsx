"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics/analytics";

/** Fires page_view on every route change. Mounted once in the root layout. */
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    analytics.pageView({ path: pathname });
  }, [pathname]);
  return null;
}
