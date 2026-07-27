import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * GET /api/services/:id/coverage — the per-service coverage document (staff).
 *
 * Upstream path is `/services/:serviceId/coverage`; this file's segment is named
 * `[id]` to match the sibling `/api/services/[id]/**` handlers (Next forbids two
 * different dynamic names at one level).
 *
 * The response is the single source of `summaryLine`, `effectiveZipCount`,
 * `available` and `version` — render them, never recompute them.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/services/${id}/coverage`);
}
