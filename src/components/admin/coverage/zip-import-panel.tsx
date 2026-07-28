"use client";

import * as React from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { bulkImportZipCodes, MAX_BULK_IMPORT_ROWS } from "@/lib/admin/zip-codes";
import {
  CoverageApiError,
  type AreaResponse,
  type BulkImportSummary,
  type ZipImportConflictMode,
} from "@/lib/coverage/types";
import { AreaSelect } from "./area-select";
import { CoverageAlert, CoverageErrorAlert } from "./coverage-alert";
import { CoverageField } from "./coverage-field";
import {
  chunkRows,
  parseZipPaste,
  toImportRows,
  type ParsedZipRow,
  type ZipPasteResult,
} from "./zip-paste";

/** Rows rendered in a result list before it collapses into "…and N more". */
const MAX_VISIBLE_ROWS = 200;

const CONFLICT_MODES: {
  value: ZipImportConflictMode;
  label: string;
  hint: string;
}[] = [
  {
    value: "SKIP",
    label: "Skip",
    hint: "A ZIP that already exists anywhere is left exactly as it is.",
  },
  {
    value: "UPDATE",
    label: "Update",
    hint: "Refresh city and state on ZIPs that already exist in this area.",
  },
  {
    value: "MOVE",
    label: "Move",
    hint: "Re-home ZIPs that belong to another area. A ZIP pinned there by a service rule is refused and reported, never silently reinterpreted.",
  },
];

interface ImportFailure {
  key: string;
  zipCode: string;
  code: string;
  message: string;
  /** Source line in the pasted text, when the row maps back to one. */
  line?: number;
}

interface ImportRun {
  dryRun: boolean;
  summary: BulkImportSummary;
  failures: ImportFailure[];
  failuresTruncated: boolean;
  newlyCoveredServiceCount: number;
  chunksTotal: number;
  chunksCommitted: number;
  /** Set when a chunk threw — earlier chunks have already committed. */
  stoppedAfter: { chunkIndex: number; reason: string } | null;
}

const EMPTY_SUMMARY: BulkImportSummary = {
  received: 0,
  created: 0,
  updated: 0,
  moved: 0,
  skipped: 0,
  failed: 0,
};

function addSummary(a: BulkImportSummary, b: BulkImportSummary): BulkImportSummary {
  return {
    received: a.received + b.received,
    created: a.created + b.created,
    updated: a.updated + b.updated,
    moved: a.moved + b.moved,
    skipped: a.skipped + b.skipped,
    failed: a.failed + b.failed,
  };
}

