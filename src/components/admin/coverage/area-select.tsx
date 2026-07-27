"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AreaResponse } from "@/lib/coverage/types";

export interface AreaSelectProps {
  /** `null` means "All areas" when `allowAll`, otherwise "nothing chosen yet". */
  value: string | null;
  onChange: (areaId: string | null) => void;
  areas: AreaResponse[];
  loading?: boolean;
  /** True when the server had more areas than the 100-row option fetch returned. */
  truncated?: boolean;
  allowAll?: boolean;
  allLabel?: string;
  placeholder?: string;
  /** Accessible name for the trigger — there is no visible <label> on a menu. */
  ariaLabel: string;
  /** Set when a visible `<Label htmlFor>` sits above the trigger. */
  id?: string;
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
  invalid?: boolean;
}

/**
 * Single-select area picker.
 *
 * A Radix `DropdownMenu`, not a searchable combobox: Radix implements typeahead
 * on menu items (type "ga" to jump to Garner) but that same typeahead swallows
 * keystrokes, so an `<input>` inside the menu content does not work. At 12–100
 * areas an unfiltered, typeahead-navigable menu is the right trade. If areas ever
 * exceed the 100-row option fetch, `truncated` says so out loud instead of
 * silently hiding markets.
 */
export function AreaSelect({
  value,
  onChange,
  areas,
  loading,
  truncated,
  allowAll,
  allLabel = "All areas",
  placeholder = "Choose an area",
  ariaLabel,
  id,
  disabled,
  size = "sm",
  className,
  invalid,
}: AreaSelectProps) {
  const selected = value === null ? null : areas.find((area) => area.id === value);
  const label = loading
    ? "Loading areas…"
    : value === null
      ? allowAll
        ? allLabel
        : placeholder
      : (selected?.name ?? "Unknown area");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          {...(id !== undefined ? { id } : {})}
          variant="outline"
          size={size}
          aria-label={ariaLabel}
          aria-invalid={invalid}
          disabled={disabled || loading}
          className={cn("justify-between gap-2", className)}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="shrink-0 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-64 min-w-56 overflow-y-auto">
        {allowAll ? (
          <>
            <AreaSelectItem
              label={allLabel}
              selected={value === null}
              onSelect={() => onChange(null)}
            />
            <DropdownMenuSeparator />
          </>
        ) : null}
        {areas.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted-foreground">
            No areas yet. Create one first.
          </p>
        ) : (
          areas.map((area) => (
            <AreaSelectItem
              key={area.id}
              label={area.name}
              hint={area.status === "INACTIVE" ? "Paused" : undefined}
              selected={area.id === value}
              onSelect={() => onChange(area.id)}
            />
          ))
        )}
        {truncated ? (
          <p className="border-t border-border px-3 pb-1 pt-2 text-xs text-muted-foreground">
            Showing the first {areas.length} areas — narrow the list on the Areas screen.
          </p>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AreaSelectItem({
  label,
  hint,
  selected,
  onSelect,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem onSelect={onSelect} className="justify-between">
      <span className="truncate">
        {label}
        {hint ? (
          <span className="ml-2 text-xs font-normal text-muted-foreground">{hint}</span>
        ) : null}
      </span>
      {selected ? <Check className="shrink-0" aria-hidden /> : null}
    </DropdownMenuItem>
  );
}
