import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * POST /api/payments/intent — create (or reuse) a Stripe PaymentIntent for a
 * booking. Auth cookie is forwarded upstream by proxyJson; the backend sources
 * the charge amount from the booking, never from the request body.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as unknown;
  return proxyJson(req, "/payments/intent", { method: "POST", body });
}
