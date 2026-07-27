import { apiClient } from "@/lib/api/client";
import {
  isAbortError,
  unwrapEnvelope,
  type ZipCodeResponse,
} from "@/lib/coverage/types";

/**
 * Re-exported, NOT reimplemented.
 *
 * `apiClient` sets `validateStatus: () => true`, so a non-2xx resolves and only
 * a dead network or an `AbortController` rejects. Every debounced read in this
 * feature has to tell those apart, and a second local copy of that test is how
 * the two drift the day axios changes its cancellation shape.
 */
export { isAbortError };

/**
 * Abortable, area-scoped ZIP search for the coverage picker.
 *
 * This is `listZipCodes()` from `@/lib/admin/zip-codes` with one addition the
 * picker cannot do without: an `AbortSignal`. Typing fires a request per
 * debounce window, so without a signal a slow response for "276" can land after
 * a fast one for "27615" and silently overwrite it — the classic out-of-order
 * bug, and an invisible one, because both payloads are valid.
 *
 * It reuses the shared envelope handling and the shared wire types, so there is
 * still exactly one place that knows the response shape. WIRING NOTE: once
 * `ListZipCodesParams` grows `signal?: AbortSignal`, delete this file and call
 * `listZipCodes({ ...params, signal })` instead.
 */

/** Results per request. The picker never renders a long scrolling list. */
export const ZIP_SEARCH_LIMIT = 20;

/** Nothing is fetched or shown below this. Prevents a 1-char full-market scan. */
export const ZIP_SEARCH_MIN_CHARS = 2;

export interface ZipSearchResult {
  items: ZipCodeResponse[];
  /** Total server-side matches, so the picker can say "N more — keep typing". */
  total: number;
}

/**
 * `GET /api/zip-codes?areaId=&search=&page=1&limit=20`.
 *
 * The area's full ZIP list is NEVER loaded into the browser — assume thousands.
 * The server splits `search` on shape (all digits -> ZIP prefix, otherwise city
 * prefix) so both branches stay index-backed, and excludes ARCHIVED rows.
 */
export async function searchAreaZipCodes(params: {
  areaId: string;
  search: string;
  signal?: AbortSignal;
}): Promise<ZipSearchResult> {
  const { data, meta } = unwrapEnvelope<ZipCodeResponse[]>(
    await apiClient.get("/zip-codes", {
      params: {
        areaId: params.areaId,
        search: params.search,
        page: 1,
        limit: ZIP_SEARCH_LIMIT,
        sortBy: "zipCode",
        sort: "asc",
      },
      signal: params.signal,
    }),
  );
  const items = data ?? [];
  return { items, total: meta?.total ?? items.length };
}
