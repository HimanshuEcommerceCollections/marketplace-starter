import { NextResponse, type NextRequest } from "next/server";
import { callApi } from "./server";
import { readSessionTokens, setSessionCookies } from "../auth/session";

/**
 * SERVER-ONLY. Proxy a browser request to the Elevate API as the signed-in user.
 * Attaches the access token from the httpOnly session cookie; on a 401 it rotates
 * via the refresh token (writing fresh cookies) and retries once — the same idiom
 * as the /api/auth/me handler. The upstream JSON envelope + status pass straight
 * through, so client callers see `{ success, message, data, meta? }` unchanged.
 */
export async function proxyJson(
  req: NextRequest,
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<NextResponse> {
  const { accessToken, refreshToken } = readSessionTokens(req);

  let result = await callApi(path, { ...init, token: accessToken });

  let rotated: { accessToken: string; refreshToken: string } | undefined;
  if (result.status === 401 && refreshToken) {
    const refreshed = await callApi<{
      data?: { accessToken: string; refreshToken: string };
    }>("/auth/refresh", { method: "POST", body: { refreshToken } });
    if (refreshed.ok && refreshed.body?.data) {
      rotated = {
        accessToken: refreshed.body.data.accessToken,
        refreshToken: refreshed.body.data.refreshToken,
      };
      result = await callApi(path, { ...init, token: rotated.accessToken });
    }
  }

  const res = NextResponse.json(result.body ?? null, { status: result.status });
  if (rotated) setSessionCookies(res, rotated);
  return res;
}
