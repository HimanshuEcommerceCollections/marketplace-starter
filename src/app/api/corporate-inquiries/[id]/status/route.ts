import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * PATCH /api/corporate-inquiries/:id/status — staff triage transition.
 * Server authorizes on the forwarded session cookie.
 */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/corporate-inquiries/${id}/status`, {
    method: "PATCH",
    body,
  });
}
