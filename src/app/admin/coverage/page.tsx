"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { MasterDetail } from "@/components/admin/master-detail";
import { AreaDetailPanel } from "@/components/admin/coverage/area-detail-panel";
import { AreaForm } from "@/components/admin/coverage/area-form";
import {
  CoverageAlert,
  CoverageErrorAlert,
} from "@/components/admin/coverage/coverage-alert";
import { AreaEmptyState } from "@/components/admin/coverage/coverage-empty-state";
import {
  COVERAGE_ZIPS_HREF,
  CoverageTabs,
} from "@/components/admin/coverage/coverage-tabs";
import { GeoStatusPill } from "@/components/admin/coverage/geo-status-pill";
import { CoverageTableSkeleton } from "@/components/admin/coverage/coverage-table-skeleton";
import { listAreas, restoreArea } from "@/lib/admin/areas";
import type {
  AreaResponse,
  GeoStatus,
  PaginationMeta,
} from "@/lib/coverage/types";
import { invalidateAreaOptions } from "@/components/admin/coverage/use-areas";

interface AreaListResult {
  items: AreaResponse[];
  meta: PaginationMeta;
}

/**
 * "All" sends no `status`, which the server reads as ACTIVE + INACTIVE. ARCHIVED
 * is reachable only by asking for it explicitly — a retired market keeps its
 * name/slug slot forever, so it must not clutter the default view, and making
 * "show archived" a value of THIS control (rather than a second toggle) is what
 * stops someone accidentally freeing a slug.
 */
const STATUS_FILTERS: { label: string; value: GeoStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Paused", value: "INACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
];

const PAGE_SIZE = 20;
const NEW_AREA = "new";

