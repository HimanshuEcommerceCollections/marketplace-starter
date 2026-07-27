import type { FieldErrors } from "@/lib/forms/validate";
import type { PaginationMeta, ServiceStatus } from "@/lib/admin/types";

/**
 * THE wire contract for the coverage feature — operating areas, their ZIP codes,
 * and per-service coverage rules.
 *
 * Mirrored by hand from the Express API's own code (the code is the contract):
 *
 *   Server/src/modules/areas/areas.types.ts
 *   Server/src/modules/zipCodes/zip-codes.types.ts
 *   Server/src/modules/coverage/coverage.types.ts
 *   Server/prisma/schema.prisma   (GeoStatus, CoverageEffect, CoverageSource)
 *
 * Two rules for anyone editing this file:
 *
 * 1. Field names are IDENTICAL to the server's, always. Renaming one here to
 *    read better locally is how a serializer change silently stops arriving.
 * 2. `DateTime` columns cross the wire as ISO strings, so they are typed
 *    `string` and are never converted in the data layer.
 */

export type { PaginationMeta };

// ───────────────────────────────────────────────────────────────────────────────
// Enums (string-literal unions + `as const` lists for iteration in the UI)
// ───────────────────────────────────────────────────────────────────────────────

/** prisma enum GeoStatus. `ARCHIVED` IS the soft delete — there is no DELETE. */
export const GEO_STATUSES = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const;
export type GeoStatus = (typeof GEO_STATUSES)[number];

/**
 * The statuses a STAFF toggle route accepts.
 *
 * `POST /zip-codes/:id/status` and `POST /zip-codes/bulk/status` narrow to these
 * two on purpose (zip-codes.validation.ts `liveStatusSchema`): `/archive` and
 * `/restore` are the only doors in and out of `ARCHIVED` and they are
 * admin-only. NOTE the asymmetry — `POST /areas/:id/status` still accepts the
 * full `GeoStatus` and re-checks the caller's role in the service layer.
 */
export const LIVE_GEO_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type LiveGeoStatus = (typeof LIVE_GEO_STATUSES)[number];

/** prisma enum CoverageEffect — how one stored rule votes. */
export const COVERAGE_EFFECTS = ["ALLOW", "DENY"] as const;
export type CoverageEffect = (typeof COVERAGE_EFFECTS)[number];

/** prisma enum CoverageSource — which tier authorised an allow. Never set on a deny. */
export const COVERAGE_SOURCES = [
  "ZIP_RULE",
  "AREA_RULE",
  "AREA_FALLBACK",
  "NOT_APPLICABLE",
] as const;
export type CoverageSource = (typeof COVERAGE_SOURCES)[number];

/**
 * The admin editor's 4-mode per-area control. A projection COMPUTED by the
 * server, never a stored column — storage is the two `effect` values.
 *
 *   ALL         area row ALLOW, no ZIP rows                     (all of Raleigh)
 *   ALL_EXCEPT  area row ALLOW + >=1 DENY ZIP rule              (all except …)
 *   ONLY        area row DENY  + >=1 ALLOW ZIP rule             (only these ZIPs)
 *   NONE        no area row, no ZIP rows                        (not covered)
 */
export const COVERAGE_MODES = ["ALL", "ALL_EXCEPT", "ONLY", "NONE"] as const;
export type CoverageMode = (typeof COVERAGE_MODES)[number];

/** Which precedence tier produced the verdict. Staff-visible only. */
export type CoverageTier = "ZIP" | "AREA";

/**
 * The INTERNAL reason a decision came out the way it did. Returned only to
 * staff callers; anonymous callers get `PublicCoverageReason` instead.
 */
export type CoverageReason =
  | "NOT_LOCATION_BOUND"
  | "SERVICE_NOT_BOOKABLE"
  | "ZIP_INVALID"
  | "UNKNOWN_ZIP"
  | "ZIP_INACTIVE"
  | "AREA_INACTIVE"
  | "ALLOWED_BY_ZIP"
  | "ALLOWED_BY_AREA"
  | "ALLOWED_BY_AREA_FALLBACK"
  | "DENIED_BY_ZIP"
  | "DENIED_BY_AREA"
  | "NOT_CONFIGURED";

