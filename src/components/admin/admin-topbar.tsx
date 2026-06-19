"use client";

import * as React from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface AdminTopbarProps {
  searchPlaceholder: string;
  action?: React.ReactNode;
  date?: string;
  /** When provided, the search field is controlled (functional). Omit for the
   *  default decorative stub used by other admin screens. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

/**
 * Sticky utility bar above each admin screen: a search field, optional date,
 * a notifications bell, and an optional primary action (passed by the page).
 * Search is a stub unless `onSearchChange` is supplied (then it's controlled).
 */
export function AdminTopbar({
  searchPlaceholder,
  action,
  date,
  searchValue,
  onSearchChange,
}: AdminTopbarProps) {
  return (
    <div className="lg:sticky lg:top-0 z-sticky flex h-16 items-center gap-3 border-b border-border bg-muted/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="relative flex-1 max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          aria-label="Search"
          placeholder={searchPlaceholder}
          className="bg-card pl-9"
          {...(onSearchChange
            ? { value: searchValue ?? "", onChange: (e) => onSearchChange(e.target.value) }
            : {})}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {date ? (
          <span className="hidden text-sm text-muted-foreground md:inline">
            {date}
          </span>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="size-5" aria-hidden />
        </Button>
        {action}
      </div>
    </div>
  );
}
