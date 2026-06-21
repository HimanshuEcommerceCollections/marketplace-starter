import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** GET /api/bookings/:id — a single booking (server enforces ownership). */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/bookings/${id}`);
}
