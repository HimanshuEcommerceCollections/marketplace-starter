import { NextResponse, type NextRequest } from "next/server";
import { callApi } from "@/lib/api/server";
import type { SessionUser } from "@/lib/auth/types";

interface VerifyData {
  user: SessionUser;
  alreadyVerified: boolean;
}

/**
 * Redeem an email-verification token. Public — the token in the body IS the
 * credential. Forwards to the server's /auth/verify-email. On failure the
 * upstream envelope (incl. `errors.code` = TOKEN_INVALID | TOKEN_EXPIRED) passes
 * straight through so the client can render the right state. No session cookies
 * are set here: an already-signed-in user keeps their cookies; a logged-out user
 * signs in afterwards.
 */
export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => ({}))) as { token?: unknown };

  const result = await callApi<{ data?: VerifyData; message?: string }>(
    "/auth/verify-email",
    { method: "POST", body: { token: input.token } },
  );

  if (!result.ok || !result.body?.data) {
    return NextResponse.json(
      result.body ?? { success: false, message: "Verification failed" },
      { status: result.status || 502 },
    );
  }

  return NextResponse.json({
    success: true,
    user: result.body.data.user,
    alreadyVerified: result.body.data.alreadyVerified,
    message: result.body.message,
  });
}
