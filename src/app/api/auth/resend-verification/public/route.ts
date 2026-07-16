import { NextResponse, type NextRequest } from "next/server";
import { callApi } from "@/lib/api/server";

/**
 * Unauthenticated resend: caller supplies an email (e.g. their session expired).
 * Forwards to the server's public endpoint, which always returns the same
 * generic ack whether or not the address has an unverified account
 * (enumeration-safe). The envelope passes straight through.
 */
export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => ({}))) as { email?: unknown };

  const result = await callApi("/auth/resend-verification/public", {
    method: "POST",
    body: { email: input.email },
  });

  return NextResponse.json(
    result.body ?? { success: false, message: "Could not resend verification" },
    { status: result.status || 502 },
  );
}
