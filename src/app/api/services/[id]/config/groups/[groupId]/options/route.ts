import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** POST /api/services/:id/config/groups/:groupId/options — create an option (staff). */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; groupId: string }> },
) {
  const { id, groupId } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/services/${id}/config/groups/${groupId}/options`, {
    method: "POST",
    body,
  });
}
