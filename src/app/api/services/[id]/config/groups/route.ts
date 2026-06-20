import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** GET /api/services/:id/config/groups — list config groups (role-aware). */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/services/${id}/config/groups`);
}

/** POST /api/services/:id/config/groups — create a config group (staff). */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/services/${id}/config/groups`, { method: "POST", body });
}
