import { NextResponse, type NextRequest } from "next/server";
import { callApi } from "@/lib/api/server";
import { clearSessionCookies, readSessionTokens } from "@/lib/auth/session";

/** Revokes the refresh token on the server (best-effort) and clears cookies. */
export async function POST(req: NextRequest) {
  const { refreshToken } = readSessionTokens(req);
  if (refreshToken) {
    await callApi("/auth/logout", { method: "POST", body: { refreshToken } });
  }
  const res = NextResponse.json({ success: true });
  clearSessionCookies(res);
  return res;
}
