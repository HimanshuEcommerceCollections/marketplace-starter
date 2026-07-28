"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/admin/format";
import { CoverageErrorAlert } from "./coverage-alert";
import { CoverageConfirmDialog } from "./coverage-confirm-dialog";
import { AreaForm } from "./area-form";
import { GEO_TRANSITIONS, GeoStatusPill, geoTransitionLabel } from "./geo-status-pill";
import { COVERAGE_ZIPS_HREF } from "./coverage-tabs";
import {
  activateArea,
  archiveArea,
  deactivateArea,
  getArea,
  restoreArea,
} from "@/lib/admin/areas";
import type { AreaDetail, AreaResponse } from "@/lib/coverage/types";

type PendingAction = "deactivate" | "archive" | "restore";

export interface AreaDetailPanelProps {
  area: AreaResponse;
  /**
   * Re-fetch the list after any mutation — nothing here is optimistic.
   *
   * The success sentence is raised to the PAGE rather than rendered here on
   * purpose: archiving (and restoring) drops the row out of the current filter,
   * which unmounts this panel, so a locally-rendered confirmation would vanish in
   * exactly the two cases where the row silently disappears.
   */
  onChanged: (notice?: string) => void;
  /** Select a different area (used after "Restore instead"). */
  onSelectArea: (id: string) => void;
  onClose: () => void;
}

/**
 * The Areas detail pane: counts, the edit form, and the lifecycle controls.
 *
 * Every mutation re-fetches from the server. Coverage decides whether customers
 * can book, so a UI that lies about it is expensive — the house rule from
 * `service-config-panel.tsx` applies with more force here, not less.
 */
