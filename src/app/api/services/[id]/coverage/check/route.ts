import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * GET /api/services/:id/coverage/check?zip= — the truth-teller.
 *
 * Calls the SAME resolver the booking write path calls, so what an admin sees is
 * by construction what a customer gets. Always 200, including for "not
 * serviceable". Staff callers additionally get the precise internal `reason` plus
 * `matchedTier` / `matchedRuleId`.
 *
 * Rate-limited upstream at 30/min keyed on the ZIP, so call it only on a
 * complete 5-digit ZIP.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return proxyJson(req, `/services/${id}/coverage/check${req.nextUrl.search}`);
}
