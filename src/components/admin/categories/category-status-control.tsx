"use client";

import * as React from "react";
import { CheckCircle2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryStatusPill } from "@/components/admin/status-pill";
import type { Category } from "@/lib/admin/types";
import {
  publishCategory,
  deactivateCategory,
  CategoryApiError,
} from "@/lib/admin/categories";

export interface CategoryStatusControlProps {
  category: Category;
  /** Receives the updated category after a transition. */
  onChanged: (next: Category) => void;
}

/**
 * Lifecycle control used on the details + edit screens. Shows the current status
 * and the one valid transition: Deactivate (ACTIVE) or Publish/Reactivate (else).
 */
export function CategoryStatusControl({ category, onChanged }: CategoryStatusControlProps) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const run = async (fn: () => Promise<Category>) => {
    setBusy(true);
    setError(null);
    try {
      onChanged(await fn());
    } catch (err) {
      setError(err instanceof CategoryApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const isActive = category.status === "ACTIVE";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-foreground">
        Status
        <CategoryStatusPill status={category.status} />
      </span>
      <div className="flex flex-col items-end gap-1">
        {isActive ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => void run(() => deactivateCategory(category.id))}
          >
            <Ban aria-hidden />
            Deactivate
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={() => void run(() => publishCategory(category.id))}
          >
            <CheckCircle2 aria-hidden />
            {category.status === "INACTIVE" ? "Reactivate" : "Publish"}
          </Button>
        )}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
