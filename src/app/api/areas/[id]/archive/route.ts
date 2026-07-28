import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** POST /api/areas/:id/archive — retire a market (ADMIN only). Not blocked by open bookings. */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/areas/${id}/archive`, { method: "POST" });
}