export default function AdminCoverageAreasPage() {
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [status, setStatus] = React.useState<GeoStatus | "ALL">("ALL");
  const [page, setPage] = React.useState(1);
  const [result, setResult] = React.useState<AreaListResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | undefined>();

  // Debounce the search box; a new query always resets to page 1.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /**
   * Every fetch carries a sequence number and only the newest one may write
   * state. Filters and pagination change faster than the API answers, so without
   * this a slow page-2 response lands after a fast page-3 one and the table shows
   * rows that do not match the controls. Bumped on unmount too, so a late
   * response cannot set state on a dead component.
   */
  const loadSeq = React.useRef(0);
  const loadAbort = React.useRef<AbortController | null>(null);
  React.useEffect(() => () => {
    loadSeq.current += 1;
    loadAbort.current?.abort();
  }, []);

  const load = React.useCallback(async () => {
    loadAbort.current?.abort();
    const controller = new AbortController();
    loadAbort.current = controller;
    const seq = (loadSeq.current += 1);
    setLoading(true);
    setError(null);
    try {
      // Server-side pagination, search and status filtering ONLY. The client holds
      // one page and never filters a full fetch.
      const next = await listAreas(
        {
          page,
          limit: PAGE_SIZE,
          search: debounced.trim() || undefined,
          status: status === "ALL" ? undefined : status,
          sortBy: "sortOrder",
          sort: "asc",
        },
        { signal: controller.signal },
      );
      if (seq === loadSeq.current) setResult(next);
    } catch (err) {
      // An aborted request rejects here; the sequence check swallows it, which is
      // the point — a superseded fetch is not an error the admin should read.
      if (seq === loadSeq.current) setError(err);
    } finally {
      if (seq === loadSeq.current) setLoading(false);
    }
  }, [page, debounced, status]);

  React.useEffect(() => {
    void load();
  }, [load]);

  /**
   * Any area write invalidates the cached picker list used by the ZIP screen.
   *
   * The success sentence arrives from the detail panel because archiving and
   * restoring drop the row out of the current filter, which unmounts the panel —
   * the confirmation has to outlive it.
   */
  const refresh = React.useCallback(
    (message?: string) => {
      if (message !== undefined) {
        setNotice(message);
        setError(null);
      }
      invalidateAreaOptions();
      void load();
    },
    [load],
  );

  const items = result?.items ?? [];
  const meta = result?.meta;
  const isInitial = result === null;
  const isFiltered = debounced.trim() !== "" || status !== "ALL";
  const selected = items.find((area) => area.id === selectedId);
  const creating = selectedId === NEW_AREA;

  const columns: AdminColumn<AreaResponse>[] = [
    { key: "name", header: "Area", primary: true, cell: (row) => row.name },
    {
      key: "slug",
      header: "Slug",
      cell: (row) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {row.slug}
        </code>
      ),
    },
    {
      key: "zipCodeCount",
      header: "ZIPs",
      align: "right",
      cell: (row) => (
        <span className="font-medium text-foreground">
          {row.activeZipCodeCount}
          <span className="text-muted-foreground"> / {row.zipCodeCount}</span>
        </span>
      ),
    },
    {
      key: "serviceCount",
      header: "Services",
      align: "right",
      mobileHidden: true,
      cell: (row) => (
        <span className={row.serviceCount === 0 ? "text-muted-foreground" : undefined}>
          {row.serviceCount}
        </span>
      ),
    },
    {
      key: "sortOrder",
      header: "Order",
      align: "right",
      mobileHidden: true,
      cell: (row) => row.sortOrder,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <GeoStatusPill status={row.status} />,
    },
  ];

  const list = (
    <div className={loading && !isInitial ? "opacity-60" : undefined} aria-busy={loading}>
      <AdminTable<AreaResponse>
        columns={columns}
        rows={items}
        getRowId={(row) => row.id}
        selectedId={selectedId}
        onRowSelect={(row) => setSelectedId(row.id)}
        caption="Coverage areas"
        emptyMessage="No areas match your filters."
        rowActions={(row) => (
          <Button asChild variant="outline" size="sm">
            <Link href={`${COVERAGE_ZIPS_HREF}?areaId=${encodeURIComponent(row.id)}`}>
              ZIP codes
            </Link>
          </Button>
        )}
      />
    </div>
  );

  return (
    <>
      <AdminTopbar
        searchPlaceholder="Search areas by name or slug..."
        searchValue={search}
        onSearchChange={setSearch}
        action={
          <Button type="button" size="sm" onClick={() => setSelectedId(NEW_AREA)}>
            <Plus aria-hidden />
            New area
          </Button>
        }
      />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader
          title="Coverage areas"
          subtitle="The towns and cities you operate in. An area is never bookable itself — it supplies the default coverage verdict for the ZIP codes beneath it."
        />

        <CoverageTabs
          areaCount={!isFiltered && meta ? meta.total : undefined}
        />

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter.value}
                type="button"
                size="sm"
                variant={status === filter.value ? "default" : "outline"}
                aria-pressed={status === filter.value}
                onClick={() => {
                  setStatus(filter.value);
                  setPage(1);
                }}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          {meta ? (
            <span className="text-sm text-muted-foreground">
              {meta.total} {meta.total === 1 ? "area" : "areas"}
              {status === "ALL" ? " (active and paused)" : ""}
            </span>
          ) : null}
        </div>

        {notice ? (
          <div className="mb-4">
            <CoverageAlert tone="success" onDismiss={() => setNotice(null)}>
              {notice}
            </CoverageAlert>
          </div>
        ) : null}

        {error ? (
          <div className="mb-4">
            <CoverageErrorAlert
              error={error}
              fallback="Failed to load coverage areas."
              onDismiss={() => setError(null)}
              action={
                <Button type="button" size="sm" variant="outline" onClick={() => void load()}>
                  Try again
                </Button>
              }
            />
          </div>
        ) : null}

        {isInitial && loading ? (
          <CoverageTableSkeleton rows={6} label="Loading coverage areas" />
        ) : items.length === 0 && !isFiltered && !creating ? (
          <AreaEmptyState onCreate={() => setSelectedId(NEW_AREA)} />
        ) : (
          <>
            <MasterDetail
              list={list}
              detailOpen={creating || Boolean(selected)}
              onClose={() => setSelectedId(undefined)}
              detailLabel={creating ? "New area" : "Area details"}
              detail={
                creating ? (
                  <Card className="p-5">
                    <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
                      New area
                    </h2>
                    <AreaForm
                      mode="create"
                      onCancel={() => setSelectedId(undefined)}
                      onSaved={(area) => {
                        setSelectedId(area.id);
                        refresh(`${area.name} created and live. Add its ZIP codes next.`);
                      }}
                      onRestoreArchived={(archivedId) => {
                        void restoreArea(archivedId)
                          .then((area) => {
                            setStatus("ALL");
                            setSelectedId(area.id);
                            refresh(
                              `${area.name} restored — it is paused until you activate it.`,
                            );
                          })
                          .catch((err: unknown) => setError(err));
                      }}
                    />
                  </Card>
                ) : selected ? (
                  <AreaDetailPanel
                    /* Remount per area so an open edit form, a pending dialog and
                       the fetched blast-radius counts can never leak across
                       selections. */
                    key={selected.id}
                    area={selected}
                    onChanged={refresh}
                    onSelectArea={(id) => {
                      setStatus("ALL");
                      setSelectedId(id);
                    }}
                    onClose={() => setSelectedId(undefined)}
                  />
                ) : null
              }
              emptyState={
                <Card className="flex items-center justify-center px-6 py-16 text-center text-sm text-muted-foreground">
                  Select an area to see its counts, edit it, or change its status.
                </Card>
              }
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
                    disabled={meta.page <= 1 || loading}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={meta.page >= meta.totalPages || loading}
                    onClick={() => setPage((current) => current + 1)}
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
