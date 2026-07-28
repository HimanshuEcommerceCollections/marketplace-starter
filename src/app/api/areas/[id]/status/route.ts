import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * POST /api/areas/:id/status — generic lifecycle transition (staff).
 *
 * Forwards `{ status }`. Upstream re-checks the caller's role, so ARCHIVED
 * through here is still admin-only and ARCHIVED -> ACTIVE is still refused.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/areas/${id}/status`, { method: "POST", body });
}
