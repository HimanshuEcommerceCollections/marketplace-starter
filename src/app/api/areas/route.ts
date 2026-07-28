import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * GET /api/areas — list operating markets.
 *
 * The whole query string is forwarded as-is (page, limit, search, status,
 * serviceSlug, includeZipCodes, sortBy, sort). The upstream endpoint is
 * role-aware, so the same handler serves the admin table and the public
 * "areas we serve" band; `proxyJson` attaches a token only when one exists.
 */
export function GET(req: NextRequest) {
  return proxyJson(req, `/areas${req.nextUrl.search}`);
}

/** POST /api/areas — create a market (staff). Starts ACTIVE. */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/areas", { method: "POST", body });
}
