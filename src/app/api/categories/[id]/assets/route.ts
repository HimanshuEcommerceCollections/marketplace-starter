import type { NextRequest } from "next/server";
import { proxyJson, proxyMultipart } from "@/lib/api/bff";

// NOTE: the dynamic segment is named `[id]` to match the sibling category
// routes, but for asset endpoints it carries the category SLUG (the server keys
// assets by slug). The admin client passes the slug here.
interface Ctx {
  params: Promise<{ id: string }>;
}

/** GET /api/categories/:slug/assets — current uploaded icon + covers (staff). */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyJson(req, `/categories/${id}/assets`);
}

/** POST /api/categories/:slug/assets — upload icon and/or covers (multipart). */
export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyMultipart(req, `/categories/${id}/assets`, "POST");
}

/** PUT /api/categories/:slug/assets — replace/add/remove/reorder (multipart). */
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyMultipart(req, `/categories/${id}/assets`, "PUT");
}

/** DELETE /api/categories/:slug/assets — remove all assets. */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyJson(req, `/categories/${id}/assets`, { method: "DELETE" });
}
