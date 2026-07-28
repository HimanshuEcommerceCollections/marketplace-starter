import { apiClient } from "@/lib/api/client";
import {
  CoverageApiError,
  isAbortError,
  unwrapEnvelope,
  type AreaDetail,
  type AreaResponse,
  type AreaSortField,
  type AreaZipCodesResult,
  type AreaZipLookupResult,
  type CoverageRequestOptions,
  type GeoStatus,
  type PaginationMeta,
  type SortDirection,
} from "@/lib/coverage/types";

/**
 * Typed wrappers for `/api/areas/**` — the operating-market desk.
 *
 * Every call goes through the same-origin BFF route handlers under
 * `src/app/api/areas/**`, which proxy to the Express API with the httpOnly
 * session token attached server-side. Nothing here ever sees a token.
 *
 * Errors throw `CoverageApiError`, which preserves the server's machine code
 * (`AREA_ARCHIVED_EXISTS`, `AREA_ARCHIVED`, `AREA_NOT_ARCHIVED`, …) and its
 * structured details. Branch on `err.code`; never on the message.
 */

export { CoverageApiError, isAbortError };
export type { CoverageRequestOptions };

/**
 * `GET /areas` — `listAreasSchema`, field for field.
 *
 * Role-aware upstream: staff get ACTIVE + INACTIVE by default and may filter by
 * any status including ARCHIVED; anonymous callers get ACTIVE only and a
 * supplied `status` is IGNORED rather than honoured.
 */
export interface ListAreasParams {
  /** 1-based. Default 1. */
  page?: number;
  /** Default 20, server max 100. */
  limit?: number;
  /** Matches name OR slug, case-insensitive `contains`. */
  search?: string;
  /** Staff only. Omit to get ACTIVE + INACTIVE. */
  status?: GeoStatus;
  /** Filter to markets where that service is actually available (area-wide ALLOW or >=1 opted-in ZIP). */
  serviceSlug?: string;
  /** Inline each market's ACTIVE ZIPs (the marketing coverage band). */
  includeZipCodes?: boolean;
  /** Default "sortOrder". */
  sortBy?: AreaSortField;
  /** Default "asc". */
  sort?: SortDirection;
}

export interface CreateAreaInput {
  name: string;
  /** Derived from `name` server-side when omitted. */
  slug?: string;
  /** 2-letter USPS code; upper-cased server-side. */
  stateCode?: string;
  /** 2-letter ISO-3166-1 code; upper-cased server-side. */
  countryCode?: string;
  /** IANA zone name, e.g. "America/New_York". Rejected if unknown. */
  timezone?: string;
  sortOrder?: number;
}

/**
 * `PATCH /areas/:id`. At least one field is required (server refuses `{}`).
 * `status` is deliberately absent — use the lifecycle calls below.
 */
export interface UpdateAreaInput {
  name?: string;
  slug?: string;
  stateCode?: string;
  countryCode?: string;
  timezone?: string;
  sortOrder?: number;
}

/** `GET /areas/:id/zip-codes` — the coverage picker's list. Capped, not paged. */
export interface ListAreaZipCodesParams {
  status?: GeoStatus;
  /** Digits search the ZIP prefix; anything else searches the city prefix. */
  search?: string;
}

/**
 * `includeZipCodes` must reach the server as the string "true"/"false": its zod
 * schema is a union of `boolean | "true" | "false" | "1" | "0" | ""`, and axios
 * would serialise a JS boolean to "true"/"false" anyway — this makes it explicit
 * so `false` can never be read as "present, therefore true".
 */
function areaQuery(params: ListAreasParams): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (params.page !== undefined) query.page = params.page;
  if (params.limit !== undefined) query.limit = params.limit;
  if (params.search !== undefined && params.search !== "") query.search = params.search;
  if (params.status !== undefined) query.status = params.status;
  if (params.serviceSlug !== undefined) query.serviceSlug = params.serviceSlug;
  if (params.includeZipCodes !== undefined) {
    query.includeZipCodes = params.includeZipCodes ? "true" : "false";
  }
  if (params.sortBy !== undefined) query.sortBy = params.sortBy;
  if (params.sort !== undefined) query.sort = params.sort;
  return query;
}

export async function listAreas(
  params: ListAreasParams = {},
  options: CoverageRequestOptions = {},
): Promise<{ items: AreaResponse[]; meta: PaginationMeta }> {
  const { data, meta } = unwrapEnvelope<AreaResponse[]>(
    await apiClient.get("/areas", { params: areaQuery(params), signal: options.signal }),
  );
  // `data` is always an array from this endpoint; the fallback keeps a malformed
  // 2xx (empty upstream body) from turning into a TypeError inside the caller.
  const items = data ?? [];
  return {
    items,
    meta: meta ?? { page: 1, limit: items.length, total: items.length, totalPages: 1 },
  };
}

/**
 * `GET /areas/lookup?zip=` — "who owns 27601?".
 *
 * 404 `ZIP_CODE_NOT_FOUND` when the ZIP is unknown, and — for non-staff callers
 * — also when the ZIP or its market is switched off, so the public surface
 * cannot be probed for retired geography.
 */
export async function lookupAreaByZip(zip: string): Promise<AreaZipLookupResult> {
  return unwrapEnvelope<AreaZipLookupResult>(
    await apiClient.get("/areas/lookup", { params: { zip } }),
  ).data;
}

/** `GET /areas/by-slug/:slug` — public lookup by natural key. */
export async function getAreaBySlug(
  slug: string,
  options: { includeZipCodes?: boolean } = {},
): Promise<AreaDetail> {
  return unwrapEnvelope<AreaDetail>(
    await apiClient.get(`/areas/by-slug/${encodeURIComponent(slug)}`, {
      params: { includeZipCodes: options.includeZipCodes ? "true" : "false" },
    }),
  ).data;
}

