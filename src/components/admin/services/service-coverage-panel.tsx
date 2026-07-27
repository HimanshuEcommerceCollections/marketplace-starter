"use client";

import * as React from "react";
import { MapPin, RotateCcw, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { FieldErrors } from "@/lib/forms/validate";
import type { AdminService } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { getServiceCoverage, putAreaCoverage } from "@/lib/admin/coverage";
import {
  CoverageApiError,
  type CoverageAreaEntry,
  type CoverageDocument,
  type CoverageMode,
  type PutAreaCoverageResult,
} from "@/lib/coverage/types";
import {
  AddAreaMenu,
  type CoverageUncoveredArea,
} from "./coverage/add-area-menu";
import { CoverageAreaCard } from "./coverage/coverage-area-card";
import { CoverageAreaEditor } from "./coverage/coverage-area-editor";
import {
  plural,
  VERSION_CONFLICT_TITLE,
  versionConflictBody,
} from "./coverage/coverage-copy";

/** How long the per-card "Saved" confirmation stays up. */
const SAVED_FLASH_MS = 4000;

/** Names listed inline in the "not covered" footer before it elides. */
const UNCOVERED_PREVIEW = 6;

interface Conflict {
  /** The market whose unsaved edit was refused, for specific copy. */
  areaName: string | null;
}

/**
 * Fold one successful per-area PUT back into the document.
 *
 * The PUT returns the recomputed entry plus the new version, so the card
 * re-renders from truth rather than from a guess. Document-level `summary` and
 * `totals` are not in that response, so a silent re-fetch follows — this
 * function never invents them.
 */
function applyAreaResult(
  doc: CoverageDocument,
  result: PutAreaCoverageResult,
): CoverageDocument {
  const { area, version } = result;
  const removed = area.mode === "NONE";
  const known = doc.areas.some((a) => a.areaId === area.areaId);

  const areas = removed
    ? doc.areas.filter((a) => a.areaId !== area.areaId)
    : known
      ? doc.areas.map((a) => (a.areaId === area.areaId ? area : a))
      : [...doc.areas, area];

  const ref: CoverageUncoveredArea = {
    areaId: area.areaId,
    name: area.name,
    slug: area.slug,
  };
  // The server never lists an ARCHIVED market as "addable" (it refuses every
  // mode but NONE there with 409 COVERAGE_AREA_ARCHIVED), so clearing an
  // archived market's stale rules must not put it into the Add-area menu for
  // the round trip it takes the silent re-fetch to correct us.
  const addable = removed && area.status !== "ARCHIVED";
  const uncoveredAreas = addable
    ? doc.uncoveredAreas.some((a) => a.areaId === area.areaId)
      ? doc.uncoveredAreas
      : [...doc.uncoveredAreas, ref]
    : removed
      ? doc.uncoveredAreas
      : doc.uncoveredAreas.filter((a) => a.areaId !== area.areaId);

  return { ...doc, version, areas, uncoveredAreas };
}

/** The footer that names the markets this service does not reach. */
function uncoveredLine(uncovered: CoverageUncoveredArea[]): string {
  if (uncovered.length === 0) {
    return "Not covered: none — this service reaches every area.";
  }
  const names = uncovered
    .slice(0, UNCOVERED_PREVIEW)
    .map((a) => a.name)
    .join(", ");
  const rest = uncovered.length - UNCOVERED_PREVIEW;
  const tail = rest > 0 ? ` and ${rest} more` : "";
  return `Not covered: ${names}${tail} (${uncovered.length} ${plural(uncovered.length, "area", "areas")}).`;
}

/** A card for a market the admin is adding, before anything is persisted. */
function draftEntryFor(area: CoverageUncoveredArea): CoverageAreaEntry {
  return {
    areaId: area.areaId,
    name: area.name,
    slug: area.slug,
    status: "ACTIVE",
    mode: "NONE",
    areaZipCount: 0,
    effectiveZipCount: 0,
    areaWide: false,
    available: false,
    autoIncludeNewZips: true,
    listedZips: [],
    summaryLine: `Choose how ${area.name} should be covered, then save.`,
    warning: null,
  };
}

export interface ServiceCoveragePanelProps {
  service: AdminService;
}

/**
 * Where customers can book this service — one card per market, one radio group
 * per card.
 *
 * The three business cases the owner actually describes ("everywhere in
 * Raleigh", "Raleigh except a couple of ZIPs", "only these ZIPs of Raleigh")
 * plus "not there at all" are the four radios in `CoverageAreaEditor`. Nothing
 * in this UI mentions allow, deny, precedence or inheritance.
 *
 * Three properties hold throughout:
 *
 *  - **Server-authored prose.** Card subtitles and ZIP counts come from the
 *    coverage document, never from client arithmetic over the mode.
 *  - **Optimistic concurrency, never a silent overwrite.** The document's
 *    `version` is echoed on every save; a 409 `COVERAGE_VERSION_STALE` puts up a
 *    blocking reload path instead of merging.
 *  - **Never optimistic.** Coverage decides whether customers can book, so every
 *    save renders the server's recomputed entry and then re-reads the document.
 */
export function ServiceCoveragePanel({ service }: ServiceCoveragePanelProps) {
  const [doc, setDoc] = React.useState<CoverageDocument | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [editingAreaId, setEditingAreaId] = React.useState<string | null>(null);
  const [savingAreaId, setSavingAreaId] = React.useState<string | null>(null);
  const [savedAreaId, setSavedAreaId] = React.useState<string | null>(null);
  const [conflict, setConflict] = React.useState<Conflict | null>(null);
  const [draftArea, setDraftArea] = React.useState<CoverageUncoveredArea | null>(
    null,
  );

  const savedTimer = React.useRef<number | null>(null);
  React.useEffect(
    () => () => {
      if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    },
    [],
  );

  const load = React.useCallback(
    async (options: { silent?: boolean } = {}) => {
      if (!options.silent) setLoading(true);
      setError(null);
      try {
        setDoc(await getServiceCoverage(service.id));
      } catch (err) {
        setError(
          err instanceof CoverageApiError
            ? err.message
            : "Failed to load coverage.",
        );
      } finally {
        if (!options.silent) setLoading(false);
      }
    },
    [service.id],
  );

  React.useEffect(() => {
    void load();
  }, [load]);

  const flashSaved = (areaId: string) => {
    setSavedAreaId(areaId);
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(
      () => setSavedAreaId(null),
      SAVED_FLASH_MS,
    );
  };

  /** PUT-replace one market's whole intent, carrying the document version. */
  const save = async (
    areaId: string,
    areaName: string,
    mode: CoverageMode,
    zipCodeIds: string[],
  ) => {
    if (!doc || savingAreaId !== null || conflict !== null) return;
    setSavingAreaId(areaId);
    setError(null);
    setFieldErrors({});
    try {
      const result = await putAreaCoverage(service.id, areaId, {
        version: doc.version,
        mode,
        zipCodeIds,
      });
      setDoc((prev) => (prev ? applyAreaResult(prev, result) : prev));
      setEditingAreaId(null);
      setDraftArea(null);
      flashSaved(areaId);
      // Document summary, totals and ordering are owned by the server.
      await load({ silent: true });
    } catch (err) {
      if (err instanceof CoverageApiError) {
        if (err.is("COVERAGE_VERSION_STALE")) {
          // Someone else changed this document. Do NOT merge, do NOT retry with
          // the version the server just told us — that is exactly the silent
          // overwrite the version exists to prevent.
          setConflict({ areaName });
        } else {
          setError(err.message);
          setFieldErrors(err.fieldErrors);
        }
      } else {
        setError("Something went wrong while saving coverage.");
      }
    } finally {
      setSavingAreaId(null);
    }
  };

  const resolveConflict = async () => {
    setConflict(null);
    setEditingAreaId(null);
    setDraftArea(null);
    setFieldErrors({});
    await load();
  };

  const startEdit = (areaId: string) => {
    if (savingAreaId !== null) return;
    setFieldErrors({});
    setError(null);
    if (draftArea && draftArea.areaId !== areaId) setDraftArea(null);
    setEditingAreaId(areaId);
  };

  const closeEdit = () => {
    if (savingAreaId !== null) return;
    setEditingAreaId(null);
    setDraftArea(null);
    setFieldErrors({});
  };

  const addArea = (area: CoverageUncoveredArea) => {
    setFieldErrors({});
    setError(null);
    setDraftArea(area);
    setEditingAreaId(area.areaId);
  };

  const busy = savingAreaId !== null || conflict !== null;
  // The document carries its own copy of the service row and is re-read after
  // every save, so it is never staler than the page prop and is often fresher
  // (publishing from the sibling Publish tab does not re-render this prop).
  // The prop is only the pre-load placeholder.
  const serviceName = doc?.service.name ?? service.name;
  const serviceIsLive = (doc?.service.status ?? service.status) === "ACTIVE";
  const uncovered = doc?.uncoveredAreas ?? [];
  const cards: Array<{ entry: CoverageAreaEntry; pending: boolean }> = [
    ...(draftArea
      ? [{ entry: draftEntryFor(draftArea), pending: true }]
      : []),
    ...(doc?.areas ?? []).map((entry) => ({ entry, pending: false })),
  ];

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Coverage
          </h2>
          <p className="text-sm text-muted-foreground">
            {`Where customers can book ${serviceName}. Pick one option per area — you never have to think about individual rules.`}
          </p>
        </div>
        <AddAreaMenu
          areas={uncovered}
          disabled={busy || loading}
          onSelect={addArea}
        />
      </div>

      {conflict ? (
        <div
          role="alert"
          className="mb-4 rounded-md border border-destructive bg-destructive/10 p-4"
        >
          <p className="text-sm font-semibold text-destructive">
            {VERSION_CONFLICT_TITLE}
          </p>
          <p className="mt-1 text-sm text-foreground">
            {versionConflictBody(conflict.areaName)}
          </p>
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => void resolveConflict()}
            >
              <RotateCcw aria-hidden />
              Reload coverage
            </Button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex flex-col gap-3">
          <div className="h-6 w-64 animate-pulse rounded-md bg-muted/60" />
          <div className="h-20 animate-pulse rounded-lg bg-muted/60" />
          <div className="h-20 animate-pulse rounded-lg bg-muted/60" />
          <div className="h-20 animate-pulse rounded-lg bg-muted/60" />
        </div>
      ) : !doc ? (
        <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          Coverage could not be loaded.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-foreground">{doc.summary}</p>

          {cards.length === 0 ? (
            <div
              className={
                serviceIsLive
                  ? "rounded-md border border-warning bg-warning/10 px-4 py-8 text-center"
                  : "rounded-md border border-dashed border-border px-4 py-8 text-center"
              }
            >
              <MapPin
                className="mx-auto mb-2 size-6 text-muted-foreground"
                aria-hidden
              />
              <p className="text-sm font-medium text-foreground">
                This service is not available anywhere yet.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {serviceIsLive
                  ? `${serviceName} is live but has no coverage, so nobody can book it. Add an area to fix that.`
                  : "Add an area to make it bookable."}
              </p>
              <div className="mt-4 flex justify-center">
                <AddAreaMenu
                  areas={uncovered}
                  disabled={busy}
                  onSelect={addArea}
                />
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {cards.map(({ entry, pending }) => {
                const expanded = editingAreaId === entry.areaId;
                const saving = savingAreaId === entry.areaId;
                return (
                  <li key={entry.areaId}>
                    <CoverageAreaCard
                      entry={entry}
                      serviceName={serviceName}
                      serviceIsLive={serviceIsLive}
                      expanded={expanded}
                      saving={saving}
                      justSaved={savedAreaId === entry.areaId}
                      disabled={busy && !saving}
                      pending={pending}
                      onEdit={() => startEdit(entry.areaId)}
                      onCancel={closeEdit}
                      onRemove={() =>
                        void save(entry.areaId, entry.name, "NONE", [])
                      }
                    >
                      <CoverageAreaEditor
                        entry={entry}
                        initialMode={pending ? "ALL" : undefined}
                        saving={saving}
                        blocked={conflict !== null}
                        fieldErrors={fieldErrors}
                        onSave={(mode, zipCodeIds) =>
                          void save(entry.areaId, entry.name, mode, zipCodeIds)
                        }
                        onCancel={closeEdit}
                      />
                    </CoverageAreaCard>
                  </li>
                );
              })}
            </ul>
          )}

          {cards.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <p className="text-sm text-muted-foreground">
                {uncoveredLine(uncovered)}
              </p>
              <AddAreaMenu
                areas={uncovered}
                disabled={busy}
                onSelect={addArea}
              />
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
