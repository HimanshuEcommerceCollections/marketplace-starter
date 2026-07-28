import type { CoverageAreaEntry, CoverageMode } from "@/lib/coverage/types";

/**
 * Every sentence the coverage editor says, in one place.
 *
 * The words *allow*, *deny*, *rule*, *override*, *precedence* and *inherit*
 * appear nowhere below, on purpose: an admin expresses intent in the product
 * owner's own vocabulary and the rule engine stays invisible.
 *
 * DIVISION OF LABOUR, and it matters:
 *   - The prose on a SAVED card is `entry.summaryLine`, authored by the server.
 *     `fallbackSummaryLine()` exists only for the degenerate case where that
 *     string is empty; it is never preferred over the server's.
 *   - The prose in the OPEN editor describes the admin's UNSAVED intent, which
 *     no server has been asked about yet. It is always rendered as pending and
 *     deliberately states intent (what is listed) rather than inventing
 *     effective ZIP counts the server has not computed.
 */

/** `plural(1, "ZIP code", "ZIP codes")` -> "ZIP code". */
export function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

/** "1 ZIP code" / "4 ZIP codes". */
export function zipCodes(n: number): string {
  return `${n.toLocaleString("en-US")} ${plural(n, "ZIP code", "ZIP codes")}`;
}

export interface CoverageModeOption {
  value: CoverageMode;
  label: string;
  sublabel: string;
}

/**
 * The four choices, in the order an admin thinks about them: widest first,
 * removal last. These labels ARE the mental model — a mode is chosen by reading
 * a sentence about this market, not by understanding a rule engine.
 */
export function modeOptions(areaName: string): CoverageModeOption[] {
  return [
    {
      value: "ALL",
      label: `All of ${areaName}`,
      sublabel: `Every ZIP code in ${areaName}, including ZIP codes added later.`,
    },
    {
      value: "ALL_EXCEPT",
      label: `All of ${areaName} except specific ZIP codes`,
      sublabel: `Everywhere in ${areaName} except the ZIP codes you list.`,
    },
    {
      value: "ONLY",
      label: "Only specific ZIP codes",
      sublabel: `${areaName} itself is not covered — only the ZIP codes you list. ZIP codes added to ${areaName} later are not included.`,
    },
    {
      value: "NONE",
      label: "Not covered",
      sublabel: `Removes ${areaName} from this service.`,
    },
  ];
}

/** Short mode name for the card badge. */
export function modeBadgeLabel(mode: CoverageMode): string {
  switch (mode) {
    case "ALL":
      return "All ZIP codes";
    case "ALL_EXCEPT":
      return "All except some";
    case "ONLY":
      return "Selected ZIP codes";
    case "NONE":
      return "Not covered";
  }
}

/**
 * Read-only tri-state glyph, purely decorative (always `aria-hidden`) — the mode
 * is also stated in words beside it, so nothing depends on recognising a shape.
 */
export function modeGlyph(mode: CoverageMode): string {
  switch (mode) {
    case "ALL":
      return "●";
    case "ALL_EXCEPT":
      return "◐";
    case "ONLY":
      return "○";
    case "NONE":
      return "—";
  }
}

/**
 * The count pair beside the area name — "12 of 14 ZIP codes".
 *
 * Both numbers come from the server rollup; this function only formats them. An
 * area-wide market with zero ZIPs is COVERED, not "0 of 0" — reporting it as
 * unavailable is what makes every ZIP-less market silently vanish.
 */
export function zipCountLabel(entry: CoverageAreaEntry): string {
  if (entry.mode === "NONE") return "Not available";
  if (entry.areaZipCount === 0) {
    return entry.areaWide ? "Covered area-wide" : "No ZIP codes yet";
  }
  if (entry.mode === "ALL") {
    return `All ${zipCodes(entry.areaZipCount)}`;
  }
  return `${entry.effectiveZipCount.toLocaleString("en-US")} of ${zipCodes(entry.areaZipCount)}`;
}

/**
 * Last-resort card prose. The server authors `summaryLine` for every mode, so
 * this only runs if that field arrives empty.
 */
export function fallbackSummaryLine(entry: CoverageAreaEntry): string {
  const listed = entry.listedZips.length;
  switch (entry.mode) {
    case "ALL":
      return entry.areaZipCount === 0
        ? `Available everywhere in ${entry.name} — covered area-wide.`
        : `Available everywhere in ${entry.name} — all ${zipCodes(entry.areaZipCount)}.`;
    case "ALL_EXCEPT":
      return `Available in ${entry.name} except ${zipCodes(listed)}.`;
    case "ONLY":
      return `Available in ${entry.effectiveZipCount} of ${zipCodes(entry.areaZipCount)} in ${entry.name}.`;
    case "NONE":
      return `Not available in ${entry.name}.`;
  }
}

/** Headings and verbs for the ZIP list. The heading carries the polarity — never colour. */
export interface ZipSectionCopy {
  heading: string;
  /** Button text on a search result. */
  actionVerb: string;
  /** Shown instead of the button when a result is already listed. */
  alreadyLabel: string;
  /** Shown when nothing is listed yet. */
  emptyHint: string;
}

export function zipSectionCopy(
  mode: CoverageMode,
  areaName: string,
): ZipSectionCopy | null {
  if (mode === "ALL_EXCEPT") {
    return {
      heading: "Excluded ZIP codes",
      actionVerb: "Exclude",
      alreadyLabel: "Already excluded",
      emptyHint: `No ZIP codes excluded yet. Search below to exclude one from ${areaName}.`,
    };
  }
  if (mode === "ONLY") {
    return {
      heading: "Included ZIP codes",
      actionVerb: "Include",
      alreadyLabel: "Already included",
      emptyHint: `No ZIP codes included yet. Search below to add one from ${areaName}.`,
    };
  }
  // ALL and NONE need no list at all: fewer visible controls, fewer wrong states.
  return null;
}