/**
 * `GET /areas/:id` (staff). Carries `activeBookingCount` — re-fetch this when a
 * confirm dialog opens rather than trusting a possibly-stale table row.
 */
export async function getArea(
  id: string,
  options: { includeZipCodes?: boolean } = {},
): Promise<AreaDetail> {
  return unwrapEnvelope<AreaDetail>(
    await apiClient.get(`/areas/${id}`, {
      params: { includeZipCodes: options.includeZipCodes ? "true" : "false" },
    }),
  ).data;
}

/**
 * `GET /areas/:id/zip-codes` — deliberately NOT paginated. Hard-caps at 2000 and
 * reports `truncated`, which means "fall back to search", not "show a partial list".
 */
export async function listAreaZipCodes(
  areaId: string,
  params: ListAreaZipCodesParams = {},
  options: CoverageRequestOptions = {},
): Promise<AreaZipCodesResult> {
  // An empty `search` must be OMITTED, not sent: the server schema is
  // `.min(1)`, so `?search=` is a 422 rather than "no filter".
  const query: Record<string, string> = {};
  if (params.status !== undefined) query.status = params.status;
  if (params.search !== undefined && params.search !== "") query.search = params.search;

  return unwrapEnvelope<AreaZipCodesResult>(
    await apiClient.get(`/areas/${areaId}/zip-codes`, {
      params: query,
      signal: options.signal,
    }),
  ).data;
}

/**
 * `POST /areas`. A new market starts ACTIVE (schema default) — status is not
 * settable at create time.
 *
 * 409 `AREA_ARCHIVED_EXISTS` carries `details.archivedId`: an archived market
 * still holds its name/slug slot, so the recovery is Restore, not a rename.
 */
export async function createArea(input: CreateAreaInput): Promise<AreaResponse> {
  return unwrapEnvelope<AreaResponse>(await apiClient.post("/areas", input)).data;
}

export async function updateArea(
  id: string,
  input: UpdateAreaInput,
): Promise<AreaResponse> {
  return unwrapEnvelope<AreaResponse>(await apiClient.patch(`/areas/${id}`, input)).data;
}

/**
 * `POST /areas/:id/status` — the generic transition.
 *
 * Accepts the full `GeoStatus` (unlike the ZIP equivalent), but upstream it just
 * delegates to activate / deactivate / archive, so every guard below still
 * applies: `ARCHIVED` through here is admin-only (403 "Only a system admin can
 * archive an area", with NO machine code — read `err.status`, not `err.code`),
 * and `ARCHIVED -> ACTIVE` is refused with `AREA_ARCHIVED` ("restore it first").
 *
 * SETTING THE STATUS A MARKET IS ALREADY IN IS A 409, not a no-op
 * (`AREA_STATUS_TRANSITION_INVALID` + `details.from` / `details.to`). Disable the
 * current status in any picker instead of round-tripping it. Prefer the named
 * calls below.
 */
export async function setAreaStatus(
  id: string,
  status: GeoStatus,
): Promise<AreaResponse> {
  return unwrapEnvelope<AreaResponse>(
    await apiClient.post(`/areas/${id}/status`, { status }),
  ).data;
}

/**
 * INACTIVE -> ACTIVE. 409 `AREA_STATUS_TRANSITION_INVALID` if it is already
 * ACTIVE, and 409 `AREA_ARCHIVED` if it is archived (restore first).
 */
export async function activateArea(id: string): Promise<AreaResponse> {
  return unwrapEnvelope<AreaResponse>(await apiClient.post(`/areas/${id}/activate`)).data;
}

/**
 * Whole-market kill switch: every ZIP beneath it becomes unbookable at read time.
 * 409 `AREA_STATUS_TRANSITION_INVALID` if it is already INACTIVE.
 */
export async function deactivateArea(id: string): Promise<AreaResponse> {
  return unwrapEnvelope<AreaResponse>(await apiClient.post(`/areas/${id}/deactivate`)).data;
}

/**
 * `POST /areas/:id/archive` (admin only).
 *
 * NOT blocked by open bookings — that would create permanently un-archivable
 * rows. It does not touch the area's ZIPs or its coverage rows either: the area
 * gate makes everything beneath it unbookable, and preserving the rows is what
 * makes Restore lossless.
 */
export async function archiveArea(id: string): Promise<AreaResponse> {
  return unwrapEnvelope<AreaResponse>(await apiClient.post(`/areas/${id}/archive`)).data;
}

/**
 * `POST /areas/:id/restore` (admin only). Lands on INACTIVE, not ACTIVE, so a
 * market retired for months cannot silently reappear on the public band —
 * publishing it is the next, explicit `/activate` call.
 *
 * It CANNOT fail on a name/slug collision, and there is no
 * `AREA_RESTORE_NAME_CONFLICT`: an archived market keeps its unique name and
 * slug the whole time it is archived (that is exactly why creating over it
 * returns `AREA_ARCHIVED_EXISTS` + `details.archivedId`), and `restore` writes
 * `status` and nothing else. The only failure is 409 `AREA_NOT_ARCHIVED`
 * (+ `details.status`) when the market was not archived to begin with. Do not
 * build a "can't restore, the name is taken" recovery path — it is unreachable.
 */
export async function restoreArea(id: string): Promise<AreaResponse> {
  return unwrapEnvelope<AreaResponse>(await apiClient.post(`/areas/${id}/restore`)).data;
}
