import { apiClient } from "@/lib/api/client";
import {
  CoverageApiError,
  isAbortError,
  MAX_BULK_IDS,
  MAX_BULK_IMPORT_ROWS,
  unwrapEnvelope,
  type BulkImportZipCodesResult,
  type BulkMoveZipCodesResult,
  type BulkZipCodeStatusResult,
  type CoverageRequestOptions,
  type GeoStatus,
  type LiveGeoStatus,
  type PaginationMeta,
  type SortDirection,
  type ZipCodeResponse,
  type ZipCodeSortField,
  type ZipImportConflictMode,
} from "@/lib/coverage/types";

/**
 * Typed wrappers for `/api/zip-codes/**`.
 *
 * The router is FLAT, not nested under `/areas/:areaId/zips`, because a ZIP's
 * identity is global (`zipCode` is unique across every market) and cross-area
 * search is exactly what the coverage picker and "who owns 27601?" need.
 *
 * Errors throw `CoverageApiError` carrying the server's machine code —
 * `ZIP_CODE_EXISTS`, `ZIP_CODE_ARCHIVED_EXISTS` (+ `details.archivedId`),
 * `ZIP_CODE_AREA_ARCHIVED`, `ZIP_MOVE_BLOCKED_BY_COVERAGE`
 * (+ `details.services`). Branch on `err.code`.
 */

export { CoverageApiError, isAbortError, MAX_BULK_IDS, MAX_BULK_IMPORT_ROWS };
export type { CoverageRequestOptions };

/** `GET /zip-codes` — `listZipCodesSchema`, field for field. */
export interface ListZipCodesParams {
  /** 1-based. Default 1. */
  page?: number;
  /** Default 20, server max 100. */
  limit?: number;
  /**
   * Split on shape server-side so both branches stay index-backed: all-digits
   * searches the ZIP prefix, anything else searches the city prefix. It is a
   * PREFIX match, not `contains` — "aleigh" finds nothing.
   */
  search?: string;
  areaId?: string;
  /** Staff only. ARCHIVED rows need this or `includeArchived`. */
  status?: GeoStatus;
  /** Opt ARCHIVED rows into an otherwise unfiltered list. */
  includeArchived?: boolean;
  /** Default "zipCode". */
  sortBy?: ZipCodeSortField;
  /** Default "asc". */
  sort?: SortDirection;
}

export interface CreateZipCodeInput {
  areaId: string;
  /** Normalised to 5 digits server-side; ZIP+4 is truncated, "7501X" is a 422. */
  zipCode: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  /** ACTIVE | INACTIVE only — archived-on-create is meaningless. */
  status?: LiveGeoStatus;
}

/**
 * `PATCH /zip-codes/:id`. At least one field required.
 *
 * `areaId` here is a MOVE between markets and can be refused with 409
 * `ZIP_MOVE_BLOCKED_BY_COVERAGE` when a service rule pins this ZIP to its
 * current market. `status` is deliberately absent — use the lifecycle calls.
 */
export interface UpdateZipCodeInput {
  areaId?: string;
  zipCode?: string;
  /** Explicit `null` clears the city. */
  city?: string | null;
  stateCode?: string;
  countryCode?: string;
}

/** One parsed row for `POST /zip-codes/bulk/import`. */
export interface BulkImportZipRow {
  /** Sent as typed; per-ROW validation happens server-side so junk is reported, not fatal. */
  zipCode: string;
  /** Overrides the top-level `areaId` for this row. */
  areaId?: string;
  city?: string;
  /** 2-letter USPS code. NOTE the key is `state`, not `stateCode`. */
  state?: string;
}

export interface BulkImportZipCodesInput {
  /** Default market. Required unless EVERY row carries its own `areaId`. */
  areaId?: string;
  defaultState?: string;
  defaultCountry?: string;
  /** Default "SKIP". */
  conflictMode?: ZipImportConflictMode;
  /** `true` runs the whole classification with no writes — this powers Preview. */
  dryRun?: boolean;
  /** Max `MAX_BULK_IMPORT_ROWS` per request; chunk larger files client-side. */
  rows: BulkImportZipRow[];
}

