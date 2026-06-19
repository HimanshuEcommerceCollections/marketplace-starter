import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** GET /api/categories — list (search/status/sort/pagination forwarded as-is). */
export function GET(req: NextRequest) {
  return proxyJson(req, `/categories${req.nextUrl.search}`);
}

/** POST /api/categories — create a category (staff). */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/categories", { method: "POST", body });
}
