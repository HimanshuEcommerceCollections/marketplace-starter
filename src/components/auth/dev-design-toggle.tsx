"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { VIEW_MODE_COOKIE, type AuthUserType } from "@/lib/auth/user-type";

/**
 * TEMPORARY dev-only affordance ─────────────────────────────────────────────
 * Global floating button to switch the app's design between the customer
 * ("user") and internal ("system" / admin) experiences. The choice is
 * persisted in a cookie and applied across navigation, so any current or
 * future SYSTEM screen renders in the selected mode.
 *
 * REMOVE before production: delete this file and its single <DevDesignToggle/>
 * usage in src/app/layout.tsx.
 * ───────────────────────────────────────────────────────────────────────────
 */
function readCookieMode(): AuthUserType {
  if (typeof document === "undefined") return "user";
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${VIEW_MODE_COOKIE}=`));
  return match?.split("=")[1] === "system" ? "system" : "user";
}

export function DevDesignToggle() {
  const router = useRouter();
  // Start at the SSR default ("user") and sync to the cookie after mount to
  // avoid a hydration mismatch on the label.
  const [mode, setMode] = React.useState<AuthUserType>("user");

  React.useEffect(() => {
    setMode(readCookieMode());
  }, []);

  function toggle() {
    const next: AuthUserType = mode === "system" ? "user" : "system";
    // 1 year, site-wide. Lax is fine for a same-site dev toggle.
    document.cookie = `${VIEW_MODE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setMode(next);
    // Re-render server components so they pick up the new cookie.
    router.refresh();
  }

  const next: AuthUserType = mode === "system" ? "user" : "system";

  return (
    <div className="z-toast fixed bottom-4 right-4">
      <button
        type="button"
        onClick={toggle}
        aria-label={`Switch design to ${next} view`}
        className="inline-flex items-center gap-2 rounded-full border border-highlight/40 bg-surface-inverse px-4 py-2 text-xs font-medium text-surface-inverse-foreground shadow-lg transition-colors hover:bg-surface-inverse/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="rounded bg-highlight px-1.5 py-0.5 font-semibold uppercase tracking-wide text-highlight-foreground">
          Dev
        </span>
        <span>
          Mode: {mode === "system" ? "System" : "User"} · switch to{" "}
          {next === "system" ? "System" : "User"}
        </span>
        <ArrowLeftRight className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
