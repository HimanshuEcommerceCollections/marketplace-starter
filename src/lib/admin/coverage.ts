import { apiClient } from "@/lib/api/client";
import {
  CoverageApiError,
  isAbortError,
  MAX_LISTED_ZIPS,
  unwrapEnvelope,
  type CoverageAreaEntry,
  type CoverageCheckResult,
  type CoverageDocument,
  type CoverageMode,
  type CoverageRequestOptions,
  type PutAreaCoverageResult,
} from "@/lib/coverage/types";

/**
 * Typed wrappers for per-service coverage and the coverage check.
 *
 *   GET  /api/services/:serviceId/coverage                     the admin document
 *   PUT  /api/services/:serviceId/coverage/areas/:areaId       whole-intent, one market
 *   GET  /api/services/:serviceId/coverage/check?zip=          the truth-teller
 *   GET  /api/coverage/check?zip=[&serviceId=|&serviceSlug=]    anonymous check
 *
 * The last two call the SAME resolver the booking write path calls, which is why
 * what an admin sees is by construction what a customer gets. Do not add a
 * second client-side interpretation of any of it.
 *
 * Nothing here composes prose or recomputes a count: `summaryLine`,
 * `effectiveZipCount`, `available`, `warning`, `summary` and the check's
 * `message` are all server-authored and are rendered verbatim.
 */

export { CoverageApiError, isAbortError, MAX_LISTED_ZIPS };
export type {
  CoverageAreaEntry,
  CoverageDocument,
  CoverageMode,
  CoverageCheckResult,
  CoverageRequestOptions,
};

/**
 * `PUT /services/:serviceId/coverage/areas/:areaId` body.
 *
 * `version` is the optimistic-concurrency token read from the document. It
 * travels in the BODY, not an `If-Match` header, because the BFF's `proxyJson`
 * copies no headers. A mismatch is 409 `COVERAGE_VERSION_STALE` with
 * `details.currentVersion` — reload, never merge.
 *
 *   mode "ALL"         -> zipCodeIds MUST be []
 *   mode "ALL_EXCEPT"  -> the ZIPs to EXCLUDE, 1..MAX_LISTED_ZIPS
 *   mode "ONLY"        -> the ZIPs to INCLUDE, 1..MAX_LISTED_ZIPS
 *   mode "NONE"        -> zipCodeIds MUST be []; removes the market entirely
 *
 * `NONE` is why there is no DELETE anywhere in this feature.
 */
export interface PutAreaCoverageInput {
  version: number;
  mode: CoverageMode;
  /** Always send it, even empty — the server defaults it, but explicit is safer. */
  zipCodeIds: string[];
}

/**
 * `GET /services/:serviceId/coverage` (staff).
 *
 * Returns objects with labels for rendering; the PUT takes bare ids. Asymmetric
 * on purpose — rendering needs names, writing must not persist stale ones.
 *
 * `totals.totalAreaCount` and `uncoveredAreas` are what the "+ Add area" menu
 * reads; `version` must be held in state and echoed on every save.
 */
export async function getServiceCoverage(
  serviceId: string,
): Promise<CoverageDocument> {
  return unwrapEnvelope<CoverageDocument>(
    await apiClient.get(`/services/${serviceId}/coverage`),
  ).data;
}

/**
 * Replace one market's whole coverage intent for one service, atomically.
 *
 * Returns the RECOMPUTED area entry plus the new `version`, so the card
 * re-renders from truth and the next edit carries a fresh token. Never
 * optimistic: this decides whether customers can book.
 *
 * Codes worth branching on: `COVERAGE_VERSION_STALE` (+ `currentVersion`),
 * `COVERAGE_ZIP_AREA_MISMATCH` (+ `zipCodeIds`, `zipCodes`),
 * `COVERAGE_ZIP_NOT_FOUND` (+ `zipCodeIds`), `COVERAGE_AREA_ARCHIVED`, and the
 * 422 whose `fieldErrors.zipCodeIds` says "switch to Only specific ZIP codes".
 */
export async function putAreaCoverage(
  serviceId: string,
  areaId: string,
  input: PutAreaCoverageInput,
): Promise<PutAreaCoverageResult> {
  return unwrapEnvelope<PutAreaCoverageResult>(
    await apiClient.put(`/services/${serviceId}/coverage/areas/${areaId}`, input),
  ).data;
}

/**
 * `GET /services/:serviceId/coverage/check?zip=` — the admin ZIP checker.
 *
 * Always 200, including for "not serviceable": a valid answer to a valid
 * question. Staff callers also get `reason` in its precise internal form plus
 * `matchedTier` / `matchedRuleId`, which is what lets the checker offer "remove
 * this exclusion" and deep-link to the responsible market.
 *
 * Rate-limited upstream at 30/min per ZIP, so fire only on a complete 5-digit
 * ZIP, debounce, and memoise.
 */
export async function checkServiceCoverage(
  serviceId: string,
  zip: string,
  options: CoverageRequestOptions = {},
): Promise<CoverageCheckResult> {
  return unwrapEnvelope<CoverageCheckResult>(
    await apiClient.get(`/services/${serviceId}/coverage/check`, {
      params: { zip },
      signal: options.signal,
    }),
  ).data;
}

/**
 * `GET /coverage/check?zip=[&serviceId=|&serviceSlug=]` — the anonymous check the
 * booking flow's step-02 ZIP gate calls.
 *
 * Supply NEITHER `serviceId` nor `serviceSlug` and the result carries
 * `services[]` — everything bookable at that ZIP — which makes the booking entry
 * point one round trip. Supplying BOTH is a 422.
 *
 * Anonymous callers get a deliberately collapsed `reason` and never see
 * `matchedTier` / `matchedRuleId`; `area` comes back only inside the published
 * footprint. Render `message` verbatim rather than re-deriving copy.
 */
export async function checkCoverage(
  input: { zip: string; serviceId?: string; serviceSlug?: string },
  options: CoverageRequestOptions = {},
): Promise<CoverageCheckResult> {
  const params: Record<string, string> = { zip: input.zip };
  if (input.serviceId !== undefined) params.serviceId = input.serviceId;
  if (input.serviceSlug !== undefined) params.serviceSlug = input.serviceSlug;

  return unwrapEnvelope<CoverageCheckResult>(
    await apiClient.get("/coverage/check", { params, signal: options.signal }),
  ).data;
}
