import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

interface Ctx {
  params: Promise<{ id: string; coverId: string }>;
}

/** DELETE /api/services/:slug/assets/covers/:coverId — remove one cover. */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { id, coverId } = await ctx.params;
  return proxyJson(req, `/services/${id}/assets/covers/${coverId}`, {
    method: "DELETE",
  });
}
