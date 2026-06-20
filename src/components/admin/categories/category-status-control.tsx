"use client";

import * as React from "react";
import { CheckCircle2, Ban, Clock, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryStatusPill } from "@/components/admin/status-pill";
import type { Category, CategoryStatus } from "@/lib/admin/types";
import {
  CATEGORY_TRANSITIONS,
  categoryTransitionLabel,
} from "@/lib/admin/status";
import { setCategoryStatus, CategoryApiError } from "@/lib/admin/categories";

export interface CategoryStatusControlProps {
  category: Category;
  /** Receives the updated category after a transition. */
  onChanged: (next: Category) => void;
}

/** Icon + button variant per target status. */
function transitionStyle(to: CategoryStatus): {
  icon: React.ComponentType<{ className?: string }>;
  variant: "default" | "outline";
} {
  switch (to) {
    case "ACTIVE":
      return { icon: CheckCircle2, variant: "default" };
    case "COMING_SOON":
      return { icon: Clock, variant: "outline" };
    case "DRAFT":
      return { icon: FileEdit, variant: "outline" };
    case "INACTIVE":
      return { icon: Ban, variant: "outline" };
  }
}

/**
 * Lifecycle control used on the details + edit screens. Shows the current status
 * and one button per valid transition (Publish / Mark Coming Soon / Move to
 * Draft / Deactivate), driven by the shared transition map.
 */
export function CategoryStatusControl({ category, onChanged }: CategoryStatusControlProps) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const run = async (to: CategoryStatus) => {
    setBusy(true);
    setError(null);
    try {
      onChanged(await setCategoryStatus(category.id, to));
    } catch (err) {
      setError(err instanceof CategoryApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const targets = CATEGORY_TRANSITIONS[category.status];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-foreground">
        Status
        <CategoryStatusPill status={category.status} />
      </span>
      <div className="flex flex-col items-end gap-1">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {targets.map((to) => {
            const { icon: Icon, variant } = transitionStyle(to);
            return (
              <Button
                key={to}
                type="button"
                variant={variant}
                size="sm"
                disabled={busy}
                onClick={() => void run(to)}
              >
                <Icon aria-hidden />
                {categoryTransitionLabel(to)}
              </Button>
            );
          })}
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
