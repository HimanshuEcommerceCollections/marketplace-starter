"use client";

import * as React from "react";
import { Info, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { FieldErrors } from "@/lib/forms/validate";
import {
  MAX_LISTED_ZIPS,
  type CoverageAreaEntry,
  type CoverageListedZip,
  type CoverageMode,
} from "@/lib/coverage/types";
import {
  archivedAreaNotice,
  capNotice,
  discardNote,
  draftSummary,
  modeOptions,
  saveLabel,
  zipSectionCopy,
} from "./coverage-copy";
import { ZipSearchPicker } from "./zip-search-picker";

/** The two modes that carry a ZIP list. */
type ListMode = "ALL_EXCEPT" | "ONLY";

function isListMode(mode: CoverageMode): mode is ListMode {
  return mode === "ALL_EXCEPT" || mode === "ONLY";
}

function sameIds(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(b);
  return a.every((id) => set.has(id));
}

/**
 * Identity of one save payload.
 *
 * A server validation message describes the body that produced it. Once the
 * admin edits the mode or the list, that message is about a payload that no
 * longer exists, and leaving it on screen contradicts the controls above it.
 * Comparing this key against the last submitted one is what retires it — with
 * no extra callback into the panel, which owns `fieldErrors`.
 */
function payloadKey(mode: CoverageMode, zipCodeIds: string[]): string {
  return `${mode}:${[...zipCodeIds].sort().join(",")}`;
}

export interface CoverageAreaEditorProps {
  entry: CoverageAreaEntry;
  /**
   * Mode to open on. Only differs from `entry.mode` for a market the admin just
   * added, which defaults to `ALL` because that is overwhelmingly the case.
   */
  initialMode?: CoverageMode;
  saving: boolean;
  /** True while a version conflict is unresolved — saving must not be possible. */
  blocked?: boolean;
  /** Server-side validation messages keyed by body path. */
  fieldErrors: FieldErrors;
  onSave: (mode: CoverageMode, zipCodeIds: string[]) => void;
  onCancel: () => void;
}

/**
 * One market's coverage editor.
 *
 * Four radios and (for two of them) a ZIP list. That is the whole model an admin
 * has to hold: "all of it", "all of it except these", "only these", "none of
 * it". Switching a radio never silently drops configuration — the note under the
 * group says what a Save would clear, before it clears it.
 *
 * Save is a whole-intent PUT-replace for this area, carrying the coverage
 * document's version. Nothing is optimistic: coverage decides whether customers
 * can book, and the panel re-renders from the server's recomputed entry.
 */
export function CoverageAreaEditor({
  entry,
  initialMode,
  saving,
  blocked = false,
  fieldErrors,
  onSave,
  onCancel,
}: CoverageAreaEditorProps) {
  const baseId = React.useId();
  const legendId = `${baseId}-legend`;

  const startMode = initialMode ?? entry.mode;
  const [mode, setMode] = React.useState<CoverageMode>(startMode);

  /**
   * One list per polarity, kept apart on purpose.
   *
   * "All except" and "Only specific" invert the meaning of every chip, so a
   * single shared list would silently reinterpret an exclusion as an inclusion.
   * Clearing on every flip is the other wrong answer: a mis-click then destroys
   * work with no undo. Two lists mean flipping the radio back restores exactly
   * what was there, and only SAVE discards the other polarity's list — which
   * `discardNote` states in words before it happens.
   */
  const [exceptZips, setExceptZips] = React.useState<CoverageListedZip[]>(
    entry.mode === "ALL_EXCEPT" ? entry.listedZips : [],
  );
  const [onlyZips, setOnlyZips] = React.useState<CoverageListedZip[]>(
    entry.mode === "ONLY" ? entry.listedZips : [],
  );

  /** The payload the last Save attempt carried — see `payloadKey`. */
  const [attempted, setAttempted] = React.useState<string | null>(null);

  const listUsed = isListMode(mode);
  const listMode: ListMode = mode === "ONLY" ? "ONLY" : "ALL_EXCEPT";
  const zips = listMode === "ONLY" ? onlyZips : exceptZips;
  const setZips = listMode === "ONLY" ? setOnlyZips : setExceptZips;

  const section = zipSectionCopy(mode, entry.name);
  const submitIds = listUsed ? zips.map((z) => z.id) : [];
  const overCap = submitIds.length > MAX_LISTED_ZIPS;
  const incomplete = listUsed && submitIds.length === 0;
  const changed =
    mode !== entry.mode ||
    !sameIds(
      submitIds,
      entry.listedZips.map((z) => z.id),
    );
  /**
   * An ARCHIVED market refuses every mode but `NONE` (409
   * `COVERAGE_AREA_ARCHIVED`), so any other Save here is a guaranteed round trip
   * to an error. Read off `entry.status`, not off the warning prose — the
   * warning is a concatenated sentence and must never be parsed.
   */
  const archivedBlocked = entry.status === "ARCHIVED" && mode !== "NONE";
  /**
   * A warning keeps the card savable even when nothing changed: the server
   * authors several that ask for exactly this ("Re-save this area to fix it",
   * "… will be dropped on the next save"), and a disabled button would make
   * that instruction impossible to follow.
   */
  const canSave =
    (changed || entry.warning !== null) &&
    !incomplete &&
    !overCap &&
    !archivedBlocked &&
    !saving &&
    !blocked;

  // Server validation messages belong to the exact body that produced them.
  const showServerErrors = attempted === payloadKey(mode, submitIds);

  // Measured against the SAVED entry, not against the live chips: what a Save
  // discards is the persisted configuration, and reading it from the saved row
  // is also what lets the note survive a polarity flip.
  const note = discardNote(
    entry.mode,
    mode,
    entry.listedZips.length,
    entry.name,
  );
  const zipErrors = showServerErrors ? (fieldErrors.zipCodeIds ?? []) : [];
  const modeErrors = showServerErrors ? (fieldErrors.mode ?? []) : [];

  return (
    <div className="flex flex-col gap-5 border-t border-border bg-muted/20 p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        <h4 id={legendId} className="text-sm font-semibold text-foreground">
          Availability in {entry.name}
        </h4>
        <RadioGroup
          aria-labelledby={legendId}
          value={mode}
          disabled={saving || blocked}
          onValueChange={(value) => setMode(value as CoverageMode)}
          className="gap-2"
        >
          {modeOptions(entry.name).map((option) => {
            const optionId = `${baseId}-${option.value}`;
            const active = option.value === mode;
            return (
              <div
                key={option.value}
                className={cn(
                  "flex items-start gap-3 rounded-md border p-3 transition-colors",
                  active ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <RadioGroupItem
                  id={optionId}
                  value={option.value}
                  className="mt-0.5 shrink-0"
                />
                <div className="min-w-0">
                  <Label
                    htmlFor={optionId}
                    className="cursor-pointer text-sm font-medium text-foreground"
                  >
                    {option.label}
                  </Label>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {option.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </RadioGroup>

        {modeErrors.length > 0 ? (
          <p role="alert" className="text-xs text-destructive">
            {modeErrors.join(" ")}
          </p>
        ) : null}

        {archivedBlocked ? (
          <p className="flex items-start gap-2 rounded-md bg-warning/10 px-3 py-2 text-xs text-foreground">
            <TriangleAlert
              className="mt-0.5 size-3.5 shrink-0 text-warning"
              aria-hidden
            />
            {archivedAreaNotice(entry.name)}
          </p>
        ) : null}

        {note ? (
          <p className="flex items-start gap-2 rounded-md bg-warning/10 px-3 py-2 text-xs text-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden />
            {note}
          </p>
        ) : null}
      </div>

      {section ? (
        <div className="border-t border-border pt-4">
          <ZipSearchPicker
            areaId={entry.areaId}
            areaName={entry.name}
            selected={zips}
            copy={section}
            disabled={saving || blocked}
            onAdd={(zip) =>
              setZips((prev) =>
                prev.some((z) => z.id === zip.id) ? prev : [...prev, zip],
              )
            }
            onRemove={(zipCodeId) =>
              setZips((prev) => prev.filter((z) => z.id !== zipCodeId))
            }
            notice={
              overCap ? (
                <p className="flex items-start gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {capNotice(mode, submitIds.length, MAX_LISTED_ZIPS)}
                </p>
              ) : null
            }
          />
          {zipErrors.length > 0 ? (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {zipErrors.join(" ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-md border border-dashed border-border px-3 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {changed ? "Not saved yet" : "Current setting"}
        </p>
        <p className="mt-1 text-sm text-foreground">
          {draftSummary(mode, entry.name, zips.length)}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          aria-busy={saving}
          disabled={!canSave}
          onClick={() => {
            setAttempted(payloadKey(mode, submitIds));
            onSave(mode, submitIds);
          }}
        >
          {saving ? <Loader2 className="animate-spin" aria-hidden /> : null}
          {saving ? "Saving…" : saveLabel(entry.name)}
        </Button>
      </div>
    </div>
  );
}
