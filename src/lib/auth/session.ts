import type { NextRequest, NextResponse } from "next/server";

/**
 * SERVER-ONLY session cookie helpers for the BFF auth route handlers.
 * Access + refresh tokens are stored in httpOnly cookies so they never reach
 * client-side JS (XSS-safe). Reads come off the NextRequest; writes go on the
 * outgoing NextResponse.
 */
export const ACCESS_COOKIE = "fp-access";
export const REFRESH_COOKIE = "fp-refresh";

// Cookie lifetime, NOT token lifetime. The JWT inside still expires per the
// server's JWT_ACCESS_EXPIRES_IN (~15m) and /api/auth/me rotates it via the
// refresh token. We keep the cookie for the full refresh window so middleware
// can always read the role for /admin route gating.
const ACCESS_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export function setSessionCookies(res: NextResponse, tokens: SessionTokens): void {
  res.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...baseCookie,
    maxAge: ACCESS_MAX_AGE,
  });
  res.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...baseCookie,
    maxAge: REFRESH_MAX_AGE,
  });
}

export function clearSessionCookies(res: NextResponse): void {
  res.cookies.set(ACCESS_COOKIE, "", { ...baseCookie, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...baseCookie, maxAge: 0 });
}

export function readSessionTokens(req: NextRequest): {
  accessToken?: string;
  refreshToken?: string;
} {
  return {
    accessToken: req.cookies.get(ACCESS_COOKIE)?.value,
    refreshToken: req.cookies.get(REFRESH_COOKIE)?.value,
  };
}
