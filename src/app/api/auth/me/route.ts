import { NextResponse, type NextRequest } from "next/server";
import { callApi } from "@/lib/api/server";
import {
  setSessionCookies,
  clearSessionCookies,
  readSessionTokens,
} from "@/lib/auth/session";
import type { SessionUser } from "@/lib/auth/types";

interface AuthData {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * Returns the current user (or null). Tries the access token first; if it's
 * missing/expired, rotates via the refresh token. Always 200 — "logged out" is
 * a normal state, not an error.
 */
export async function GET(req: NextRequest) {
  const { accessToken, refreshToken } = readSessionTokens(req);

  if (accessToken) {
    const me = await callApi<{ data?: SessionUser }>("/auth/me", {
      token: accessToken,
    });
    if (me.ok && me.body?.data) {
      return NextResponse.json({ user: me.body.data });
    }
  }

  if (refreshToken) {
    const refreshed = await callApi<{ data?: AuthData }>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
    if (refreshed.ok && refreshed.body?.data) {
      const res = NextResponse.json({ user: refreshed.body.data.user });
      setSessionCookies(res, refreshed.body.data);
      return res;
    }
  }

  const res = NextResponse.json({ user: null });
  clearSessionCookies(res);
  return res;
}