/**
 * The COLLAPSED reason an anonymous caller may see. `UNKNOWN_ZIP`,
 * `ZIP_INACTIVE` and `AREA_INACTIVE` all collapse to `UNKNOWN_ZIP`; the three
 * deny reasons all collapse to `NOT_SERVICEABLE`. Do not "improve" the copy by
 * re-deriving a precise reason on the client — there is nothing to derive it
 * from, which is the point.
 */
export type PublicCoverageReason =
  | "SERVICEABLE"
  | "NOT_LOCATION_BOUND"
  | "SERVICE_NOT_BOOKABLE"
  | "UNKNOWN_ZIP"
  | "NOT_SERVICEABLE";

/** How the bulk importer reacts to a ZIP that already exists. */
export const ZIP_IMPORT_CONFLICT_MODES = ["SKIP", "UPDATE", "MOVE"] as const;
export type ZipImportConflictMode = (typeof ZIP_IMPORT_CONFLICT_MODES)[number];

/** Sortable columns — `listAreasSchema.sortBy`. */
export const AREA_SORT_FIELDS = ["sortOrder", "name", "createdAt", "updatedAt"] as const;
export type AreaSortField = (typeof AREA_SORT_FIELDS)[number];

/** Sortable columns — `listZipCodesSchema.sortBy`. */
export const ZIP_CODE_SORT_FIELDS = ["zipCode", "city", "createdAt", "updatedAt"] as const;
export type ZipCodeSortField = (typeof ZIP_CODE_SORT_FIELDS)[number];

/** `SortOrder` — the shared server enum used by every list endpoint. */
export type SortDirection = "asc" | "desc";

// ───────────────────────────────────────────────────────────────────────────────
// Server-enforced limits, mirrored so the UI can validate before a round trip
// ───────────────────────────────────────────────────────────────────────────────

/** `zip-codes.validation.ts MAX_BULK_IMPORT_ROWS` — the client chunks past this. */
export const MAX_BULK_IMPORT_ROWS = 1000;
/** `zip-codes.validation.ts MAX_BULK_IDS` — `bulk/status` and `bulk/move`. */
export const MAX_BULK_IDS = 500;
/** `coverage.validation.ts MAX_LISTED_ZIPS` — ZIPs listed in one per-area PUT. */
export const MAX_LISTED_ZIPS = 500;
/** `areas.service.ts MAX_AREA_ZIP_CODES` — `GET /areas/:id/zip-codes` hard cap. */
export const MAX_AREA_ZIP_CODES = 2000;
/** `buildPagination` MAX_LIMIT — every paginated list endpoint. */
export const MAX_PAGE_LIMIT = 100;

// ───────────────────────────────────────────────────────────────────────────────
// Machine-readable error codes
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Every machine code this feature can return, unioned from the three server
 * modules that mint them:
 *
 *   areas.service.ts       `AreaErrorCode`
 *   zip-codes.types.ts     `ZipCodeErrorCode`
 *   coverage.types.ts      `CoverageErrorCode`
 *
 * `ApiError` has no top-level `code` field yet, so on the wire the code sits
 * inside the envelope's `errors` — as an OBJECT for areas/zip-codes and as an
 * ARRAY OF ONE for coverage. `CoverageApiError` below normalises both; branch on
 * `err.code`, never on the human message.
 *
 * Names differ from the design doc in two places, and the server wins:
 * `ZIP_CODE_ARCHIVED_EXISTS` (not `ZIP_ARCHIVED_EXISTS`) and
 * `COVERAGE_VERSION_STALE` (not `COVERAGE_VERSION_CONFLICT`).
 */
