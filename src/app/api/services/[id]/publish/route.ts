import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** POST /api/services/:id/publish — DRAFT|INACTIVE -> ACTIVE (staff). */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/services/${id}/publish`, { method: "POST" });
}
