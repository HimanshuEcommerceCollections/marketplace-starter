import type { NextRequest } from "next/server";
import { proxyJson, proxyMultipart } from "@/lib/api/bff";

// NOTE: the dynamic segment is named `[id]` to match the sibling service
// routes, but for asset endpoints it carries the service SLUG (the server keys
// assets by slug). The admin client passes the slug here.
interface Ctx {
  params: Promise<{ id: string }>;
}

/** GET /api/services/:slug/assets — current uploaded icon + covers (staff). */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyJson(req, `/services/${id}/assets`);
}

/** POST /api/services/:slug/assets — upload icon and/or covers (multipart). */
export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyMultipart(req, `/services/${id}/assets`, "POST");
}

/** PUT /api/services/:slug/assets — replace/add/remove/reorder (multipart). */
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyMultipart(req, `/services/${id}/assets`, "PUT");
}

/** DELETE /api/services/:slug/assets — remove all assets. */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyJson(req, `/services/${id}/assets`, { method: "DELETE" });
}