function zipQuery(params: ListZipCodesParams): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (params.page !== undefined) query.page = params.page;
  if (params.limit !== undefined) query.limit = params.limit;
  if (params.search !== undefined && params.search !== "") query.search = params.search;
  if (params.areaId !== undefined) query.areaId = params.areaId;
  if (params.status !== undefined) query.status = params.status;
  // The server's flag schema is z.enum(["true","false","1","0"]).optional() — an
  // empty string is a 422 here (unlike the areas schema), so only ever send it
  // when the caller actually set it.
  if (params.includeArchived !== undefined) {
    query.includeArchived = params.includeArchived ? "true" : "false";
  }
  if (params.sortBy !== undefined) query.sortBy = params.sortBy;
  if (params.sort !== undefined) query.sort = params.sort;
  return query;
}

/**
 * `GET /zip-codes`.
 *
 * Pass `options.signal` for the coverage picker's type-ahead: without it a slow
 * response for "276" can land after a fast one for "27615" and silently
 * overwrite it. On abort axios rejects — gate the catch on `isAbortError`.
 */
export async function listZipCodes(
  params: ListZipCodesParams = {},
  options: CoverageRequestOptions = {},
): Promise<{ items: ZipCodeResponse[]; meta: PaginationMeta }> {
  const { data, meta } = unwrapEnvelope<ZipCodeResponse[]>(
    await apiClient.get("/zip-codes", {
      params: zipQuery(params),
      signal: options.signal,
    }),
  );
  // `data` is always an array from this endpoint; the fallback keeps a malformed
  // 2xx (empty upstream body) from turning into a TypeError inside the caller.
  const items = data ?? [];
  return {
    items,
    meta: meta ?? { page: 1, limit: items.length, total: items.length, totalPages: 1 },
  };
}

export async function getZipCode(id: string): Promise<ZipCodeResponse> {
  return unwrapEnvelope<ZipCodeResponse>(await apiClient.get(`/zip-codes/${id}`)).data;
}

/** `GET /zip-codes/by-code/:zipCode` — the cross-area "who owns this ZIP?" read. */
export async function getZipCodeByCode(zipCode: string): Promise<ZipCodeResponse> {
  return unwrapEnvelope<ZipCodeResponse>(
    await apiClient.get(`/zip-codes/by-code/${encodeURIComponent(zipCode)}`),
  ).data;
}

/**
 * `POST /zip-codes`.
 *
 * A new ACTIVE ZIP immediately inherits every area-wide grant in its market —
 * that is what makes "all of Raleigh, forever" one row — so the UI must say so
 * before the write, not after.
 */
export async function createZipCode(
  input: CreateZipCodeInput,
): Promise<ZipCodeResponse> {
  return unwrapEnvelope<ZipCodeResponse>(await apiClient.post("/zip-codes", input)).data;
}

export async function updateZipCode(
  id: string,
  input: UpdateZipCodeInput,
): Promise<ZipCodeResponse> {
  return unwrapEnvelope<ZipCodeResponse>(
    await apiClient.patch(`/zip-codes/${id}`, input),
  ).data;
}

/**
 * `POST /zip-codes/:id/status` — the ACTIVE <-> INACTIVE toggle.
 *
 * `ARCHIVED` is NOT accepted here (`LiveGeoStatus`): `/archive` and `/restore`
 * are the only doors in and out of it and they are admin-only. Widening this
 * would hand every coordinator both of those admin capabilities.
 *
 * SETTING THE STATUS A ZIP IS ALREADY IN IS A 409, not a no-op
 * (`ZIP_CODE_STATUS_TRANSITION_INVALID`), and an ARCHIVED ZIP is refused with
 * `ZIP_CODE_ARCHIVED` (+ `details.archivedId`) before the transition map is even
 * consulted. Disable the current status in any picker rather than round-trip it.
 */
