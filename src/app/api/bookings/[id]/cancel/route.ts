import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** PATCH /api/bookings/:id/cancel — cancel the user's own booking (ownership enforced). */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/bookings/${id}/cancel`, { method: "PATCH" });
}
