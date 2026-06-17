"use client";

import * as React from "react";
import type { BookingStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export type BookingTab = "all" | BookingStatus;

export interface BookingTabsProps {
  activeTab: BookingTab;
  onTabChange: (tab: BookingTab) => void;
  counts: Record<BookingTab, number>;
}

const TABS: { id: BookingTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

/**
 * Horizontally scrollable status filter for the bookings list. This is a filter
 * control (not a tab/tabpanel set), so it uses a button group with aria-pressed
 * rather than role="tab"/"tablist", which would require linked tabpanels. Active
 * pill uses the dark inverse treatment; inactive pills are bordered cards. Each
 * pill shows the count of bookings in that status (derived from ALL_BOOKINGS).
 */
export function BookingTabs({ activeTab, onTabChange, counts }: BookingTabsProps) {
  return (
    <div
      role="group"
      aria-label="Filter bookings by status"
      className="flex gap-2 overflow-x-auto pb-1"
    >
      {TABS.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "bg-surface-inverse text-surface-inverse-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-muted/60",
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                active
                  ? "bg-surface-inverse-foreground/15 text-surface-inverse-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {counts[tab.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
