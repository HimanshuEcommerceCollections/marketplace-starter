import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * GET /api/zip-codes/by-code/:zipCode — the cross-area "who owns 27601?" read
 * (staff). Upstream normalises the segment to 5 digits, so ZIP+4 is accepted.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ zipCode: string }> },
) {
  const { zipCode } = await ctx.params;
  return proxyJson(req, `/zip-codes/by-code/${encodeURIComponent(zipCode)}`);
}
