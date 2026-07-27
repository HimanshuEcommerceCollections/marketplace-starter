import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * GET /api/areas/:id/zip-codes — the coverage picker's ZIP list for one market
 * (`?status=&search=`).
 *
 * Deliberately NOT paginated upstream: it hard-caps and returns
 * `{ items, truncated }`.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/areas/${id}/zip-codes${req.nextUrl.search}`);
}
