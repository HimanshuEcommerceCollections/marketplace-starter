import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** PATCH /api/bookings/:id/status — staff-only booking status transition. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/bookings/${id}/status`, { method: "PATCH", body });
}
