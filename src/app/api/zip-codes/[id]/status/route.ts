import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * POST /api/zip-codes/:id/status — the ACTIVE <-> INACTIVE toggle (staff).
 *
 * Upstream accepts ACTIVE or INACTIVE only; ARCHIVED is reachable solely through
 * the admin-only /archive and /restore routes.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/zip-codes/${id}/status`, { method: "POST", body });
}
