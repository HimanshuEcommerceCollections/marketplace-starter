"use client";

import * as React from "react";
import { Check, Loader2, Search, TriangleAlert, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  CoverageApiError,
  type CoverageListedZip,
  type ZipCodeResponse,
} from "@/lib/coverage/types";
import { plural, type ZipSectionCopy } from "./coverage-copy";
import {
  isAbortError,
  searchAreaZipCodes,
  ZIP_SEARCH_LIMIT,
  ZIP_SEARCH_MIN_CHARS,
} from "./zip-search";

const DEBOUNCE_MS = 300;

export interface ZipSearchPickerProps {
  areaId: string;
  areaName: string;
  /** The complete selected state. Chips are always visible and always removable. */
  selected: CoverageListedZip[];
  onAdd: (zip: CoverageListedZip) => void;
  onRemove: (zipCodeId: string) => void;
  /** Headings and verbs — the polarity lives here, never in colour. */
  copy: ZipSectionCopy;
  disabled?: boolean;
  /** Extra line under the chips (e.g. the 500-ZIP cap warning). */
  notice?: React.ReactNode;
}

/**
 * Search-and-chip ZIP selector scoped to one market.
 *
 * Why not a multi-select or a combobox over every option: an area can hold
 * thousands of ZIPs, so the full list is NEVER fetched. Search runs server-side
 * (300ms debounce, `AbortController` so a slow response cannot overwrite a newer
 * one), results are hard-capped at 20 with an explicit "N more" footer, and the
 * chips above the box are the entire selected state — bounded by construction,
 * since exclusion lists are dozens rather than thousands.
 *
 * The results panel renders INLINE rather than in a portal: it sits inside an
 * already-expanded card, which removes all positioning, collision and
 * focus-trap work. Keyboard model is the ARIA combobox pattern — focus never
 * leaves the input, Up/Down move `aria-activedescendant`, Enter adds, Escape
 * clears.
 */
