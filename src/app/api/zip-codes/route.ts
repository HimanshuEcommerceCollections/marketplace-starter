import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * GET /api/zip-codes — list ZIPs.
 *
 * Forwards the query string as-is (page, limit, search, areaId, status,
 * includeArchived, sortBy, sort). Flat rather than nested under an area because
 * a ZIP's identity is global and cross-area search is the point.
 */
export function GET(req: NextRequest) {
  return proxyJson(req, `/zip-codes${req.nextUrl.search}`);
}

/** POST /api/zip-codes — create one ZIP in a market (staff). */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/zip-codes", { method: "POST", body });
}
