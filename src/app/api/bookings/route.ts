import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/** GET /api/bookings — list the signed-in user's bookings (server scopes to them). */
export async function GET(req: NextRequest) {
  return proxyJson(req, `/bookings${req.nextUrl.search}`);
}

/** POST /api/bookings — create a booking (auth required; cookie forwarded upstream). */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/bookings", { method: "POST", body });
}
