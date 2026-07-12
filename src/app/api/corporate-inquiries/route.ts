import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * POST /api/corporate-inquiries — submit a corporate wellness inquiry.
 * Public (no auth); the upstream endpoint accepts anonymous submissions.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/corporate-inquiries", { method: "POST", body });
}

/**
 * GET /api/corporate-inquiries — staff-only list (the server authorizes on the
 * forwarded session cookie; non-staff get a 401/403 passed straight through).
 */
export async function GET(req: NextRequest) {
  return proxyJson(req, `/corporate-inquiries${req.nextUrl.search}`);
}
