"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  CheckCircle2,
  Ban,
  Clock,
  FileEdit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Category, CategoryStatus } from "@/lib/admin/types";
import {
  CATEGORY_TRANSITIONS,
  categoryTransitionLabel,
} from "@/lib/admin/status";
import { setCategoryStatus, CategoryApiError } from "@/lib/admin/categories";

export interface CategoryActionsProps {
  category: Category;
  /** Called after a successful lifecycle change so the list can refetch. */
  onChanged: () => void;
  onError?: (message: string) => void;
}

const TRANSITION_ICON: Record<
  CategoryStatus,
  React.ComponentType<{ className?: string }>
> = {
  ACTIVE: CheckCircle2,
  COMING_SOON: Clock,
  DRAFT: FileEdit,
  INACTIVE: Ban,
};

/** Row actions menu: View · Edit · one item per valid status transition. */
export function CategoryActions({ category, onChanged, onError }: CategoryActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  const run = async (to: CategoryStatus) => {
    setBusy(true);
    try {
      await setCategoryStatus(category.id, to);
      onChanged();
    } catch (err) {
      onError?.(
        err instanceof CategoryApiError ? err.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  };

  const targets = CATEGORY_TRANSITIONS[category.status];

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
        {targets.map((to) => {
          const Icon = TRANSITION_ICON[to];
          return (
            <DropdownMenuItem key={to} onSelect={() => void run(to)}>
              <Icon className="size-4" aria-hidden />
              {categoryTransitionLabel(to)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
