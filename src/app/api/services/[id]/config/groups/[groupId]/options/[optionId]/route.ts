import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** PATCH /api/services/:id/config/groups/:groupId/options/:optionId — update an option (staff). */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; groupId: string; optionId: string }> },
) {
  const { id, groupId, optionId } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, `/services/${id}/config/groups/${groupId}/options/${optionId}`, {
    method: "PATCH",
    body,
  });
}

/** DELETE /api/services/:id/config/groups/:groupId/options/:optionId — delete an option (staff). */
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; groupId: string; optionId: string }> },
) {
  const { id, groupId, optionId } = await ctx.params;
  return proxyJson(req, `/services/${id}/config/groups/${groupId}/options/${optionId}`, {
    method: "DELETE",
  });
}