export async function setZipCodeStatus(
  id: string,
  status: LiveGeoStatus,
): Promise<ZipCodeResponse> {
  return unwrapEnvelope<ZipCodeResponse>(
    await apiClient.post(`/zip-codes/${id}/status`, { status }),
  ).data;
}

/** INACTIVE -> ACTIVE. 409 if it is already ACTIVE, or if it is ARCHIVED. */
export async function activateZipCode(id: string): Promise<ZipCodeResponse> {
  return unwrapEnvelope<ZipCodeResponse>(
    await apiClient.post(`/zip-codes/${id}/activate`),
  ).data;
}

/** ACTIVE -> INACTIVE. 409 if it is already INACTIVE, or if it is ARCHIVED. */
export async function deactivateZipCode(id: string): Promise<ZipCodeResponse> {
  return unwrapEnvelope<ZipCodeResponse>(
    await apiClient.post(`/zip-codes/${id}/deactivate`),
  ).data;
}

/** Admin only. Coverage rows are preserved, so restore is lossless. */
export async function archiveZipCode(id: string): Promise<ZipCodeResponse> {
  return unwrapEnvelope<ZipCodeResponse>(
    await apiClient.post(`/zip-codes/${id}/archive`),
  ).data;
}

/** Admin only. Unlike an Area, a restored ZIP lands back on ACTIVE. */
export async function restoreZipCode(id: string): Promise<ZipCodeResponse> {
  return unwrapEnvelope<ZipCodeResponse>(
    await apiClient.post(`/zip-codes/${id}/restore`),
  ).data;
}

/**
 * `POST /zip-codes/bulk/status` — max `MAX_BULK_IDS` ids.
 *
 * Always 200. Every requested id is accounted for: `unchanged` means exactly
 * "already at that status", while `notFound` and `archived` name the rows that
 * were REFUSED, so the admin is never told "nothing to do" about a rejection.
 */
export async function bulkSetZipCodeStatus(input: {
  zipCodeIds: string[];
  status: LiveGeoStatus;
}): Promise<BulkZipCodeStatusResult> {
  return unwrapEnvelope<BulkZipCodeStatusResult>(
    await apiClient.post("/zip-codes/bulk/status", input),
  ).data;
}

/**
 * `POST /zip-codes/bulk/move` — max `MAX_BULK_IDS` ids.
 *
 * PARTIAL SUCCESS IS THE DESIGNED OUTCOME and the response is 200 even when
 * `blocked` is non-empty: the composite FK refuses any ZIP whose coverage rules
 * reference it under the old market, the movable ones still commit, and the
 * refusals come back with the services responsible. Render both halves — a
 * caller that reads only `moved` silently loses the blocked list.
 */
export async function bulkMoveZipCodes(input: {
  zipCodeIds: string[];
  targetAreaId: string;
}): Promise<BulkMoveZipCodesResult> {
  return unwrapEnvelope<BulkMoveZipCodesResult>(
    await apiClient.post("/zip-codes/bulk/move", input),
  ).data;
}

/**
 * `POST /zip-codes/bulk/import` — JSON rows only; the browser parses the CSV.
 *
 * ALWAYS HTTP 200, even with row failures: partial success is the normal outcome
 * of a real import, so per-row problems arrive as DATA in `failed[]`, never as a
 * transport error. `dryRun: true` returns the identical summary with no writes.
 *
 * A multi-chunk import is not atomic — `chunks[]` reports which committed, and
 * because the import is idempotent on the `zipCode` natural key, re-running a
 * failed chunk is safe.
 */
export async function bulkImportZipCodes(
  input: BulkImportZipCodesInput,
): Promise<BulkImportZipCodesResult> {
  return unwrapEnvelope<BulkImportZipCodesResult>(
    await apiClient.post("/zip-codes/bulk/import", input),
  ).data;
}
