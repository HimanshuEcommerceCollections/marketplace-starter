import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

interface Ctx {
  params: Promise<{ id: string }>;
}

/** GET /api/categories/:id — details incl. linked-services count (staff). */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyJson(req, `/categories/${id}`);
}

/** PATCH /api/categories/:id — edit name/slug/description/basePrice (staff). */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/categories/${id}`, { method: "PATCH", body });
}
