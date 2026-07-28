import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** POST /api/zip-codes/:id/archive — retire a ZIP (ADMIN only). */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/zip-codes/${id}/archive`, { method: "POST" });
}