export const CoverageErrorCode = {
  // ── areas ──
  AREA_NOT_FOUND: "AREA_NOT_FOUND",
  AREA_NAME_EXISTS: "AREA_NAME_EXISTS",
  AREA_SLUG_EXISTS: "AREA_SLUG_EXISTS",
  /** `details.archivedId` + `details.field` — offer Restore, not "already exists". */
  AREA_ARCHIVED_EXISTS: "AREA_ARCHIVED_EXISTS",
  AREA_SLUG_UNDERIVABLE: "AREA_SLUG_UNDERIVABLE",
  AREA_STATUS_TRANSITION_INVALID: "AREA_STATUS_TRANSITION_INVALID",
  /** Mutation freeze: an ARCHIVED area refuses every write except /restore. */
  AREA_ARCHIVED: "AREA_ARCHIVED",
  AREA_NOT_ARCHIVED: "AREA_NOT_ARCHIVED",

  // ── ZIP codes ──
  ZIP_CODE_NOT_FOUND: "ZIP_CODE_NOT_FOUND",
  /** `details.existingId`, `details.areaId`, `details.areaName`. */
  ZIP_CODE_EXISTS: "ZIP_CODE_EXISTS",
  /** `details.archivedId`, `details.areaId`, `details.areaName`. */
  ZIP_CODE_ARCHIVED_EXISTS: "ZIP_CODE_ARCHIVED_EXISTS",
  ZIP_CODE_ARCHIVED: "ZIP_CODE_ARCHIVED",
  ZIP_CODE_NOT_ARCHIVED: "ZIP_CODE_NOT_ARCHIVED",
  ZIP_CODE_STATUS_TRANSITION_INVALID: "ZIP_CODE_STATUS_TRANSITION_INVALID",
  /** `details.areaId`, `details.areaName`. */
  ZIP_CODE_AREA_ARCHIVED: "ZIP_CODE_AREA_ARCHIVED",
  /** `details.services: BlockingCoverageService[]` — name them, then offer the fix. */
  ZIP_MOVE_BLOCKED_BY_COVERAGE: "ZIP_MOVE_BLOCKED_BY_COVERAGE",
  ZIP_IMPORT_TOO_MANY_ROWS: "ZIP_IMPORT_TOO_MANY_ROWS",

  // ── coverage ──
  SERVICE_NOT_FOUND: "SERVICE_NOT_FOUND",
  /** `details.currentVersion` — reload the document, never merge. */
  COVERAGE_VERSION_STALE: "COVERAGE_VERSION_STALE",
  COVERAGE_AREA_NOT_FOUND: "COVERAGE_AREA_NOT_FOUND",
  COVERAGE_AREA_ARCHIVED: "COVERAGE_AREA_ARCHIVED",
  /** `details.zipCodeIds` — the ids that do not exist. */
  COVERAGE_ZIP_NOT_FOUND: "COVERAGE_ZIP_NOT_FOUND",
  /** `details.zipCodeIds` + `details.zipCodes` — wrong market, hard error. */
  COVERAGE_ZIP_AREA_MISMATCH: "COVERAGE_ZIP_AREA_MISMATCH",
  COVERAGE_AREA_RULE_REQUIRED: "COVERAGE_AREA_RULE_REQUIRED",
  ZIP_REQUIRED: "ZIP_REQUIRED",
  ZIP_INVALID: "ZIP_INVALID",
  ZIP_NOT_SERVICEABLE: "ZIP_NOT_SERVICEABLE",
} as const;

export type CoverageErrorCode =
  (typeof CoverageErrorCode)[keyof typeof CoverageErrorCode];

/**
 * PER-ROW codes from the bulk importer. These never set the HTTP status — the
 * import always answers 200 and reports them in `data.failed[]` / `data.errors[]`.
 */
export const ZipImportRowErrorCode = {
  ZIP_CODE_INVALID: "ZIP_CODE_INVALID",
  ZIP_CODE_DUPLICATE_IN_PAYLOAD: "ZIP_CODE_DUPLICATE_IN_PAYLOAD",
  ZIP_CODE_EXISTS_OTHER_AREA: "ZIP_CODE_EXISTS_OTHER_AREA",
  ZIP_CODE_EXISTS_ARCHIVED: "ZIP_CODE_EXISTS_ARCHIVED",
  ZIP_CODE_AREA_MISSING: "ZIP_CODE_AREA_MISSING",
  ZIP_CODE_AREA_NOT_FOUND: "ZIP_CODE_AREA_NOT_FOUND",
  ZIP_CODE_AREA_ARCHIVED: "ZIP_CODE_AREA_ARCHIVED",
  ZIP_CODE_STATE_INVALID: "ZIP_CODE_STATE_INVALID",
  ZIP_MOVE_BLOCKED_BY_COVERAGE: "ZIP_MOVE_BLOCKED_BY_COVERAGE",
  /** A chunk transaction rolled back; none of its rows were written. */
  ZIP_IMPORT_CHUNK_FAILED: "ZIP_IMPORT_CHUNK_FAILED",
} as const;

export type ZipImportRowErrorCode =
  (typeof ZipImportRowErrorCode)[keyof typeof ZipImportRowErrorCode];

// ───────────────────────────────────────────────────────────────────────────────
// Areas — response shapes
// ───────────────────────────────────────────────────────────────────────────────

