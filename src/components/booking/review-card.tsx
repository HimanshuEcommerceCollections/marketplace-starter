import * as React from "react";
import { cn } from "@/lib/utils";

export interface ReviewCardProps {
  title: string;
  /** Shows an "Edit" button when provided (jumps back to a step). */
  onEdit?: () => void;
  /** Optional header-right content (e.g. a DRAFT badge) in place of Edit. */
  badge?: React.ReactNode;
  children: React.ReactNode;
}

/** A titled review section (header band + divided rows). Token-only. */
export function ReviewCard({ title, onEdit, badge, children }: ReviewCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {badge ??
          (onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-md text-sm font-medium text-highlight hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Edit
            </button>
          ) : null)}
      </div>
      <dl className="divide-y divide-border">{children}</dl>
    </div>
  );
}

export interface ReviewRowProps {
  label: string;
  value: React.ReactNode;
  /** Emphasize the value (e.g. the estimated total). */
  emphasis?: boolean;
}

export function ReviewRow({ label, value, emphasis }: ReviewRowProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-6 py-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "font-medium text-foreground",
          emphasis && "font-heading text-base text-highlight",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
