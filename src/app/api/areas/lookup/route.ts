import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * GET /api/areas/lookup?zip= — "who owns 27601?".
 *
 * Must stay a distinct static segment: upstream registers `/areas/lookup`
 * BEFORE `/areas/:id` for the same reason.
 */
export function GET(req: NextRequest) {
  return proxyJson(req, `/areas/lookup${req.nextUrl.search}`);
}