/**
 * A ZIP as the coverage picker, the public coverage band and the ZIP lookup need
 * it. `city` is a postal fact for display/autofill only and must NEVER be used
 * to resolve an area.
 */
export interface ZipCodeLean {
  id: string;
  zipCode: string;
  city: string | null;
  stateCode: string;
  status: GeoStatus;
}

/** The market identity returned beside a ZIP by `GET /areas/lookup`. */
export interface AreaLean {
  id: string;
  name: string;
  slug: string;
  status: GeoStatus;
  stateCode: string;
  countryCode: string;
  timezone: string;
}

/**
 * Serialized Area — the shape every areas endpoint returns.
 *
 * `zipCodeCount` counts ZIPs in ANY status, `activeZipCodeCount` only ACTIVE
 * ones. `serviceCount` is the UNION of both coverage tables, so a service that
 * covers this market only through opted-in ZIPs is still counted; an admin who
 * saw `0` there would archive a market that is somebody's only coverage.
 *
 * An ACTIVE area with `zipCodeCount: 0` is a LEGITIMATE state (a market created
 * before its ZIPs are loaded) and must render as "covered area-wide", not
 * "0 of 0", and must not be filtered out of "areas we serve".
 */
export interface AreaResponse {
  id: string;
  name: string;
  slug: string;
  stateCode: string;
  countryCode: string;
  timezone: string;
  status: GeoStatus;
  sortOrder: number;
  zipCodeCount: number;
  activeZipCodeCount: number;
  serviceCount: number;
  /** Present only when `includeZipCodes=true`; ACTIVE ZIPs, ordered by code. */
  zipCodes?: ZipCodeLean[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Single-area read shape. `activeBookingCount` (PENDING | CONFIRMED |
 * IN_PROGRESS) is the blast-radius number the archive/pause confirm dialog
 * shows; the server returns it for STAFF callers only, so it is optional.
 */
export interface AreaDetail extends AreaResponse {
  activeBookingCount?: number;
}

/** `GET /areas/lookup?zip=` — the ZIP and the market that owns it. */
export interface AreaZipLookupResult {
  area: AreaLean;
  zipCode: ZipCodeLean;
}

/**
 * `GET /areas/:id/zip-codes` — capped at `MAX_AREA_ZIP_CODES`, never paginated.
 * `truncated` tells the picker to fall back to search rather than silently
 * showing a partial list.
 */
export interface AreaZipCodesResult {
  items: ZipCodeLean[];
  truncated: boolean;
}

// ───────────────────────────────────────────────────────────────────────────────
// ZIP codes — response shapes
// ───────────────────────────────────────────────────────────────────────────────

/** The parent market, inlined on every ZIP row so admin tables need no N+1. */
export interface ZipCodeAreaRef {
  id: string;
  name: string;
  slug: string;
  status: GeoStatus;
}

/**
 * Serialized ZIP code.
 *
 * `serviceOverrideCount` is how many services carry an explicit per-ZIP rule
 * here. It is NOT "how many services are available here" — that is a coverage
 * rollup and rollups are banned from paginated lists. It IS exactly the number
 * that predicts whether a MOVE will be refused.
 */
export interface ZipCodeResponse {
  id: string;
  zipCode: string;
  city: string | null;
  stateCode: string;
  countryCode: string;
  status: GeoStatus;
  area: ZipCodeAreaRef;
  serviceOverrideCount: number;
  createdAt: string;
  updatedAt: string;
}

/** `POST /zip-codes/bulk/status`. Every requested id is accounted for. */
export interface BulkZipCodeStatusResult {
  updated: number;
  /** Requested ZIPs that were already at the target status. */
  unchanged: number;
  /** Requested ids with no ZipCode row. */
  notFound: string[];
  /** Ids refused by the mutation freeze — ARCHIVED rows must be restored first. */
  archived: string[];
}

/** One service whose ZIP-level rule pins a ZIP to its current market. */
export interface BlockingCoverageService {
  id: string;
  name: string;
  effect: CoverageEffect | null;
}

/** A ZIP the composite FK refuses to move, and the rules responsible. */
export interface BlockedZipCodeMove {
  zipCodeId: string;
  zipCode: string;
  areaId: string;
  areaName: string;
  services: BlockingCoverageService[];
}

/**
 * `POST /zip-codes/bulk/move`. Partial success is the DESIGNED outcome: movable
 * ZIPs commit and pinned ones come back in `blocked`. Render both.
 */
export interface BulkMoveZipCodesResult {
  moved: number;
  /** Requested ZIPs already in the target market. */
  unchanged: number;
  notFound: string[];
  blocked: BlockedZipCodeMove[];
}

export interface BulkImportRowError {
  /** 1-based index into the SUBMITTED rows array, stable regardless of filtering. */
  row: number;
  zipCode: string;
  code: ZipImportRowErrorCode;
  message: string;
}

/** A multi-chunk import is not atomic, so the client is told what committed. */
export interface BulkImportChunkResult {
  index: number;
  rows: number;
  committed: boolean;
  error?: string;
}

export interface BulkImportSummary {
  received: number;
  created: number;
  updated: number;
  moved: number;
  skipped: number;
  failed: number;
}

/**
 * `POST /zip-codes/bulk/import` — ALWAYS HTTP 200, even with row failures.
 * `failed` and `errors` are the same array under two keys (the server ships
 * both); read `failed`.
 */
export interface BulkImportZipCodesResult {
  dryRun: boolean;
  created: number;
  updated: number;
  moved: number;
  skipped: number;
  summary: BulkImportSummary;
  /** Per-row failures, capped server-side at 200 entries. */
  failed: BulkImportRowError[];
  /** Alias of `failed`. */
  errors: BulkImportRowError[];
  errorsTruncated: boolean;
  chunks: BulkImportChunkResult[];
  /**
   * Services that inherit coverage in the markets that gained ZIPs — the blast
   * radius the confirm dialog must show ("this will make 8 services bookable in
   * 812 new ZIP codes"). Returned for `dryRun` too.
   */
  newlyCoveredServiceCount: number;
}

// ───────────────────────────────────────────────────────────────────────────────
// Per-service coverage — the admin document
// ───────────────────────────────────────────────────────────────────────────────

export interface CoverageListedZip {
  id: string;
  zipCode: string;
  city: string | null;
  status: GeoStatus;
}

export interface CoverageAreaEntry {
  areaId: string;
  name: string;
  slug: string;
  status: GeoStatus;
  mode: CoverageMode;
  /** ACTIVE ZIPs in this area. Service-independent. */
  areaZipCount: number;
  /** ACTIVE ZIPs this service actually reaches. SERVER-AUTHORED, always. */
  effectiveZipCount: number;
  /**
   * True for `ALL` / `ALL_EXCEPT`. An ALLOW area with ZERO ZIPs is COVERED, not
   * "0 of 0" — render "Covered area-wide".
   */
  areaWide: boolean;
  /** Whether this area currently yields any bookable ZIP. Server-authored. */
  available: boolean;
  autoIncludeNewZips: boolean;
  /**
   * Every stored ZIP rule for the mode's effect, INCLUDING rules on
   * INACTIVE/ARCHIVED ZIPs, so re-saving the card round-trips losslessly.
   */
  listedZips: CoverageListedZip[];
  /**
   * Server-authored prose. Render VERBATIM. Never compose this client-side: the
   * first change to the resolution rules would make the admin UI lie, and
   * coverage lies stay invisible until a customer cannot book.
   */
  summaryLine: string;
  /** Anomalies surfaced, never auto-corrected. */
  warning: string | null;
}

export interface CoverageDocument {
  service: { id: string; slug: string; name: string; status: ServiceStatus };
  /** Echo this back in every PUT body. A mismatch is a 409, not a lost update. */
  version: number;
  summary: string;
  totals: { areaCount: number; zipCount: number; totalAreaCount: number };
  areas: CoverageAreaEntry[];
  uncoveredAreas: Array<{ areaId: string; name: string; slug: string }>;
}

/** `PUT /services/:serviceId/coverage/areas/:areaId` — re-render from this. */
export interface PutAreaCoverageResult {
  area: CoverageAreaEntry;
  version: number;
}

// ───────────────────────────────────────────────────────────────────────────────
// Coverage check — the one truth-teller, shared by admin and the booking form
// ───────────────────────────────────────────────────────────────────────────────

export interface CoverageCheckServiceEntry {
  id: string;
  slug: string;
  name: string;
  source: CoverageSource;
}

/**
 * `GET /coverage/check` and `GET /services/:serviceId/coverage/check`.
 *
 * Always HTTP 200, including for "not serviceable" — a valid answer to a valid
 * question. `matchedTier` / `matchedRuleId` never cross the wire for anonymous
 * callers, and `reason` arrives collapsed for them, which is why it is typed as
 * the union of both reason enums.
 */
export interface CoverageCheckResult {
  zip: string;
  serviceable: boolean;
  reason: CoverageReason | PublicCoverageReason;
  /** Returned only inside the published footprint (ZIP ACTIVE and area ACTIVE). */
  area: { id: string; name: string; slug: string } | null;
  service: { id: string; slug: string; name: string } | null;
  /** Present only when the caller named no service: everything bookable here. */
  services?: CoverageCheckServiceEntry[];
  /** Staff only. */
  matchedTier?: CoverageTier | null;
  /** Staff only. */
  matchedRuleId?: string | null;
  /** Server-authored, user-facing. Render verbatim. */
  message: string;
}

// ───────────────────────────────────────────────────────────────────────────────
// Envelope + the one typed error class
// ───────────────────────────────────────────────────────────────────────────────

/**
 * One entry of the envelope's `errors`. The server emits three shapes through
 * the same key and `normalizeErrorDetails` folds all of them into this:
 *
 *   areas / zip-codes coded error   `errors: { code, ...extras }`
 *   coverage coded error            `errors: [{ path?, code, message, ...extras }]`
 *   zod 422                         `errors: [{ path, message }]`
 */
export interface ApiErrorDetail {
  path?: string;
  code?: string;
  message?: string;
  [key: string]: unknown;
}

/** The standard `{ success, message, data, meta? }` envelope. */
export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: ApiErrorDetail | ApiErrorDetail[];
  /**
   * Reserved. `ApiError` gains a top-level `code` in a later server edit; when
   * it lands it is read in preference to `errors[].code` with no other change.
   */
  code?: string;
}

/** Flatten `errors` (object, array, or absent) into a list of details. */
function normalizeErrorDetails(
  errors: ApiErrorDetail | ApiErrorDetail[] | undefined,
): ApiErrorDetail[] {
  if (Array.isArray(errors)) return errors.filter((e) => e !== null && typeof e === "object");
  if (errors !== null && typeof errors === "object") return [errors];
  return [];
}

/**
 * True when a rejection is an aborted request rather than a real failure.
 *
 * `apiClient` has `validateStatus: () => true`, so a non-2xx RESOLVES and comes
 * back through `unwrapEnvelope` as a `CoverageApiError`. The only things that
 * REJECT are a dead network and an `AbortController` firing — and the second one
 * is routine for every debounced/type-ahead read in this feature. Rendering it
 * would flash "request failed" on each keystroke, so every caller that passes a
 * `signal` must gate its catch on this.
 */
export function isAbortError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const candidate = err as { code?: unknown; name?: unknown };
  return (
    candidate.code === "ERR_CANCELED" ||
    candidate.name === "CanceledError" ||
    candidate.name === "AbortError"
  );
}