/**
 * The pending, unsaved effect of the radio the admin just clicked. Always
 * rendered under a "not saved yet" label, and deliberately describes what is
 * listed rather than an effective ZIP count the server has not recomputed.
 */
export function draftSummary(
  mode: CoverageMode,
  areaName: string,
  listedCount: number,
): string {
  switch (mode) {
    case "ALL":
      return `Available everywhere in ${areaName} — every ZIP code, including ones added later.`;
    case "ALL_EXCEPT":
      return listedCount === 0
        ? `Nothing is excluded yet, so this is the same as All of ${areaName}. Add a ZIP code to exclude, or pick a different option.`
        : `Available everywhere in ${areaName} except the ${zipCodes(listedCount)} listed above.`;
    case "ONLY":
      return listedCount === 0
        ? `No ZIP codes are included yet, so nothing in ${areaName} would be bookable. Add a ZIP code to include, or pick a different option.`
        : `Available in only the ${zipCodes(listedCount)} listed above — the rest of ${areaName} is not covered.`;
    case "NONE":
      return `${areaName} will be removed from this service, so nothing there will be bookable.`;
  }
}

/**
 * What switching the radio throws away, said out loud BEFORE Save. Switching a
 * mode never silently drops configuration.
 *
 * `from` / `listedCount` are the SAVED mode and the SAVED list length, because
 * what a Save actually discards is the persisted configuration — and reading
 * them from the saved row is also what keeps the note truthful across a
 * polarity flip, where the on-screen chips have already changed.
 */
export function discardNote(
  from: CoverageMode,
  to: CoverageMode,
  listedCount: number,
  areaName: string,
): string | null {
  if (from === to) return null;
  if (to === "NONE") {
    return `${areaName} and its ZIP code settings will be removed from this service.`;
  }
  if (listedCount === 0) return null;

  // "your 2 excluded ZIP codes", not "your 2 ZIP codes excluded" — the adjective
  // goes before the noun, and this sentence is read under time pressure.
  const listedNoun = `${listedCount.toLocaleString("en-US")} ${
    from === "ALL_EXCEPT" ? "excluded" : "included"
  } ${plural(listedCount, "ZIP code", "ZIP codes")}`;

  if (to === "ALL") {
    return `Your ${listedNoun} will be cleared — all of ${areaName} becomes available.`;
  }
  if (to === "ALL_EXCEPT") {
    return `Your ${listedNoun} will be cleared — you pick which ZIP codes to exclude instead.`;
  }
  return `Your ${listedNoun} will be cleared — you pick which ZIP codes to include instead.`;
}

/**
 * Why an archived market's coverage cannot be granted, and the two ways out.
 *
 * The server refuses every mode but `NONE` on an `ARCHIVED` area with 409
 * `COVERAGE_AREA_ARCHIVED`, so offering an enabled Save there is a guaranteed
 * round trip to an error. Said up front instead, with the one action that DOES
 * work (clearing the market) still available.
 */
export function archivedAreaNotice(areaName: string): string {
  return `${areaName} is archived, so coverage there cannot be changed. Restore the market under Coverage, Areas — or choose "Not covered" to clear the rules it still carries.`;
}

/**
 * Pre-flight message for the server's 500-ZIP cap. Real validation, not a
 * limit: anyone listing 500+ exclusions meant "Only specific ZIP codes", and
 * saying so is more useful than a bare number.
 */
export function capNotice(
  mode: CoverageMode,
  listedCount: number,
  cap: number,
): string {
  const head = `That is ${zipCodes(listedCount)}, more than the ${cap} a single area can list.`;
  return mode === "ALL_EXCEPT"
    ? `${head} Switch this area to Only specific ZIP codes instead.`
    : `${head} Remove some, or cover the area with All except instead.`;
}

/** Save-button text. Named so a page with twelve cards is never ambiguous. */
export function saveLabel(areaName: string): string {
  return `Save ${areaName} coverage`;
}

/** Copy for the inline "remove this market" confirmation. */
export function removeConfirmCopy(
  entry: CoverageAreaEntry,
  serviceName: string,
  serviceIsLive: boolean,
): { title: string; body: string; confirmLabel: string } {
  const reach =
    entry.effectiveZipCount > 0
      ? `Customers in ${zipCodes(entry.effectiveZipCount)} will no longer be able to book it.`
      : `Nothing in ${entry.name} is bookable today, so no customer loses access.`;
  return {
    title: `Remove ${entry.name} from ${serviceName}?`,
    body: serviceIsLive
      ? `${serviceName} is live. ${reach} You can add ${entry.name} back at any time.`
      : `${entry.name} and its ZIP code settings are removed from this service. You can add it back at any time.`,
    confirmLabel: `Remove ${entry.name}`,
  };
}

/** The version-conflict path. Reload, never merge. */
export const VERSION_CONFLICT_TITLE = "Coverage changed while you were editing";

export function versionConflictBody(areaName: string | null): string {
  return areaName
    ? `Someone else updated this service's coverage. Reload to see the current settings — your unsaved changes to ${areaName} will be lost.`
    : "Someone else updated this service's coverage. Reload to see the current settings — your unsaved changes will be lost.";
}
