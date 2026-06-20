import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** GET /api/services — list (search/status/sort/pagination forwarded as-is). */
export function GET(req: NextRequest) {
  return proxyJson(req, `/services${req.nextUrl.search}`);
}

/** POST /api/services — create a service (staff). */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/services", { method: "POST", body });
}
