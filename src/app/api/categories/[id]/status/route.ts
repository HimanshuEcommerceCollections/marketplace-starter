import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** POST /api/categories/:id/status — generic lifecycle transition (staff).
 *  Forwards the `{ status }` body to the upstream API. */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/categories/${id}/status`, { method: "POST", body });
}
