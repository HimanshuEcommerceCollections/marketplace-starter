import { type NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/bff";

/**
 * Authenticated resend: re-sends the verification email to the signed-in user.
 * proxyJson attaches the session access token (and rotates via refresh on 401),
 * so no email is needed in the body — the server uses req.user.id. The generic
 * ack envelope passes straight through.
 */
export async function POST(req: NextRequest) {
  return proxyJson(req, "/auth/resend-verification", { method: "POST" });
}
