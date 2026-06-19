import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Derive a single uppercase initial from a display name (its first letter).
 * Falls back to "?" when the name yields nothing usable.
 */
export function initialsFromName(name: string): string {
  const first = name.trim().charAt(0);
  return first ? first.toUpperCase() : "?";
}

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Display name used to render initials. */
  name: string;
}

/**
 * Circular initials avatar. Presentational only — wrap it in a button/trigger
 * for interactivity.
 */
export function Avatar({ name, className, ...props }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-xs font-semibold uppercase text-primary-foreground",
        className,
      )}
      {...props}
    >
      {initialsFromName(name)}
    </span>
  );
}
