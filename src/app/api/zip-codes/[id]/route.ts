import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** GET /api/zip-codes/:id — one ZIP with its market inlined (staff). */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/zip-codes/${id}`);
}

/**
 * PATCH /api/zip-codes/:id — edit a ZIP (staff).
 *
 * A body containing `areaId` is a MOVE and can come back 409
 * ZIP_MOVE_BLOCKED_BY_COVERAGE with the blocking services in `errors.services`.
 */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/zip-codes/${id}`, { method: "PATCH", body });
}
