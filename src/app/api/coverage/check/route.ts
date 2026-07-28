import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * GET /api/coverage/check?zip=[&serviceId=|&serviceSlug=] — the anonymous
 * availability check behind the booking flow's ZIP gate.
 *
 * `proxyJson` attaches a token only when one exists, so this works signed out;
 * staff callers get the precise reason and matched rule, anonymous callers get a
 * collapsed reason and no rule ids.
 *
 * Always 200, including for "not serviceable" — a 404 would make every error
 * boundary treat a valid answer as a failure. Omit both service selectors and the
 * result carries `services[]`, everything bookable at that ZIP.
 *
 * No caching, at any layer: an admin who switches a ZIP off must not watch
 * bookings keep landing in it. (`proxyJson` copies no upstream headers, so the
 * API's `Cache-Control: private, no-store` does not survive the hop — which is
 * exactly why nothing here adds a cache to be defeated.)
 */
export function GET(req: NextRequest) {
  return proxyJson(req, `/coverage/check${req.nextUrl.search}`);
}
