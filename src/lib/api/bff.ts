import { NextResponse, type NextRequest } from "next/server";
import { callApi, API_BASE_URL } from "./server";
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

/**
 * SERVER-ONLY. Proxy a multipart/form-data request (file uploads) to the API as
 * the signed-in user. proxyJson can't be used because callApi sends JSON; here
 * we re-stream the uploaded files via fetch (Node sets the multipart boundary).
 * Same 401 → refresh → retry-once idiom; the entries are buffered so the retry
 * can rebuild an identical body.
 */
export async function proxyMultipart(
  req: NextRequest,
  path: string,
  method: string,
): Promise<NextResponse> {
  const { accessToken, refreshToken } = readSessionTokens(req);

  // Buffer the incoming form so we can build a fresh body per attempt.
  const incoming = await req.formData();
  const entries: Array<[string, string | { blob: Blob; filename: string }]> = [];
  for (const [key, value] of incoming.entries()) {
    if (typeof value === "string") {
      entries.push([key, value]);
    } else {
      const buf = await value.arrayBuffer();
      entries.push([key, { blob: new Blob([buf], { type: value.type }), filename: value.name }]);
    }
  }
  const buildBody = () => {
    const form = new FormData();
    for (const [key, value] of entries) {
      if (typeof value === "string") form.append(key, value);
      else form.append(key, value.blob, value.filename);
    }
    return form;
  };

  const send = (token?: string) =>
    fetch(`${API_BASE_URL}${path}`, {
      method,
      body: buildBody(),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

  let upstream = await send(accessToken);

  let rotated: { accessToken: string; refreshToken: string } | undefined;
  if (upstream.status === 401 && refreshToken) {
    const refreshed = await callApi<{
      data?: { accessToken: string; refreshToken: string };
    }>("/auth/refresh", { method: "POST", body: { refreshToken } });
    if (refreshed.ok && refreshed.body?.data) {
      rotated = {
        accessToken: refreshed.body.data.accessToken,
        refreshToken: refreshed.body.data.refreshToken,
      };
      upstream = await send(rotated.accessToken);
    }
  }

  const body = await upstream.json().catch(() => null);
  const res = NextResponse.json(body, { status: upstream.status });
  if (rotated) setSessionCookies(res, rotated);
  return res;
}
