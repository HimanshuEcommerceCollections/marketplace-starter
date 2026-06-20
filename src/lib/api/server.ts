import axios from "axios";

/**
 * SERVER-ONLY axios client for the Elevate backend API. Imported only by the
 * BFF route handlers (src/app/api/**), never by client components — the browser
 * talks to those same-origin route handlers, not to this base URL directly.
 */
export const API_BASE_URL =
  process.env.API_BASE_URL ?? "http://localhost:4000/api/v1";

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  body: T;
}

export async function callApi<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown; token?: string } = {},
): Promise<ApiResult<T>> {
  try {
    const res = await axios.request({
      url: `${API_BASE_URL}${path}`,
      method: init.method ?? "GET",
      data: init.body,
      headers: init.token ? { Authorization: `Bearer ${init.token}` } : undefined,
      // Resolve every status so callers inspect status/body uniformly.
      validateStatus: () => true,
    });
    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      body: res.data as T,
    };
  } catch {
    // Upstream unreachable (server down / wrong API_BASE_URL).
    return {
      ok: false,
      status: 502,
      body: { success: false, message: "Authentication service is unavailable" } as T,
    };
  }
}