/**
 * Per-call transport options for every read a type-ahead or a debounced field
 * can fire repeatedly. THE definition — `lib/admin/{areas,zip-codes,coverage}.ts`
 * re-export this one rather than each declaring its own.
 *
 * Pass an `AbortController.signal` and a slow response for "27" can never land
 * after a fast one for "27615" — the out-of-order bug that is invisible because
 * both payloads are valid. Gate the catch on `isAbortError`.
 */
export interface CoverageRequestOptions {
  signal?: AbortSignal;
}

/**
 * The one error class for the whole coverage feature — areas, ZIP codes and
 * per-service rules all throw this, so a screen that touches two of them still
 * has one `catch`.
 *
 * It PRESERVES the server's machine code and its structured `details`, because
 * every interesting recovery path needs them: `AREA_ARCHIVED_EXISTS` ->
 * `archivedId` -> offer Restore; `ZIP_MOVE_BLOCKED_BY_COVERAGE` -> `services` ->
 * name them; `COVERAGE_VERSION_STALE` -> `currentVersion` -> reload.
 *
 * Branch on `code`. Never regex the human message.
 */
export class CoverageApiError extends Error {
  readonly status: number;
  /** The server's machine code, or `null` when the response carried none. */
  readonly code: string | null;
  /** Per-field messages keyed by `path` ("_form" when the entry has none). */
  readonly fieldErrors: FieldErrors;
  /** Every `errors` entry, normalised. Extras (`archivedId`, …) live here. */
  readonly details: ApiErrorDetail[];

