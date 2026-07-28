"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CoverageDocument } from "@/lib/coverage/types";

/**
 * A market this service does not touch at all. Derived from the document rather
 * than re-declared, so it cannot drift from the wire contract.
 */
export type CoverageUncoveredArea = CoverageDocument["uncoveredAreas"][number];

export interface AddAreaMenuProps {
  /** Markets this service does not touch at all. Server-supplied. */
  areas: CoverageUncoveredArea[];
  disabled?: boolean;
  onSelect: (area: CoverageUncoveredArea) => void;
  label?: string;
}

/**
 * "Add area" — a menu of the markets this service does not cover yet.
 *
 * A `DropdownMenu` is right at 12 markets (and fine to a hundred): Radix gives
 * keyboard navigation and typeahead for free. It is deliberately NOT a search
 * box, because Radix's own typeahead swallows keystrokes from an input inside
 * the menu. If areas ever grow past a hundred, swap this for the ZIP picker's
 * search-and-pick pattern in single-select mode.
 */
export function AddAreaMenu({
  areas,
  disabled = false,
  onSelect,
  label = "Add area",
}: AddAreaMenuProps) {
  if (areas.length === 0) {
    // `disabled` is also true while the document is still loading, when
    // `areas` is empty simply because nothing has arrived yet. Asserting
    // "every area is already covered" then would be a confident lie.
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled
        title={
          disabled
            ? undefined
            : "Every area is already part of this service's coverage."
        }
      >
        <Plus aria-hidden />
        {label}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" disabled={disabled}>
          <Plus aria-hidden />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-64 overflow-y-auto">
        {areas.map((area) => (
          <DropdownMenuItem
            key={area.areaId}
            onSelect={() => onSelect(area)}
          >
            {area.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
