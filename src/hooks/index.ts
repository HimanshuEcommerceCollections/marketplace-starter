"use client";

import { analytics } from "@/lib/analytics/analytics";

export { useFlag as useFeatureFlag, useFlags } from "@/lib/flags/useFlag";
export { useBrand } from "@/components/layout/brand-provider";
export { useBookingDraft } from "@/components/booking/booking-provider";

/** Typed analytics helpers for client components. */
export function useAnalytics() {
  return analytics;
}
