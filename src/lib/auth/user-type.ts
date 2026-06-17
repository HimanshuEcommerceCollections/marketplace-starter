/**
 * Auth/app audience ("view mode"). The app can render two distinct designs:
 *
 * - `user`   — the customer-facing experience (e.g. the auth split-screen).
 * - `system` — internal / staff ("system", admin) screens.
 *
 * In a real app the audience would come from the authenticated session / role.
 * For this demo it is a persisted **view mode** stored in a cookie and flipped
 * by a temporary dev toggle, so any current or future SYSTEM screen renders in
 * the selected mode across navigation.
 *
 * This module is client-safe (no `next/headers`); the server-side reader lives
 * in `view-mode.ts`.
 */
export type AuthUserType = "user" | "system";

/** Cookie that persists the selected view mode across requests/navigation. */
export const VIEW_MODE_COOKIE = "fp-view-mode";

/** Normalize any untrusted value to a known view mode (defaults to user). */
export function parseViewMode(value?: string | null): AuthUserType {
  return value === "system" ? "system" : "user";
}
