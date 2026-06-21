import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** POST /api/services/:id/config/price — quote base + selected option modifiers (role-aware). */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/services/${id}/config/price`, { method: "POST", body });
}
