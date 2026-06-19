"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/shared/sample-badge";
import { CategoryStatusPill } from "@/components/admin/status-pill";
import { CategoryStatusControl } from "@/components/admin/categories/category-status-control";
import { getCategory, CategoryApiError } from "@/lib/admin/categories";
import type { Category, CategoryDetails } from "@/lib/admin/types";
import { formatDate, formatCents } from "@/lib/admin/format";

export default function CategoryDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [category, setCategory] = React.useState<CategoryDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCategory(await getCategory(id));
    } catch (err) {
      setError(
        err instanceof CategoryApiError ? err.message : "Failed to load category.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    void load();
  }, [load]);

  // Lifecycle transitions return a Category without servicesCount — keep the count.
  const onStatusChanged = (next: Category) =>
    setCategory((prev) =>
      prev ? { ...prev, ...next, servicesCount: next.servicesCount ?? prev.servicesCount } : null,
    );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/admin/categories"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to categories
      </Link>

      {loading ? (
        <Card className="h-48 animate-pulse bg-muted/60" />
      ) : error || !category ? (
        <Card className="flex items-center gap-2 px-4 py-8 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" aria-hidden />
          {error ?? "Category not found."}
        </Card>
      ) : (
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                  {category.name}
                </h1>
                <CategoryStatusPill status={category.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">/{category.slug}</p>
            </div>
            <Button asChild>
              <Link href={`/admin/categories/${category.id}/edit`}>
                <Pencil aria-hidden />
                Edit
              </Link>
            </Button>
          </div>

          <Card className="divide-y divide-border p-0">
            <Row
              label="Base price"
              value={
                <span className="inline-flex items-center gap-2">
                  {formatCents(category.basePrice)}
                  <SampleBadge />
                </span>
              }
            />
            <Row
              label="Linked services"
              value={`${category.servicesCount} ${category.servicesCount === 1 ? "service" : "services"}`}
            />
            <Row
              label="Description"
              value={
                category.description || (
                  <span className="text-muted-foreground">No description</span>
                )
              }
            />
            <Row label="Created" value={formatDate(category.createdAt)} />
            <Row label="Updated" value={formatDate(category.updatedAt)} />
          </Card>

          <CategoryStatusControl category={category} onChanged={onStatusChanged} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
