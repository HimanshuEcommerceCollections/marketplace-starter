"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SampleBadge } from "@/components/shared/sample-badge";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SampleNotice } from "@/components/admin/sample-notice";
import { CategoryStatusPill } from "@/components/admin/status-pill";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { CategoryActions } from "@/components/admin/categories/category-actions";
import { CategoryEmptyState } from "@/components/admin/categories/category-empty-state";
import { CategoryTableSkeleton } from "@/components/admin/categories/category-table-skeleton";
import { listCategories, CategoryApiError } from "@/lib/admin/categories";
import type { Category, CategoryListResult, CategoryStatus } from "@/lib/admin/types";
import { formatDate, formatCents } from "@/lib/admin/format";

const STATUS_FILTERS: { label: string; value: CategoryStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Coming Soon", value: "COMING_SOON" },
  { label: "Inactive", value: "INACTIVE" },
];
const PAGE_SIZE = 10;

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [status, setStatus] = React.useState<CategoryStatus | "ALL">("ALL");
  const [page, setPage] = React.useState(1);
  const [result, setResult] = React.useState<CategoryListResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Debounce the search box; reset to page 1 on a new query.
  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCategories({
        page,
        limit: PAGE_SIZE,
        search: debounced || undefined,
        status: status === "ALL" ? undefined : status,
        sort: "desc",
      });
      setResult(res);
    } catch (err) {
      setError(
        err instanceof CategoryApiError ? err.message : "Failed to load categories.",
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [page, debounced, status]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const columns: AdminColumn<Category>[] = [
    {
      key: "icon",
      header: "Icon",
      mobileHidden: true,
      headerClassName: "w-12",
      cell: (r) => (
        <span className="inline-flex size-8 items-center justify-center overflow-hidden rounded border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- small category icon thumbnail */}
          <img src={r.iconPath} alt="" aria-hidden className="size-5" />
        </span>
      ),
    },
    { key: "name", header: "Category", primary: true, cell: (r) => r.name },
    {
      key: "slug",
      header: "Slug",
      cell: (r) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {r.slug}
        </code>
      ),
    },
    {
      key: "basePrice",
      header: (
        <span className="inline-flex items-center gap-2">
          Base Price
          <SampleBadge />
        </span>
      ),
      align: "right",
      cell: (r) => (
        <span className="font-medium text-foreground">{formatCents(r.basePrice)}</span>
      ),
    },
    { key: "status", header: "Status", cell: (r) => <CategoryStatusPill status={r.status} /> },
    {
      key: "servicesCount",
      header: "Services",
      align: "right",
      cell: (r) => r.servicesCount ?? 0,
    },
    {
      key: "createdAt",
      header: "Created",
      mobileHidden: true,
      cell: (r) => formatDate(r.createdAt),
    },
  ];

  const items = result?.items ?? [];
  const meta = result?.meta;
  const isFiltered = debounced !== "" || status !== "ALL";

  return (
    <>
      <AdminTopbar
        searchPlaceholder="Search categories..."
        searchValue={search}
        onSearchChange={setSearch}
        action={
          <Button asChild size="sm">
            <Link href="/admin/categories/new">
              <Plus aria-hidden />
              Create Category
            </Link>
          </Button>
        }
      />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader
          title="Categories"
          subtitle="Group services for the customer marketplace and control what's published."
        />
        <SampleNotice className="mb-6" />

        {/* Toolbar: status filter + count */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <Button
                key={f.value}
                type="button"
                size="sm"
                variant={status === f.value ? "default" : "outline"}
                aria-pressed={status === f.value}
                onClick={() => {
                  setStatus(f.value);
                  setPage(1);
                }}
              >
                {f.label}
              </Button>
            ))}
          </div>
          {meta ? (
            <span className="text-sm text-muted-foreground">
              {meta.total} {meta.total === 1 ? "category" : "categories"}
            </span>
          ) : null}
        </div>

        {/* Content states */}
        {loading ? (
          <CategoryTableSkeleton />
        ) : error ? (
          <Card className="flex items-center gap-2 px-4 py-8 text-sm text-destructive">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            {error}
          </Card>
        ) : items.length === 0 ? (
          isFiltered ? (
            <Card className="px-4 py-12 text-center text-sm text-muted-foreground">
              No categories match your filters.
            </Card>
          ) : (
            <CategoryEmptyState />
          )
        ) : (
          <>
            <AdminTable
              columns={columns}
              rows={items}
              getRowId={(r) => r.id}
              onRowSelect={(r) => router.push(`/admin/categories/${r.id}`)}
              caption="Categories"
              rowActions={(r) => (
                <CategoryActions category={r} onChanged={load} onError={setError} />
              )}
            />
            {meta && meta.totalPages > 1 ? (
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={meta.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
