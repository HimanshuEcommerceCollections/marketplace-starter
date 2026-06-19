"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryForm } from "@/components/admin/categories/category-form";
import { CategoryStatusControl } from "@/components/admin/categories/category-status-control";
import { getCategory, CategoryApiError } from "@/lib/admin/categories";
import type { Category } from "@/lib/admin/types";

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [category, setCategory] = React.useState<Category | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getCategory(id)
      .then((c) => {
        if (active) setCategory(c);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof CategoryApiError ? err.message : "Failed to load category.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href={`/admin/categories/${id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to category
      </Link>
      <AdminPageHeader
        title="Edit category"
        subtitle="Update the category details, or change its published status."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        {loading ? (
          <Card className="h-72 animate-pulse bg-muted/60" />
        ) : error || !category ? (
          <Card className="flex items-center gap-2 px-4 py-8 text-sm text-destructive">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            {error ?? "Category not found."}
          </Card>
        ) : (
          <>
            <CategoryForm mode="edit" initial={category} />
            <CategoryStatusControl category={category} onChanged={setCategory} />
          </>
        )}
      </div>
    </div>
  );
}