export function ZipSearchPicker({
  areaId,
  areaName,
  selected,
  onAdd,
  onRemove,
  copy,
  disabled = false,
  notice,
}: ZipSearchPickerProps) {
  const baseId = React.useId();
  const inputId = `${baseId}-zip-search`;
  const listId = `${baseId}-zip-results`;
  const hintId = `${baseId}-zip-hint`;
  const statusId = `${baseId}-zip-status`;
  const optionId = React.useCallback(
    (index: number) => `${baseId}-zip-option-${index}`,
    [baseId],
  );

  const [query, setQuery] = React.useState("");
  const [term, setTerm] = React.useState("");
  const [results, setResults] = React.useState<ZipCodeResponse[]>([]);
  const [total, setTotal] = React.useState(0);
  const [searching, setSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [searched, setSearched] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const listRef = React.useRef<HTMLDivElement>(null);

  const selectedIds = React.useMemo(
    () => new Set(selected.map((z) => z.id)),
    [selected],
  );

  // Debounce keystrokes into one search term.
  React.useEffect(() => {
    const timer = window.setTimeout(() => setTerm(query.trim()), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  // Nothing is fetched below the minimum length. Previous results stay mounted
  // while a new request is in flight, so the panel never strobes.
  React.useEffect(() => {
    if (term.length < ZIP_SEARCH_MIN_CHARS) {
      setResults([]);
      setTotal(0);
      setSearched(false);
      setSearchError(null);
      setActiveIndex(-1);
      // Backspacing out of a search aborts the in-flight request, whose own
      // `finally` deliberately does not clear this flag (an abort means a NEWER
      // request owns it). Nothing newer exists here, so clear it or the spinner
      // never stops.
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    setSearching(true);
    setSearchError(null);

    void (async () => {
      try {
        const found = await searchAreaZipCodes({
          areaId,
          search: term,
          signal: controller.signal,
        });
        setResults(found.items);
        setTotal(found.total);
        setSearched(true);
        setActiveIndex(found.items.length > 0 ? 0 : -1);
      } catch (err) {
        if (isAbortError(err)) return;
        setResults([]);
        setTotal(0);
        setSearched(true);
        setActiveIndex(-1);
        setSearchError(
          err instanceof CoverageApiError
            ? err.message
            : "Could not search ZIP codes. Try again.",
        );
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    })();

    return () => controller.abort();
  }, [areaId, term]);

  // Keep the active option in view when arrowing through a scrolled panel.
  React.useEffect(() => {
    if (activeIndex < 0) return;
    const node = listRef.current?.children[activeIndex];
    if (node instanceof HTMLElement) node.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const add = React.useCallback(
    (option: ZipCodeResponse) => {
      if (disabled || selectedIds.has(option.id)) return;
      onAdd({
        id: option.id,
        zipCode: option.zipCode,
        city: option.city,
        status: option.status,
      });
    },
    [disabled, onAdd, selectedIds],
  );

  const showList = term.length >= ZIP_SEARCH_MIN_CHARS;
  /**
   * Whether an element with `role="listbox"` is actually on the page. The panel
   * also renders for the error and no-match cases, which carry prose rather than
   * options — pointing `aria-controls` at an id that does not exist, or claiming
   * `aria-expanded` over a popup with no options, is worse than saying nothing.
   */
  const listboxOpen = showList && searchError === null && results.length > 0;
  const hidden = total > results.length ? total - results.length : 0;

  /**
   * What the live region announces. Rendered into an ALWAYS-MOUNTED element:
   * a `role="status"` node that is inserted into the DOM with its text already
   * in place is frequently not announced at all, which is precisely the async
   * result that most needs announcing.
   */
  const liveMessage = !showList
    ? ""
    : searching
      ? "Searching."
      : searchError !== null
        ? searchError
        : `${results.length} of ${total} ${plural(total, "match", "matches")} shown.`;

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (query.length > 0) {
        event.preventDefault();
        setQuery("");
        // Collapse the panel now rather than after the debounce window — a
        // 300ms-stale result list under a cleared box reads as a broken Escape.
        setTerm("");
      }
      return;
    }
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(results.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = results[activeIndex];
      if (option) add(option);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-foreground">
          {copy.heading} ({selected.length})
        </h4>

        {selected.length === 0 ? (
          <p className="text-sm text-muted-foreground">{copy.emptyHint}</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {selected.map((zip) => (
              <li key={zip.id}>
                <span className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 py-1 pl-2.5 pr-1 text-sm text-foreground">
                  <span className="font-mono font-medium">{zip.zipCode}</span>
                  {zip.city ? (
                    <span className="text-muted-foreground">{zip.city}</span>
                  ) : null}
                  {zip.status !== "ACTIVE" ? (
                    <span className="text-xs uppercase text-muted-foreground">
                      {zip.status === "INACTIVE" ? "Paused" : "Archived"}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    aria-label={`Remove ${zip.zipCode}`}
                    disabled={disabled}
                    onClick={() => onRemove(zip.id)}
                    className="inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        {notice}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={inputId}>
          Search {areaName} ZIP codes to {copy.actionVerb.toLowerCase()}
        </Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"
            aria-hidden
          />
          <Input
            id={inputId}
            className="pl-9"
            role="combobox"
            autoComplete="off"
            aria-expanded={listboxOpen}
            aria-controls={listboxOpen ? listId : undefined}
            aria-autocomplete="list"
            // Only reference the hint while it is actually rendered — a
            // dangling `aria-describedby` is worse than none.
            aria-describedby={showList ? undefined : hintId}
            aria-activedescendant={
              listboxOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
            }
            placeholder="ZIP code or city"
            value={query}
            disabled={disabled}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
          />
          {searching ? (
            <Loader2
              className="absolute right-3 top-3 size-4 animate-spin text-muted-foreground"
              aria-hidden
            />
          ) : null}
        </div>

        {!showList ? (
          <p id={hintId} className="text-xs text-muted-foreground">
            Type at least {ZIP_SEARCH_MIN_CHARS} characters to search{" "}
            {areaName} ZIP codes by code or city.
          </p>
        ) : null}
        <p id={statusId} className="sr-only" role="status" aria-live="polite">
          {liveMessage}
        </p>
      </div>

      {showList ? (
        <div className="rounded-md border border-border">
          {searchError ? (
            <p className="flex items-center gap-2 px-3 py-3 text-sm text-destructive">
              <TriangleAlert className="size-4 shrink-0" aria-hidden />
              {searchError}
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              {searching || !searched
                ? "Searching…"
                : `No ZIP code in ${areaName} matches that. Add it under Coverage, ZIP codes first.`}
            </p>
          ) : (
            <>
              <div
                ref={listRef}
                id={listId}
                role="listbox"
                aria-label={`${areaName} ZIP codes`}
                aria-busy={searching}
                className={cn(
                  "max-h-64 overflow-y-auto",
                  searching && "opacity-60",
                )}
              >
                {results.map((option, index) => {
                  const isSelected = selectedIds.has(option.id);
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={option.id}
                      id={optionId(index)}
                      type="button"
                      role="option"
                      tabIndex={-1}
                      aria-selected={isActive}
                      disabled={disabled || isSelected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => add(option)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors disabled:cursor-default",
                        isActive && !isSelected
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="font-mono font-medium">
                          {option.zipCode}
                        </span>
                        <span className="truncate text-muted-foreground">
                          {option.city ?? "Unknown city"}
                        </span>
                        {option.status !== "ACTIVE" ? (
                          <span className="shrink-0 text-xs uppercase text-muted-foreground">
                            Paused
                          </span>
                        ) : null}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          <Check className="size-3.5" aria-hidden />
                          {copy.alreadyLabel}
                        </span>
                      ) : (
                        <span className="shrink-0 text-xs font-medium text-primary">
                          {copy.actionVerb}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {hidden > 0 ? (
                <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                  {`${hidden.toLocaleString("en-US")} more ${plural(hidden, "match", "matches")} — keep typing to narrow it down. Showing the first ${ZIP_SEARCH_LIMIT}.`}
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
