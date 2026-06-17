"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvailabilityToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
}

/**
 * Small accessible switch used in the Service edit panel's AVAILABILITY group.
 * Stub-only: drives local state in the parent, no backend wiring. Tokens only —
 * on = bg-primary, off = bg-muted, sliding knob = bg-card.
 */
export function AvailabilityToggle({
  id,
  label,
  checked,
  onCheckedChange,
}: AvailabilityToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span id={`${id}-label`} className="text-sm text-foreground">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-5 rounded-full bg-card shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}