  constructor(
    status: number,
    message: string,
    init: {
      code?: string | null;
      fieldErrors?: FieldErrors;
      details?: ApiErrorDetail[];
    } = {},
  ) {
    super(message);
    this.name = "CoverageApiError";
    this.status = status;
    this.code = init.code ?? null;
    this.fieldErrors = init.fieldErrors ?? {};
    this.details = init.details ?? [];
  }

  /** `if (err.is("AREA_ARCHIVED_EXISTS", "AREA_SLUG_EXISTS"))` */
  is(...codes: CoverageErrorCode[]): boolean {
    return this.code !== null && (codes as string[]).includes(this.code);
  }

  /** First `details` entry carrying `key`, read as an unknown. */
  detail(key: string): unknown {
    for (const entry of this.details) {
      if (entry[key] !== undefined) return entry[key];
    }
    return undefined;
  }

  /** `details.archivedId` — `AREA_ARCHIVED_EXISTS`, `ZIP_CODE_ARCHIVED_EXISTS`. */
  get archivedId(): string | null {
    const value = this.detail("archivedId");
    return typeof value === "string" ? value : null;
  }

  /** `details.currentVersion` — `COVERAGE_VERSION_STALE`. */
  get currentVersion(): number | null {
    const value = this.detail("currentVersion");
    return typeof value === "number" ? value : null;
  }

