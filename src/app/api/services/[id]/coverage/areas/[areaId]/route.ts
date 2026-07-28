import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * PUT /api/services/:id/coverage/areas/:areaId — replace one market's whole
 * coverage intent for this service (staff).
 *
 * Body `{ version, mode, zipCodeIds }`. The optimistic-concurrency token travels
 * in the BODY, not an `If-Match` header, because `proxyJson` copies no headers.
 *
 * There is deliberately no DELETE: `mode: "NONE"` removes the market.
 */
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; areaId: string }> },
) {
  const { id, areaId } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/services/${id}/coverage/areas/${areaId}`, {
    method: "PUT",
    body,
  });
}