function csvCell(value: string | number | undefined): string {
  const text = value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export interface ZipImportPanelProps {
  areas: AreaResponse[];
  areasLoading?: boolean;
  areasTruncated?: boolean;
  defaultAreaId?: string | null;
  /** Called after a real (non-dry) run so the page re-fetches the table. */
  onImported: () => void;
  onClose: () => void;
}

/**
 * Bulk paste import.
 *
 * Three phases in one card: paste -> preview (server `dryRun`) -> result. The
 * preview is a real server round trip, not a client guess, so "already exists in
 * Garner" is the truth rather than an assumption.
 *
 * Chunking is the client's job: the server caps one request at
 * `MAX_BULK_IMPORT_ROWS` so it finishes inside the platform function limit, and
 * chunks commit INDEPENDENTLY. That is safe only because import is idempotent on
 * the `zipCode` natural key — so a mid-run failure is reported honestly ("chunks
 * 1-2 committed, re-run to continue") instead of pretending to roll back.
 */
export function ZipImportPanel({
  areas,
  areasLoading,
  areasTruncated,
  defaultAreaId,
  onImported,
  onClose,
}: ZipImportPanelProps) {
  const [areaId, setAreaId] = React.useState<string | null>(defaultAreaId ?? null);
  const [defaultState, setDefaultState] = React.useState("");
  const [conflictMode, setConflictMode] = React.useState<ZipImportConflictMode>("SKIP");
  const [text, setText] = React.useState("");
  const [parsed, setParsed] = React.useState<ZipPasteResult>({
    rows: [],
    rejects: [],
    headerSkipped: false,
  });
  const [phase, setPhase] = React.useState<"input" | "preview" | "done">("input");
  const [run, setRun] = React.useState<ImportRun | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(
    null,
  );
  const [error, setError] = React.useState<unknown>(null);

  // Debounced parse: a 5,000-line paste is cheap to parse but not per keystroke.
  React.useEffect(() => {
    const timer = setTimeout(() => setParsed(parseZipPaste(text)), 250);
    return () => clearTimeout(timer);
  }, [text]);

  const targetArea = areaId === null ? null : areas.find((area) => area.id === areaId);
  const readyRows = parsed.rows;
  const chunks = React.useMemo(
    () => chunkRows(readyRows, MAX_BULK_IMPORT_ROWS),
    [readyRows],
  );
  const stateInvalid =
    defaultState.trim() !== "" && !/^[A-Za-z]{2}$/.test(defaultState.trim());
  const canSubmit =
    areaId !== null && readyRows.length > 0 && !stateInvalid && !busy && !areasLoading;

  /**
   * Submit every chunk in order and aggregate. `dryRun` runs the same code path
   * server-side with no writes, which is what makes the preview trustworthy.
   */
  const submit = React.useCallback(
    async (dryRun: boolean) => {
      if (areaId === null || readyRows.length === 0) return;
      setBusy(true);
      setError(null);
      setRun(null);
      setProgress({ done: 0, total: chunks.length });

      let summary = EMPTY_SUMMARY;
      const failures: ImportFailure[] = [];
      let failuresTruncated = false;
      let newlyCovered = 0;
      let committed = 0;
      let stoppedAfter: ImportRun["stoppedAfter"] = null;
      const trimmedState = defaultState.trim();

      for (let index = 0; index < chunks.length; index += 1) {
        const chunk: ParsedZipRow[] = chunks[index];
        try {
          const result = await bulkImportZipCodes({
            areaId,
            conflictMode,
            dryRun,
            ...(trimmedState !== "" ? { defaultState: trimmedState } : {}),
            rows: toImportRows(chunk),
          });
          summary = addSummary(summary, result.summary);
          newlyCovered = Math.max(newlyCovered, result.newlyCoveredServiceCount);
          failuresTruncated = failuresTruncated || result.errorsTruncated;
          for (const failure of result.failed) {
            // `row` is 1-based within the SUBMITTED chunk; map it back to the
            // pasted line so the admin can actually find and fix it.
            const source = chunk[failure.row - 1];
            failures.push({
              key: `${index}-${failure.row}-${failure.zipCode}`,
              zipCode: failure.zipCode,
              code: failure.code,
              message: failure.message,
              ...(source ? { line: source.line } : {}),
            });
          }
          if (!dryRun) committed += 1;
        } catch (err) {
          stoppedAfter = {
            chunkIndex: index,
            reason:
              err instanceof CoverageApiError ? err.message : "The request failed.",
          };
          if (index === 0) setError(err);
          break;
        } finally {
          setProgress({ done: index + 1, total: chunks.length });
        }
      }

      setRun({
        dryRun,
        summary,
        failures,
        failuresTruncated,
        newlyCoveredServiceCount: newlyCovered,
        chunksTotal: chunks.length,
        chunksCommitted: committed,
        stoppedAfter,
      });
      setPhase(dryRun ? "preview" : "done");
      setBusy(false);
      setProgress(null);
      if (!dryRun) onImported();
    },
    [areaId, chunks, conflictMode, defaultState, onImported, readyRows.length],
  );

  const downloadProblems = React.useCallback(() => {
    const lines = ["line,zipCode,code,message"];
    for (const reject of parsed.rejects) {
      lines.push(
        [reject.line, reject.raw, reject.code, reject.message].map(csvCell).join(","),
      );
    }
    for (const failure of run?.failures ?? []) {
      lines.push(
        [failure.line, failure.zipCode, failure.code, failure.message]
          .map(csvCell)
          .join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "zip-import-problems.csv";
    // The anchor must be IN the document (Firefox ignores click() on a detached
    // one) and the object URL must outlive the click (revoking synchronously
    // cancels the download in WebKit). This is the whole point of the feature —
    // the admin fixes and re-pastes only the failures — so it has to actually
    // save the file, not just look like it did.
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [parsed.rejects, run]);

  const problemCount = parsed.rejects.length + (run?.failures.length ?? 0);

  return (
    <Card className="mb-5 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Import ZIP codes
          </h2>
          <p className="text-sm text-muted-foreground">
            Paste one ZIP per line, or a comma / whitespace separated list. A header row
            is skipped.
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={busy}>
          Close
        </Button>
      </div>

      {error ? (
        <div className="mb-4">
          <CoverageErrorAlert
            error={error}
            fallback="The import request failed."
            onDismiss={() => setError(null)}
          />
        </div>
      ) : null}

      {phase === "input" ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="zip-import-area">
                Area for these ZIP codes
                <span className="ml-1.5 text-destructive" aria-hidden>
                  *
                </span>
              </Label>
              <AreaSelect
                id="zip-import-area"
                ariaLabel="Area for these ZIP codes"
                value={areaId}
                onChange={setAreaId}
                areas={areas}
                loading={areasLoading}
                truncated={areasTruncated}
                size="default"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Rows land ACTIVE, so they immediately inherit every area-wide grant in
                this area.
              </p>
            </div>

            <CoverageField
              label="Default state"
              htmlFor="zip-import-state"
              error={stateInvalid ? "State must be a 2-letter USPS code" : undefined}
              hint="Used for rows that do not carry their own state."
              optional
            >
              <Input
                id="zip-import-state"
                value={defaultState}
                maxLength={2}
                onChange={(event) => setDefaultState(event.target.value.toUpperCase())}
                placeholder="NC"
                aria-invalid={stateInvalid}
              />
            </CoverageField>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              If a ZIP code already exists
            </span>
            <div role="group" aria-label="Conflict handling" className="flex flex-wrap gap-1.5">
              {CONFLICT_MODES.map((mode) => (
                <Button
                  key={mode.value}
                  type="button"
                  size="sm"
                  variant={conflictMode === mode.value ? "default" : "outline"}
                  aria-pressed={conflictMode === mode.value}
                  onClick={() => setConflictMode(mode.value)}
                >
                  {mode.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {CONFLICT_MODES.find((mode) => mode.value === conflictMode)?.hint}
            </p>
          </div>

          <CoverageField
            label="ZIP codes"
            htmlFor="zip-import-text"
            hint="Accepted per line: ZIP · ZIP,City · ZIP,City,State. Separators: comma, tab, or two-plus spaces."
            required
          >
            <Textarea
              id="zip-import-text"
              rows={10}
              value={text}
              className="font-mono"
              onChange={(event) => setText(event.target.value)}
              placeholder={"27601,Raleigh,NC\n27603,Raleigh,NC\n27529\n27540   Holly Springs   NC"}
            />
          </CoverageField>

          <ParseSummary parsed={parsed} chunkCount={chunks.length} />

          {parsed.rejects.length > 0 ? (
            <ProblemList
              title={`${parsed.rejects.length} row${parsed.rejects.length === 1 ? "" : "s"} cannot be sent`}
              rows={parsed.rejects.map((reject) => ({
                key: `${reject.line}-${reject.raw}-${reject.code}`,
                left: reject.raw,
                right: `${reject.message} (line ${reject.line})`,
              }))}
            />
          ) : null}

          {busy && progress ? <ChunkProgress progress={progress} rows={readyRows.length} /> : null}

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="button" disabled={!canSubmit} onClick={() => void submit(true)}>
              Preview {readyRows.length} row{readyRows.length === 1 ? "" : "s"}
            </Button>
          </div>
        </div>
      ) : null}

      {phase === "preview" && run ? (
        <div className="flex flex-col gap-4">
          <CoverageAlert tone="info">
            <p className="font-medium text-foreground">
              Preview into {targetArea?.name ?? "the selected area"} — nothing has been
              written yet.
            </p>
            <p>
              {run.summary.created} new · {run.summary.updated} updated ·{" "}
              {run.summary.moved} moved · {run.summary.skipped} skipped ·{" "}
              {run.summary.failed} failed, from {run.summary.received} row
              {run.summary.received === 1 ? "" : "s"} sent.
            </p>
            {run.summary.created > 0 ? (
              <p>
                Those {run.summary.created} new ZIP code
                {run.summary.created === 1 ? "" : "s"} become bookable for{" "}
                {run.newlyCoveredServiceCount} service
                {run.newlyCoveredServiceCount === 1 ? "" : "s"} immediately.
              </p>
            ) : null}
          </CoverageAlert>

          {run.failures.length > 0 ? (
            <ProblemList
              title={`${run.summary.failed} row${run.summary.failed === 1 ? "" : "s"} the server refused`}
              truncated={run.failuresTruncated}
              rows={run.failures.map((failure) => ({
                key: failure.key,
                left: failure.zipCode,
                right:
                  failure.line !== undefined
                    ? `${failure.message} (line ${failure.line})`
                    : failure.message,
              }))}
            />
          ) : null}

          {parsed.rejects.length > 0 ? (
            <ProblemList
              title={`${parsed.rejects.length} row${parsed.rejects.length === 1 ? "" : "s"} were never sent`}
              rows={parsed.rejects.map((reject) => ({
                key: `${reject.line}-${reject.raw}-${reject.code}`,
                left: reject.raw,
                right: `${reject.message} (line ${reject.line})`,
              }))}
            />
          ) : null}

          {busy && progress ? <ChunkProgress progress={progress} rows={readyRows.length} /> : null}

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => setPhase("input")}
            >
              Back
            </Button>
            <Button
              type="button"
              disabled={busy || run.summary.created + run.summary.updated + run.summary.moved === 0}
              onClick={() => void submit(false)}
            >
              <Upload aria-hidden />
              Write {run.summary.created + run.summary.updated + run.summary.moved} ZIP
              code
              {run.summary.created + run.summary.updated + run.summary.moved === 1
                ? ""
                : "s"}
              {problemCount > 0 ? ` and skip ${problemCount}` : ""}
            </Button>
          </div>
        </div>
      ) : null}

      {phase === "done" && run ? (
        <div className="flex flex-col gap-4">
          <CoverageAlert tone={run.stoppedAfter ? "error" : "success"}>
            <p className="font-medium text-foreground">
              {run.summary.created} added · {run.summary.updated} updated ·{" "}
              {run.summary.moved} moved · {run.summary.skipped} skipped ·{" "}
              {run.summary.failed} failed
              {targetArea ? ` in ${targetArea.name}` : ""}.
            </p>
            {run.summary.created > 0 ? (
              <p>
                Now bookable for {run.newlyCoveredServiceCount} service
                {run.newlyCoveredServiceCount === 1 ? "" : "s"}.
              </p>
            ) : null}
            {run.stoppedAfter ? (
              <p>
                {run.stoppedAfter.chunkIndex === 0
                  ? "No batches committed."
                  : `Batches 1-${run.stoppedAfter.chunkIndex} of ${run.chunksTotal} committed.`}{" "}
                Batch {run.stoppedAfter.chunkIndex + 1} failed:{" "}
                {run.stoppedAfter.reason} Re-run to continue — ZIP codes that already
                landed are skipped, so a repeat paste is safe.
              </p>
            ) : null}
          </CoverageAlert>

          {run.failures.length > 0 ? (
            <ProblemList
              title={`${run.summary.failed} row${run.summary.failed === 1 ? "" : "s"} the server refused`}
              truncated={run.failuresTruncated}
              rows={run.failures.map((failure) => ({
                key: failure.key,
                left: failure.zipCode,
                right:
                  failure.line !== undefined
                    ? `${failure.message} (line ${failure.line})`
                    : failure.message,
              }))}
            />
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-2">
            {problemCount > 0 ? (
              <Button type="button" variant="outline" onClick={downloadProblems}>
                <Download aria-hidden />
                Download {problemCount} problem row
                {problemCount === 1 ? "" : "s"} as CSV
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRun(null);
                setPhase("input");
              }}
            >
              Import more
            </Button>
            <Button type="button" onClick={onClose}>
              Back to ZIP codes
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function ParseSummary({
  parsed,
  chunkCount,
}: {
  parsed: ZipPasteResult;
  chunkCount: number;
}) {
  const duplicates = parsed.rejects.filter(
    (reject) => reject.code === "DUPLICATE_IN_PASTE",
  ).length;
  const invalid = parsed.rejects.length - duplicates;
  return (
    <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">{parsed.rows.length} ready</span> ·{" "}
      {duplicates} duplicate{duplicates === 1 ? "" : "s"} in the paste · {invalid} invalid
      {parsed.headerSkipped ? " · header row skipped" : ""}
      {chunkCount > 1
        ? ` · sent in ${chunkCount} batches of up to ${MAX_BULK_IMPORT_ROWS}`
        : ""}
    </p>
  );
}

function ChunkProgress({
  progress,
  rows,
}: {
  progress: { done: number; total: number };
  rows: number;
}) {
  const percent =
    progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100);
  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <Progress value={percent} />
      <p className="text-xs text-muted-foreground">
        Batch {progress.done} of {progress.total} · {rows} row{rows === 1 ? "" : "s"} total
      </p>
    </div>
  );
}

function ProblemList({
  title,
  rows,
  truncated,
}: {
  title: string;
  rows: { key: string; left: string; right: string }[];
  truncated?: boolean;
}) {
  const visible = rows.slice(0, MAX_VISIBLE_ROWS);
  const hidden = rows.length - visible.length;
  return (
    <div className="rounded-md border border-border">
      <p className="border-b border-border bg-muted px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {/* A scrollable region needs to be focusable, or the list is unreachable
          without a pointer. */}
      <ul
        tabIndex={0}
        role="group"
        aria-label={title}
        className="max-h-64 divide-y divide-border overflow-y-auto text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {visible.map((row) => (
          <li key={row.key} className="flex flex-wrap gap-x-3 gap-y-0.5 px-3 py-2">
            <span className="font-mono text-foreground">{row.left}</span>
            <span className="text-muted-foreground">{row.right}</span>
          </li>
        ))}
      </ul>
      {hidden > 0 || truncated ? (
        <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
          {hidden > 0 ? `…and ${hidden} more.` : ""}
          {truncated
            ? " The server caps its per-row report, so some rows are not listed."
            : ""}
        </p>
      ) : null}
    </div>
  );
}
