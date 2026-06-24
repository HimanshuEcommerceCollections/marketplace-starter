"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { isStaffRole } from "@/lib/auth/roles";

/**
 * Client-side gate for the admin console.
 *
 * The Next middleware (`src/middleware.ts`) only does an UNVERIFIED cookie
 * decode — it lacks the JWT signing secret — so a forged or stale cookie can
 * slip past it and render the admin shell, even though every data call then
 * 401s against the API. This guard closes that cosmetic gap: it trusts the
 * signature-verified `/auth/me` result surfaced by AuthProvider and redirects
 * anyone who isn't signed-in staff away BEFORE the shell paints.
 *
 * It is defense-in-depth, not the security boundary — the server's
 * `authenticate` + `authorize` on every endpoint remains authoritative.
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();

  const isStaff = !!user && isStaffRole(user.role);
  const allowed = status === "authenticated" && isStaff;

  React.useEffect(() => {
    // Wait for the verified /auth/me round-trip to settle before deciding.
    if (status === "loading") return;
    if (allowed) return;
    // Mirror the middleware's targets: signed-out → login; signed-in but not
    // staff → customer home. `replace` so the admin URL isn't left in history.
    router.replace(status === "authenticated" ? "/" : "/login");
  }, [status, allowed, router]);

  if (allowed) return <>{children}</>;

  // Loading or being redirected — render a minimal placeholder, never the shell.
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-muted text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
      <span className="text-sm font-medium">Checking access…</span>
    </div>
  );
}
