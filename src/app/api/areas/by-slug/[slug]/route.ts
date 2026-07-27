import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** GET /api/areas/by-slug/:slug — public lookup by natural key (`?includeZipCodes=`). */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  return proxyJson(
    req,
    `/areas/by-slug/${encodeURIComponent(slug)}${req.nextUrl.search}`,
  );
}