export function AreaDetailPanel({
  area,
  onChanged,
  onSelectArea,
  onClose,
}: AreaDetailPanelProps) {
  const [editing, setEditing] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);
  const [pending, setPending] = React.useState<PendingAction | null>(null);
  const [detail, setDetail] = React.useState<AreaDetail | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  /**
   * Sequence token for the blast-radius fetch. Opening a dialog, cancelling, and
   * opening another before the first response lands would otherwise fill the
   * second dialog with the first one's counts — and those counts gate a
   * type-to-confirm archive.
   */
  const detailSeq = React.useRef(0);
  React.useEffect(() => () => {
    detailSeq.current += 1;
  }, []);

  // A new selection must not inherit the previous area's edit state or feedback.
  React.useEffect(() => {
    setEditing(false);
    setError(null);
    setPending(null);
    setDetail(null);
    detailSeq.current += 1;
  }, [area.id]);

  /**
   * Blast-radius counts are re-fetched when a dialog opens, never read from a
   * possibly-stale table row: the row may be minutes old, and "0 services" is
   * exactly the number that makes someone archive a market that is still selling.
   */
  const openConfirm = React.useCallback(
    (action: PendingAction) => {
      const seq = (detailSeq.current += 1);
      setError(null);
      setPending(action);
      setDetail(null);
      setDetailLoading(true);
      getArea(area.id)
        .then((fresh) => {
          if (seq === detailSeq.current) setDetail(fresh);
        })
        .catch((err: unknown) => {
          if (seq !== detailSeq.current) return;
          setError(err);
          // Close rather than fall back to the table row. The whole reason this
          // dialog re-fetches is that a stale "0 services" is what makes someone
          // archive a market that is still selling — and a stale zero would also
          // drop the type-to-confirm gate. No fresh counts, no confirmation.
          setPending(null);
        })
        .finally(() => {
          if (seq === detailSeq.current) setDetailLoading(false);
        });
    },
    [area.id],
  );

  const run = React.useCallback(
    async (fn: () => Promise<unknown>, success: string) => {
      if (busy) return false;
      setBusy(true);
      setError(null);
      try {
        await fn();
        onChanged(success);
        return true;
      } catch (err) {
        setError(err);
        return false;
      } finally {
        setBusy(false);
      }
    },
    [busy, onChanged],
  );

  const isArchived = area.status === "ARCHIVED";
  const transitions = GEO_TRANSITIONS[area.status];
  const counts = detail ?? area;
  const hasBlastRadius = counts.zipCodeCount > 0 || counts.serviceCount > 0;
  const openBookings = detail?.activeBookingCount;

  const zipsHref = `${COVERAGE_ZIPS_HREF}?areaId=${encodeURIComponent(area.id)}`;

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {area.name}
          </h2>
          <code className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {area.slug}
          </code>
        </div>
        <GeoStatusPill status={area.status} />
      </div>

      {error ? (
        <div className="mb-4">
          <CoverageErrorAlert
            error={error}
            fallback="Something went wrong."
            onDismiss={() => setError(null)}
          />
        </div>
      ) : null}

      {editing ? (
        <AreaForm
          mode="edit"
          initial={area}
          onCancel={() => setEditing(false)}
          onSaved={(saved) => {
            setEditing(false);
            onChanged(`${saved.name} saved.`);
          }}
          onRestoreArchived={(archivedId) => {
            void run(
              () => restoreArea(archivedId),
              "Archived area restored — it is paused until you activate it.",
            ).then((ok) => {
              if (ok) {
                setEditing(false);
                onSelectArea(archivedId);
              }
            });
          }}
        />
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Stat label="ZIP codes" value={`${area.zipCodeCount}`} />
            <Stat label="Active ZIPs" value={`${area.activeZipCodeCount}`} />
            <Stat
              label="Services available"
              value={`${area.serviceCount}`}
              hint="Counts area-wide grants and ZIP-only opt-ins."
            />
            <Stat label="Sort order" value={`${area.sortOrder}`} />
            <Stat label="State" value={area.stateCode} />
            <Stat label="Time zone" value={area.timezone} />
            <Stat label="Updated" value={formatDate(area.updatedAt)} />
            <Stat label="Created" value={formatDate(area.createdAt)} />
          </dl>

          {area.status === "INACTIVE" ? (
            <p className="mt-4 rounded-md bg-warning/10 px-3 py-2 text-xs text-foreground">
              Paused. Nothing in this area is bookable — including its{" "}
              {area.activeZipCodeCount} active ZIP codes. Every coverage setting is kept,
              so activating restores the exact prior state.
            </p>
          ) : null}

          {isArchived ? (
            <p className="mt-4 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              Archived areas are read-only and unbookable. Their ZIP codes and service
              coverage are untouched, so restoring is lossless.
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={zipsHref}>
                Manage ZIP codes
                <ExternalLink aria-hidden />
              </Link>
            </Button>
            {!isArchived ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => setEditing(true)}
              >
                <Pencil aria-hidden />
                Edit
              </Button>
            ) : null}
          </div>

          {/* Buttons are driven by the transition map, so the UI can only ever
              offer a move the server will accept. Out of ARCHIVED there is
              exactly one door and it is /restore. */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            {transitions.includes("ACTIVE") ? (
              <Button
                type="button"
                size="sm"
                disabled={busy}
                onClick={() => {
                  if (isArchived) openConfirm("restore");
                  else void run(() => activateArea(area.id), `${area.name} is live.`);
                }}
              >
                {geoTransitionLabel(area.status, "ACTIVE")}
              </Button>
            ) : null}
            {transitions.includes("INACTIVE") ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => openConfirm("deactivate")}
              >
                {geoTransitionLabel(area.status, "INACTIVE")}
              </Button>
            ) : null}
            {transitions.includes("ARCHIVED") ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={busy}
                onClick={() => openConfirm("archive")}
              >
                {geoTransitionLabel(area.status, "ARCHIVED")}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </>
      )}

      <CoverageConfirmDialog
        open={pending === "deactivate"}
        title={`Pause ${area.name}?`}
        confirmLabel="Pause area"
        busy={busy}
        confirmDisabled={detailLoading}
        body={
          detailLoading ? (
            <div className="h-16 animate-pulse rounded-md bg-muted/60" />
          ) : (
            <>
              <p>
                {area.name} has {counts.zipCodeCount} ZIP code
                {counts.zipCodeCount === 1 ? "" : "s"} ({counts.activeZipCodeCount} active)
                and is used by {counts.serviceCount} service
                {counts.serviceCount === 1 ? "" : "s"}.
              </p>
              <p>
                Customers will no longer be able to book anything in {area.name},
                including every ZIP code beneath it.
                {openBookings !== undefined
                  ? ` ${openBookings} open booking${openBookings === 1 ? "" : "s"} ${
                      openBookings === 1 ? "is" : "are"
                    } not affected.`
                  : ""}
              </p>
              <p>
                Service coverage settings are kept, so resuming restores them exactly.
              </p>
            </>
          )
        }
        onCancel={() => setPending(null)}
        onConfirm={() => {
          setPending(null);
          void run(() => deactivateArea(area.id), `${area.name} is paused.`);
        }}
      />

      <CoverageConfirmDialog
        open={pending === "archive"}
        title={`Archive ${area.name}?`}
        confirmLabel="Archive area"
        destructive
        busy={busy}
        confirmDisabled={detailLoading}
        requireTypedValue={hasBlastRadius && !detailLoading ? area.name : undefined}
        body={
          detailLoading ? (
            <div className="h-16 animate-pulse rounded-md bg-muted/60" />
          ) : (
            <>
              <p>
                Archiving hides {area.name} from admin lists and from every booking flow.
                Nothing beneath it is bookable while it is archived.
              </p>
              <p>
                Its {counts.zipCodeCount} ZIP code
                {counts.zipCodeCount === 1 ? "" : "s"} and the coverage rules of{" "}
                {counts.serviceCount} service{counts.serviceCount === 1 ? "" : "s"} are
                kept exactly as they are, so restoring is lossless.
                {openBookings !== undefined
                  ? ` ${openBookings} open booking${openBookings === 1 ? "" : "s"} ${
                      openBookings === 1 ? "is" : "are"
                    } unaffected.`
                  : ""}
              </p>
              <p>You can undo this from the Archived filter.</p>
            </>
          )
        }
        onCancel={() => setPending(null)}
        onConfirm={() => {
          setPending(null);
          void run(() => archiveArea(area.id), `${area.name} is archived.`);
        }}
      />

      <CoverageConfirmDialog
        open={pending === "restore"}
        title={`Restore ${area.name}?`}
        confirmLabel="Restore area"
        busy={busy}
        confirmDisabled={detailLoading}
        body={
          detailLoading ? (
            <div className="h-16 animate-pulse rounded-md bg-muted/60" />
          ) : (
            <>
              <p>
                {area.name} comes back{" "}
                <strong className="text-foreground">paused</strong>, not active — a
                market retired months ago must not silently reappear and become
                bookable mid-edit.
              </p>
              <p>
                Its {counts.zipCodeCount} ZIP code
                {counts.zipCodeCount === 1 ? "" : "s"} and service coverage are
                unchanged. Activate it when you are ready for customers to book.
              </p>
            </>
          )
        }
        onCancel={() => setPending(null)}
        onConfirm={() => {
          setPending(null);
          void run(
            () => restoreArea(area.id),
            `${area.name} restored — it is paused until you activate it.`,
          );
        }}
      />
    </Card>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
      {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
