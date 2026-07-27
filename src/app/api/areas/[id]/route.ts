import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** GET /api/areas/:id — staff detail (`?includeZipCodes=`; carries activeBookingCount). */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/areas/${id}${req.nextUrl.search}`);
}

/** PATCH /api/areas/:id — edit a market (staff). Status is NOT editable here. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/areas/${id}`, { method: "PATCH", body });
}
