import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * POST /api/zip-codes/bulk/status — `{ zipCodeIds, status }` (staff).
 *
 * Returns `{ updated, unchanged, notFound, archived }`: every requested id is
 * accounted for, so refusals are never swept into "unchanged".
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/zip-codes/bulk/status", { method: "POST", body });
}
