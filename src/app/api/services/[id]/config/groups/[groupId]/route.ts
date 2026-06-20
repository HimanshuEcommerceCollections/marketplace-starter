import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** PATCH /api/services/:id/config/groups/:groupId — update a config group (staff). */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; groupId: string }> },
) {
  const { id, groupId } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/services/${id}/config/groups/${groupId}`, {
    method: "PATCH",
    body,
  });
}

/** DELETE /api/services/:id/config/groups/:groupId — delete a config group (staff). */
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; groupId: string }> },
) {
  const { id, groupId } = await ctx.params;
  return proxyJson(req, `/services/${id}/config/groups/${groupId}`, { method: "DELETE" });
}
