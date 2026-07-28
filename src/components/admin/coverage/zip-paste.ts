import type { BulkImportZipRow } from "@/lib/admin/zip-codes";

/**
 * Pure parser for the bulk-import textarea. No I/O, no React — the one artifact
 * in this feature where a bug silently corrupts data, so it is deliberately
 * separate and deliberately boring.
 *
 * The browser parses, not the server: multipart cannot traverse `proxyJson`, and
 * server-side CSV means owning BOMs, quoting and delimiter sniffing.
 */

/** A row that survived parsing, tagged with the line it came from. */
export interface ParsedZipRow {
  /** 1-based line in the pasted text — the only number the admin can act on. */
  line: number;
  zipCode: string;
  city?: string;
  state?: string;
}

export type ZipPasteRejectCode = "ZIP_INVALID" | "DUPLICATE_IN_PASTE";

export interface ZipPasteReject {
  line: number;
  raw: string;
  code: ZipPasteRejectCode;
  message: string;
}

export interface ZipPasteResult {
  rows: ParsedZipRow[];
  rejects: ZipPasteReject[];
  /** True when a header line ("zip,city,state") was recognised and skipped. */
  headerSkipped: boolean;
}

/** Field separators: comma, semicolon, tab, or two-or-more spaces. */
const FIELD_SPLIT = /[,;\t]|\s{2,}/;

/**
 * Canonicalise to exactly 5 ASCII digits, or null.
 *
 * String-only, always: `ZipCode.zipCode` is TEXT and "07001" must never become
 * 7001. Deliberately strict rather than "strip every non-digit" — "2760X" is a
 * typo the admin must see, not something to silently repair into "2760".
 *
 *   "27601" | " 27601 " | "27601-1234" | "276011234" -> "27601"
 *   "2760" | "7501X" | "27601-12" | ""               -> null
 */
export function normalizeZipInput(raw: string): string | null {
  const value = raw.trim();
  if (/^\d{5}$/.test(value)) return value;
  const plusFour = /^(\d{5})-?(\d{4})$/.exec(value);
  return plusFour ? plusFour[1] : null;
}

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/(^|[\s'\-/])(\p{L})/gu, (_match, prefix: string, letter: string) =>
      prefix + letter.toUpperCase(),
    );
}

function looksLikeHeader(fields: string[]): boolean {
  const first = fields[0] ?? "";
  return normalizeZipInput(first) === null && /^(zip|postal|code)/i.test(first.trim());
}

/** One line -> zero or more `[zip, city?, state?]` tuples. */
function tuplesFromLine(line: string): string[][] {
  const fields = line.split(FIELD_SPLIT).map((field) => field.trim());
  if (fields.length > 1) return [fields];

  // A single field: either one ZIP, a space-separated LIST of ZIPs, or
  // "27540 Holly Springs NC" written with single spaces.
  const tokens = (fields[0] ?? "").split(/\s+/).filter((token) => token !== "");
  if (tokens.length <= 1) return [tokens];
  if (tokens.every((token) => normalizeZipInput(token) !== null)) {
    return tokens.map((token) => [token]);
  }
  const [zip, ...rest] = tokens;
  const last = rest[rest.length - 1] ?? "";
  if (rest.length > 1 && /^[A-Za-z]{2}$/.test(last)) {
    return [[zip, rest.slice(0, -1).join(" "), last]];
  }
  return [[zip, rest.join(" ")]];
}

/**
 * Parse pasted text. Accepts, per line: `ZIP`, `ZIP,City`, `ZIP,City,State`, and
 * whitespace- or comma-separated lists of bare ZIPs. Duplicates keep the FIRST
 * occurrence and report the rest, because that is what makes a re-paste after a
 * fix behave predictably.
 */
export function parseZipPaste(input: string): ZipPasteResult {
  const rows: ParsedZipRow[] = [];
  const rejects: ZipPasteReject[] = [];
  const seen = new Map<string, number>();
  let headerSkipped = false;
  let sawData = false;

  // Strip a UTF-8 BOM: pasting from Excel/Notepad routinely carries one, and it
  // would otherwise make the very first ZIP unparseable.
  const lines = input.replace(/^\uFEFF/, "").split(/\r?\n/);

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (line === "") return;
    const lineNumber = index + 1;

    if (!sawData && looksLikeHeader(line.split(FIELD_SPLIT).map((f) => f.trim()))) {
      headerSkipped = true;
      sawData = true;
      return;
    }
    sawData = true;

    for (const tuple of tuplesFromLine(line)) {
      const rawZip = tuple[0] ?? "";
      const zipCode = normalizeZipInput(rawZip);
      if (zipCode === null) {
        rejects.push({
          line: lineNumber,
          raw: rawZip === "" ? line : rawZip,
          code: "ZIP_INVALID",
          message: "Not a 5-digit ZIP code",
        });
        continue;
      }

      const firstSeen = seen.get(zipCode);
      if (firstSeen !== undefined) {
        rejects.push({
          line: lineNumber,
          raw: zipCode,
          code: "DUPLICATE_IN_PASTE",
          message: `Duplicate of line ${firstSeen}`,
        });
        continue;
      }
      seen.set(zipCode, lineNumber);

      const rawCity = (tuple[1] ?? "").trim();
      const rawState = (tuple[2] ?? "").trim();
      rows.push({
        line: lineNumber,
        zipCode,
        ...(rawCity !== "" ? { city: titleCase(rawCity) } : {}),
        ...(rawState !== "" ? { state: rawState.toUpperCase() } : {}),
      });
    }
  });

  return { rows, rejects, headerSkipped };
}

/** Strip the source-line bookkeeping before sending rows upstream. */
export function toImportRows(rows: ParsedZipRow[]): BulkImportZipRow[] {
  return rows.map((row) => ({
    zipCode: row.zipCode,
    ...(row.city !== undefined ? { city: row.city } : {}),
    ...(row.state !== undefined ? { state: row.state } : {}),
  }));
}

/** Split into request-sized batches. The server caps a single request. */
export function chunkRows<T>(rows: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < rows.length; i += size) chunks.push(rows.slice(i, i + size));
  return chunks;
}
