"use client";

import * as React from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "fable-demo-banner-dismissed";

/**
 * Global demo / INTERNAL DRAFT banner. Mounted in the root layout so it appears
 * on every page. Dismiss is session-only (re-appears each session) so it can
 * never be permanently hidden in the starter.
 */
export function DemoBanner({
  message = "INTERNAL DRAFT — demo only. Content, pricing, and proof are [Sample] placeholders. Forms do not submit anywhere.",
}: {
  message?: string;
}) {
  const [dismissed, setDismissed] = React.useState(true);

  React.useEffect(() => {
    setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Demo notice"
      className="z-banner sticky top-0 flex items-center justify-center gap-3 bg-warning px-4 py-2 text-center text-sm font-medium text-warning-foreground"
    >
      <p className="m-0">{message}</p>
      <button
        type="button"
        aria-label="Dismiss demo notice"
        onClick={() => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setDismissed(true);
        }}
        className="rounded-sm p-1 opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
