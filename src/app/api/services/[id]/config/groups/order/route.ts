import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** PATCH /api/services/:id/config/groups/order — reorder config groups (staff). */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/services/${id}/config/groups/order`, { method: "PATCH", body });
}