  /** `details.areaName` — `ZIP_CODE_EXISTS`, `ZIP_CODE_AREA_ARCHIVED`. */
  get areaName(): string | null {
    const value = this.detail("areaName");
    return typeof value === "string" ? value : null;
  }

  /** `details.services` — `ZIP_MOVE_BLOCKED_BY_COVERAGE`. */
  get blockingServices(): BlockingCoverageService[] {
    const value = this.detail("services");
    return Array.isArray(value) ? (value as BlockingCoverageService[]) : [];
  }

  /** `details.zipCodeIds` — `COVERAGE_ZIP_NOT_FOUND`, `COVERAGE_ZIP_AREA_MISMATCH`. */
  get zipCodeIds(): string[] {
    const value = this.detail("zipCodeIds");
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  }
}

/**
 * Unwrap the envelope or throw a `CoverageApiError` that keeps the code.
 *
 * Shared by `lib/admin/{areas,zip-codes,coverage}.ts` so there is exactly one
 * place that knows where the server hides its machine codes. `apiClient` has
 * `validateStatus: () => true`, so a non-2xx arrives here as data, not a throw.
 */
export function unwrapEnvelope<T>(res: {
  status: number;
  data: ApiEnvelope<T>;
}): { data: T; meta?: PaginationMeta } {
  // A non-object body is possible (an upstream HTML error page, an empty 204
  // that `NextResponse.json` turned into `""`). Coerce it away before any
  // property read so a transport oddity throws CoverageApiError rather than a
  // TypeError from inside the data layer.
  const raw: unknown = res.data;
  const body: ApiEnvelope<T> =
    raw !== null && typeof raw === "object" ? (raw as ApiEnvelope<T>) : {};
  if (res.status >= 200 && res.status < 300 && body.success !== false) {
    return { data: body.data as T, meta: body.meta };
  }

  const details = normalizeErrorDetails(body.errors);
  const fieldErrors: FieldErrors = {};
  for (const entry of details) {
    // ONLY entries that carry their own sentence become field errors.
    //
    // The areas and zip-codes modules put a bare `{ code, ...extras }` in
    // `errors`, with no `path` and no `message`. Defaulting those to a
    // placeholder produced `fieldErrors._form = ["Invalid value"]` on every
    // coded 4xx — a string with no information that outranked the real
    // `body.message` in any form that renders `_form`. Coded failures are
    // branched on `err.code` and rendered from `err.message`; `fieldErrors` is
    // now populated by, and only by, responses that name a field (zod 422 and
    // the coverage module's `path`-carrying codes).
    if (typeof entry.message !== "string" || entry.message.length === 0) continue;
    const key = entry.path !== undefined && entry.path.length > 0 ? entry.path : "_form";
    (fieldErrors[key] ??= []).push(entry.message);
  }

  const code = body.code ?? details.find((d) => typeof d.code === "string")?.code ?? null;
  const message =
    body.message ?? details.find((d) => typeof d.message === "string")?.message ?? "Request failed";

  throw new CoverageApiError(res.status, message, { code, fieldErrors, details });
}
