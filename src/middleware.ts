import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE } from "@/lib/auth/session";
import { STAFF_ROLES } from "@/lib/auth/roles";
import type { SessionRole } from "@/lib/auth/types";

/**
 * Route guard for /admin.
 *
 * NOTE: this is UX-level gating only. It decodes the JWT payload WITHOUT
 * verifying the signature (the signing secret lives on the API server, not
 * here), so it must never be the sole line of defense. Real enforcement is the
 * server's `authorize()` on every protected data endpoint — a forged cookie
 * gets a nicer redirect here but still can't read or write anything.
 */
function readRole(token: string | undefined): SessionRole | null {
  if (!token) return null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    let b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    b64 = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
    const data = JSON.parse(atob(b64)) as { role?: SessionRole };
    return data.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const role = readRole(req.cookies.get(ACCESS_COOKIE)?.value);

  // Not signed in → send to login.
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Signed in but not staff → send to the customer home.
  if (!STAFF_ROLES.includes(role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
