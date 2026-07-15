import { NextResponse, type NextRequest } from "next/server";
import { callApi } from "@/lib/api/server";
import { setSessionCookies } from "@/lib/auth/session";
import { getActiveBrandId } from "@/lib/brand/registry";
import type { SessionUser } from "@/lib/auth/types";

interface AuthData {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

/** Customer self-signup. Forwards to the server's public register endpoint. */
export async function POST(req: NextRequest) {
  const input = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const result = await callApi<{ data?: AuthData }>("/auth/register", {
    method: "POST",
    body: {
      name: input.name,
      email: input.email,
      password: input.password,
      phone: input.phone || undefined,
      // Multi-value coverage area (Wake County towns) chosen at signup.
      area: input.area,
      // Brand is server-trusted (from NEXT_PUBLIC_BRAND), never client-supplied.
      brand: getActiveBrandId(),
    },
  });

  if (!result.ok || !result.body?.data) {
    return NextResponse.json(
      result.body ?? { success: false, message: "Registration failed" },
      { status: result.status || 502 },
    );
  }

  const res = NextResponse.json(
    { success: true, user: result.body.data.user },
    { status: 201 },
  );
  setSessionCookies(res, result.body.data);
  return res;
}
