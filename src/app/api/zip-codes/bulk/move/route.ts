import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * POST /api/zip-codes/bulk/move — `{ zipCodeIds, targetAreaId }` (staff).
 *
 * Partial success is the designed outcome: movable ZIPs commit and pinned ones
 * come back in `blocked[]` with the services responsible. Still a 200.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/zip-codes/bulk/move", { method: "POST", body });
}
