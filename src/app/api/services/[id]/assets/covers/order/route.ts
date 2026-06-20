import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

interface Ctx {
  params: Promise<{ id: string }>;
}

/** PATCH /api/services/:slug/assets/covers/order — reorder covers (JSON). */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/services/${id}/assets/covers/order`, {
    method: "PATCH",
    body,
  });
}
