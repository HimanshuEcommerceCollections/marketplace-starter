"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Pencil, CheckCircle2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/lib/admin/types";
import {
  publishCategory,
  deactivateCategory,
  CategoryApiError,
} from "@/lib/admin/categories";

export interface CategoryActionsProps {
  category: Category;
  /** Called after a successful lifecycle change so the list can refetch. */
  onChanged: () => void;
  onError?: (message: string) => void;
}

/** Row actions menu: View · Edit · Publish (DRAFT/INACTIVE) · Deactivate (ACTIVE). */
export function CategoryActions({ category, onChanged, onError }: CategoryActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      onChanged();
    } catch (err) {
      onError?.(
        err instanceof CategoryApiError ? err.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  };

  const canPublish = category.status === "DRAFT" || category.status === "INACTIVE";
  const canDeactivate = category.status === "ACTIVE";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${category.name}`}
          disabled={busy}
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => router.push(`/admin/categories/${category.id}`)}>
          <Eye className="size-4" aria-hidden />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => router.push(`/admin/categories/${category.id}/edit`)}
        >
          <Pencil className="size-4" aria-hidden />
          Edit
        </DropdownMenuItem>
        {canPublish ? (
          <DropdownMenuItem onSelect={() => void run(() => publishCategory(category.id))}>
            <CheckCircle2 className="size-4" aria-hidden />
            {category.status === "INACTIVE" ? "Reactivate" : "Publish"}
          </DropdownMenuItem>
        ) : null}
        {canDeactivate ? (
          <DropdownMenuItem
            onSelect={() => void run(() => deactivateCategory(category.id))}
          >
            <Ban className="size-4" aria-hidden />
            Deactivate
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
