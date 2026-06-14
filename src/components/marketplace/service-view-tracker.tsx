"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics/analytics";

/** Fires the service_view analytics event on mount. */
export function ServiceViewTracker({
  serviceId,
  category,
  price,
  currency,
}: {
  serviceId: string;
  category?: string;
  price?: number;
  currency?: string;
}) {
  useEffect(() => {
    analytics.serviceView({
      service_id: serviceId,
      category,
      displayed_price: price,
      currency,
    });
  }, [serviceId, category, price, currency]);
  return null;
}
