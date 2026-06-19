import { NextResponse, type NextRequest } from "next/server";
import { callApi } from "@/lib/api/server";
import { setSessionCookies } from "@/lib/auth/session";
import type { SessionUser } from "@/lib/auth/types";

interface AuthData {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

/** Shared login for all roles. Forwards to the server, sets session cookies. */
export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const result = await callApi<{ data?: AuthData }>("/auth/login", {
    method: "POST",
    body: { email: input.email, password: input.password },
  });

  if (!result.ok || !result.body?.data) {
    return NextResponse.json(
      result.body ?? { success: false, message: "Login failed" },
      { status: result.status || 502 },
    );
  }

  const res = NextResponse.json({ success: true, user: result.body.data.user });
  setSessionCookies(res, result.body.data);
  return res;
}
