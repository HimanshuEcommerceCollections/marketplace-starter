"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { AreaSelect } from "@/components/admin/coverage/area-select";
import {
  CoverageAlert,
  CoverageErrorAlert,
} from "@/components/admin/coverage/coverage-alert";
import { CoverageConfirmDialog } from "@/components/admin/coverage/coverage-confirm-dialog";
import { ZipEmptyState } from "@/components/admin/coverage/coverage-empty-state";
import {
  COVERAGE_AREAS_HREF,
  COVERAGE_ZIPS_HREF,
  CoverageTabs,
} from "@/components/admin/coverage/coverage-tabs";
import { GeoStatusPill } from "@/components/admin/coverage/geo-status-pill";
import { CoverageTableSkeleton } from "@/components/admin/coverage/coverage-table-skeleton";
import { ZipEditor } from "@/components/admin/coverage/zip-editor";
import { ZipImportPanel } from "@/components/admin/coverage/zip-import-panel";
import {
  activateZipCode,
  archiveZipCode,
  deactivateZipCode,
  listZipCodes,
  restoreZipCode,
} from "@/lib/admin/zip-codes";
import type {
  GeoStatus,
  PaginationMeta,
  ZipCodeResponse,
} from "@/lib/coverage/types";
import { useAreaOptions } from "@/components/admin/coverage/use-areas";

interface ZipCodeListResult {
  items: ZipCodeResponse[];
  meta: PaginationMeta;
}

const STATUS_FILTERS: { label: string; value: GeoStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Paused", value: "INACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
];

/**
 * 50 rows per page. The DOM never holds more than that, and `meta.total` drives
 * "Page 3 of 97" — there is no virtualization anywhere in this feature because
 * nothing ever renders one long scrollable list. Admins find a ZIP by filtering,
 * not by scrolling to row 3,812.
 */
const PAGE_SIZE = 50;

type Editing = { mode: "create" } | { mode: "edit"; zip: ZipCodeResponse } | null;
type Pending = { action: "archive" | "restore"; zip: ZipCodeResponse } | null;

export default function AdminCoverageZipCodesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <CoverageTableSkeleton rows={8} label="Loading ZIP codes" />
        </div>
      }
    >
      <ZipCodesScreen />
    </React.Suspense>
  );
}

function ZipCodesScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Deep link from the Areas table: /admin/coverage/zip-codes?areaId=…
  const urlAreaId = searchParams.get("areaId");
  const [areaId, setAreaId] = React.useState<string | null>(urlAreaId);
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [status, setStatus] = React.useState<GeoStatus | "ALL">("ALL");
  const [page, setPage] = React.useState(1);
  const [result, setResult] = React.useState<ZipCodeListResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<Editing>(null);
  const [importing, setImporting] = React.useState(false);
  const [pending, setPending] = React.useState<Pending>(null);

  const areaOptions = useAreaOptions();

  // Debounced search; a new query always resets to page 1.
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /**
   * ADOPT an externally-changed `?areaId=`.
   *
   * The Area column links to this same route with a different query string, and
   * the App Router does NOT remount a page for a query-only navigation — so the
   * `useState` initialiser never re-runs. Without this the link would appear
   * dead, and the writer effect below would immediately push the old value back
   * into the URL.
   */
  React.useEffect(() => {
    setAreaId((current) => (current === urlAreaId ? current : urlAreaId));
    setPage((current) => (current === 1 ? current : 1));
  }, [urlAreaId]);

  // Keep the area filter in the URL so the view stays shareable and Back works.
  // Only when it actually differs — writing on mount would replace the entry the
  // deep link just created.
  React.useEffect(() => {
    if (urlAreaId === areaId) return;
    router.replace(
      areaId === null
        ? COVERAGE_ZIPS_HREF
        : `${COVERAGE_ZIPS_HREF}?areaId=${encodeURIComponent(areaId)}`,
      { scroll: false },
    );
  }, [areaId, urlAreaId, router]);

  /**
   * Sequence number per fetch; only the newest response may write state. Filters
   * and pages change faster than the API answers, so without this a slow page-2
   * response lands after a fast page-3 one and the table contradicts its own
   * controls. Bumped on unmount so a late response cannot set state on a dead
   * component.
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
      // Server-side pagination and prefix search ONLY. The server splits `search`
      // on shape — all digits means a ZIP prefix, anything else a city prefix —
      // so both branches stay index-backed at thousands of rows.
      const next = await listZipCodes(
        {
          page,
          limit: PAGE_SIZE,
          search: debounced.trim() || undefined,
          areaId: areaId ?? undefined,
          status: status === "ALL" ? undefined : status,
          sortBy: "zipCode",
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
  }, [page, debounced, areaId, status]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const run = React.useCallback(
    async (zip: ZipCodeResponse, fn: () => Promise<unknown>, success: string) => {
      if (busyId !== null) return;
      setBusyId(zip.id);
      setError(null);
      setNotice(null);
      try {
        await fn();
        setNotice(success);
        await load();
      } catch (err) {
        setError(err);
      } finally {
        setBusyId(null);
      }
    },
    [busyId, load],
  );

  const items = result?.items ?? [];
  const meta = result?.meta;
  const isInitial = result === null;
  const isFiltered =
    debounced.trim() !== "" || status !== "ALL" || areaId !== null;
  const filterArea =
    areaId === null ? null : areaOptions.areas.find((area) => area.id === areaId);

  const columns: AdminColumn<ZipCodeResponse>[] = [
    {
      key: "zipCode",
      header: "ZIP",
      primary: true,
      cell: (row) => <span className="font-mono">{row.zipCode}</span>,
    },
    { key: "city", header: "City", cell: (row) => row.city ?? "—" },
    {
      key: "stateCode",
      header: "State",
      mobileHidden: true,
      cell: (row) => row.stateCode,
    },
    {
      key: "area",
      header: "Area",
      cell: (row) => (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <Link
            href={`${COVERAGE_ZIPS_HREF}?areaId=${encodeURIComponent(row.area.id)}`}
            className="underline-offset-2 hover:underline"
          >
            {row.area.name}
          </Link>
          {row.area.status !== "ACTIVE" ? (
            <span className="text-xs text-muted-foreground">
              (area {row.area.status === "INACTIVE" ? "paused" : "archived"})
            </span>
          ) : null}
        </span>
      ),
    },
    {
      key: "serviceOverrideCount",
      header: "Overrides",
      align: "right",
      mobileHidden: true,
      cell: (row) => (
        <span
          className={row.serviceOverrideCount === 0 ? "text-muted-foreground" : undefined}
          title="Services with a rule pinned to this ZIP code. Any of these blocks a move."
        >
          {row.serviceOverrideCount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <GeoStatusPill status={row.status} />,
    },
  ];

  /**
   * No `onRowSelect`: the row stays a plain `<tr>` rather than a
   * `role="button"` one, which keeps the links and buttons inside it valid and
   * keyboard-reachable. Editing is the explicit pencil.
   */
  const list = (
    <div className={loading && !isInitial ? "opacity-60" : undefined} aria-busy={loading}>
      <AdminTable<ZipCodeResponse>
        columns={columns}
        rows={items}
        getRowId={(row) => row.id}
        caption="ZIP codes"
        emptyMessage="No ZIP codes match your filters."
        rowActions={(row) => {
          // Every row's actions are disabled while ANY row is mutating: `run`
          // refuses to start a second action anyway, and a button that looks
          // enabled but silently does nothing is worse than a disabled one.
          const rowBusy = busyId !== null;
          return (
            <>
              {row.status !== "ARCHIVED" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${row.zipCode}`}
                  title="Edit"
                  disabled={rowBusy}
                  onClick={() => {
                    setImporting(false);
                    setEditing({ mode: "edit", zip: row });
                  }}
                >
                  <Pencil className="size-4" aria-hidden />
                </Button>
              ) : null}
              {row.status === "ACTIVE" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={rowBusy}
                  onClick={() =>
                    void run(
                      row,
                      () => deactivateZipCode(row.id),
                      `${row.zipCode} is paused — it is no longer bookable.`,
                    )
                  }
                >
                  Pause
                </Button>
              ) : null}
              {row.status === "INACTIVE" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={rowBusy}
                  onClick={() =>
                    void run(
                      row,
                      () => activateZipCode(row.id),
                      `${row.zipCode} is active.`,
                    )
                  }
                >
                  Activate
                </Button>
              ) : null}
              {row.status === "ARCHIVED" ? (
                <Button
                  type="button"
                  size="sm"
                  disabled={rowBusy}
                  onClick={() => setPending({ action: "restore", zip: row })}
                >
                  Restore
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={rowBusy}
                  onClick={() => setPending({ action: "archive", zip: row })}
                >
                  Archive
                </Button>
              )}
            </>
          );
        }}
      />
    </div>
  );

  const emptyBecauseAreaHasNone =
    items.length === 0 && filterArea !== null && filterArea !== undefined;

  return (
    <>
      <AdminTopbar
        searchPlaceholder="Search by ZIP or city prefix..."
        searchValue={search}
        onSearchChange={setSearch}
        action={
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setEditing(null);
                setImporting(true);
              }}
            >
              <Upload aria-hidden />
              Import
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setImporting(false);
                setEditing({ mode: "create" });
              }}
            >
              <Plus aria-hidden />
              New ZIP
            </Button>
          </>
        }
      />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader
          title="ZIP codes"
          subtitle="The only bookable unit. Every ZIP belongs to exactly one area and inherits that area's coverage unless a service overrides it."
        />

        <CoverageTabs zipCount={!isFiltered && meta ? meta.total : undefined} />

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <AreaSelect
              ariaLabel="Filter by area"
              value={areaId}
              onChange={(next) => {
                setAreaId(next);
                setPage(1);
              }}
              areas={areaOptions.areas}
              loading={areaOptions.loading}
              truncated={areaOptions.truncated}
              allowAll
            />
            <div
              role="group"
              aria-label="Filter by status"
              className="flex flex-wrap gap-1.5"
            >
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
          </div>
          {meta ? (
            <span className="text-sm text-muted-foreground">
              {meta.total.toLocaleString()} {meta.total === 1 ? "ZIP code" : "ZIP codes"}
              {status === "ALL" ? " (active and paused)" : ""}
            </span>
          ) : null}
        </div>

        {areaOptions.error ? (
          <div className="mb-4">
            <CoverageAlert
              tone="error"
              action={
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={areaOptions.reload}
                >
                  Retry
                </Button>
              }
            >
              {areaOptions.error} Area filtering and moves are unavailable until it loads.
            </CoverageAlert>
          </div>
        ) : null}

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
              fallback="Failed to load ZIP codes."
              onDismiss={() => setError(null)}
              action={
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void load()}
                >
                  Try again
                </Button>
              }
            />
          </div>
        ) : null}

        {importing ? (
          <ZipImportPanel
            areas={areaOptions.areas}
            areasLoading={areaOptions.loading}
            areasTruncated={areaOptions.truncated}
            defaultAreaId={areaId}
            onImported={() => void load()}
            onClose={() => setImporting(false)}
          />
        ) : null}

        {editing ? (
          <ZipEditor
            /* Remount per target: without a key, clicking the pencil on a second
               row reuses the instance and keeps the first row's field values. */
            key={editing.mode === "edit" ? editing.zip.id : "new"}
            mode={editing.mode}
            {...(editing.mode === "edit" ? { initial: editing.zip } : {})}
            areas={areaOptions.areas}
            areasLoading={areaOptions.loading}
            areasTruncated={areaOptions.truncated}
            defaultAreaId={areaId}
            onCancel={() => setEditing(null)}
            onSaved={(zip, mode) => {
              setEditing(null);
              setNotice(
                mode === "create"
                  ? `${zip.zipCode} added to ${zip.area.name}.`
                  : `${zip.zipCode} saved — it is in ${zip.area.name}.`,
              );
              void load();
            }}
            onRestoreArchived={(archivedId) => {
              setEditing(null);
              void restoreZipCode(archivedId)
                .then((zip) => {
                  setNotice(
                    `${zip.zipCode} restored — it is active in ${zip.area.name}.`,
                  );
                  return load();
                })
                .catch((err: unknown) => setError(err));
            }}
          />
        ) : null}

        {isInitial && loading ? (
          <CoverageTableSkeleton rows={8} label="Loading ZIP codes" />
        ) : items.length === 0 && !isFiltered && !editing && !importing ? (
          <ZipEmptyState
            canAdd={areaOptions.areas.length > 0}
            onImport={() => setImporting(true)}
            onAdd={() => setEditing({ mode: "create" })}
          />
        ) : emptyBecauseAreaHasNone ? (
          <Card className="px-4 py-12 text-center text-sm text-muted-foreground">
            <p className="text-foreground">
              {filterArea.name} has no ZIP codes matching these filters.
            </p>
            <p className="mt-1">
              Services can still cover {filterArea.name} area-wide, so this is not
              necessarily a problem.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setImporting(true);
                }}
              >
                <Upload aria-hidden />
                Import into {filterArea.name}
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={COVERAGE_AREAS_HREF}>Back to areas</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {list}
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

      <CoverageConfirmDialog
        open={pending?.action === "archive"}
        title={`Archive ${pending?.zip.zipCode ?? ""}?`}
        confirmLabel="Archive ZIP code"
        destructive
        busy={busyId !== null}
        requireTypedValue={
          pending !== null && pending.zip.serviceOverrideCount > 0
            ? pending.zip.zipCode
            : undefined
        }
        body={
          pending === null ? null : (
            <>
              <p>
                {pending.zip.zipCode} becomes unbookable and read-only, and drops out of
                the default lists.
              </p>
              <p>
                Its {pending.zip.serviceOverrideCount} per-service rule
                {pending.zip.serviceOverrideCount === 1 ? "" : "s"} and its place in{" "}
                {pending.zip.area.name} are kept exactly as they are, so restoring is
                lossless. Existing bookings are not affected.
              </p>
              <p>You can undo this from the Archived filter.</p>
            </>
          )
        }
        onCancel={() => setPending(null)}
        onConfirm={() => {
          const target = pending?.zip;
          setPending(null);
          if (target) {
            void run(
              target,
              () => archiveZipCode(target.id),
              `${target.zipCode} is archived.`,
            );
          }
        }}
      />

      <CoverageConfirmDialog
        open={pending?.action === "restore"}
        title={`Restore ${pending?.zip.zipCode ?? ""}?`}
        confirmLabel="Restore ZIP code"
        busy={busyId !== null}
        body={
          pending === null ? null : (
            <>
              <p>
                {pending.zip.zipCode} comes back{" "}
                <strong className="text-foreground">active</strong> in{" "}
                {pending.zip.area.name} — unlike an area, a restored ZIP is immediately
                bookable again.
              </p>
              {pending.zip.area.status !== "ACTIVE" ? (
                <p>
                  {pending.zip.area.name} is{" "}
                  {pending.zip.area.status === "INACTIVE" ? "paused" : "archived"}, so
                  nothing here is bookable until the area is active.
                </p>
              ) : (
                <p>
                  It inherits {pending.zip.area.name}&apos;s coverage plus its own{" "}
                  {pending.zip.serviceOverrideCount} per-service rule
                  {pending.zip.serviceOverrideCount === 1 ? "" : "s"}, exactly as before.
                </p>
              )}
            </>
          )
        }
        onCancel={() => setPending(null)}
        onConfirm={() => {
          const target = pending?.zip;
          setPending(null);
          if (target) {
            void run(
              target,
              () => restoreZipCode(target.id),
              `${target.zipCode} restored and active.`,
            );
          }
        }}
      />
    </>
  );
}
