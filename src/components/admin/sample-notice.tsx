import * as React from "react";
import { SampleBadge } from "@/components/shared/sample-badge";
import { cn } from "@/lib/utils";

export interface SampleNoticeProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Page-level banner reinforcing the [Sample] rule across dense admin tables,
 * where per-cell badges would be impractical on every value.
 */
export function SampleNotice({ className, children }: SampleNoticeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground",
        className,
      )}
    >
      <SampleBadge />
      <span>
        {children ??
          "All bookings, clients, metrics, and prices shown are illustrative draft data."}
      </span>
    </div>
  );
}
