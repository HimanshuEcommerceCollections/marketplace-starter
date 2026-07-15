import * as React from "react";
import Link from "next/link";
import type { AuthUserType } from "@/lib/auth/user-type";

export interface AuthShellProps {
  /** Which audience this screen serves — switches the whole layout. */
  userType: AuthUserType;
  /** Which auth screen — selects the brand-panel background photo. */
  screen: "login" | "signup";
  brandName: string;
  logoSublabel?: string;
  /** Heading shown above the form (e.g. "Welcome back."). */
  heading: string;
  sub?: string;
  /** Brand-panel blockquote: lead text + emphasized clause (customer only). */
  quoteLead?: string;
  quoteEm?: string;
  /** Glass chips under the blockquote (customer only). */
  chips?: string[];
  children: React.ReactNode;
}

function Wordmark({
  brandName,
  logoSublabel,
}: {
  brandName: string;
  logoSublabel?: string;
}) {
  return (
    <Link
      href="/"
      className="inline-flex flex-col leading-tight rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="font-heading text-lg font-semibold uppercase tracking-widest">
        {brandName}
      </span>
      {logoSublabel ? (
        <span className="text-xs font-medium text-primary-foreground/70">
          {logoSublabel}
        </span>
      ) : null}
    </Link>
  );
}

/**
 * Frame for the auth screens. Two distinct layouts by user type:
 *
 * - `user`   — customer split-screen: photographic brand panel (left) + form
 *              column (right). Styled by src/styles/auth.css.
 * - `system` — internal/staff console: a centered card on a dark backdrop
 *              (token-styled).
 */
export function AuthShell({
  userType,
  screen,
  brandName,
  logoSublabel,
  heading,
  sub,
  quoteLead,
  quoteEm,
  chips = [],
  children,
}: AuthShellProps) {
  if (userType === "system") {
    return (
      <div className="flex min-h-screen flex-col bg-surface-inverse text-surface-inverse-foreground">
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="mb-6 flex flex-col items-center text-center">
              <Wordmark brandName={brandName} logoSublabel={logoSublabel} />
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface-inverse-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-surface-inverse-foreground/80">
                System Console · Authorized access
              </span>
            </div>
            <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-lg sm:p-8">
              <h1 className="font-heading text-2xl font-semibold">{heading}</h1>
              {sub ? (
                <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
              ) : null}
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // userType === "user" — customer-facing split-screen (see auth.css).
  return (
    <div className="auth-wrap">
      <aside className={`auth-panel auth-panel--${screen}`}>
        <div className="auth-panel-inner">
          <Link href="/" className="logo">
            {brandName}
          </Link>
          {quoteLead ? (
            <blockquote>
              {quoteLead}
              {quoteEm ? (
                <>
                  {" "}
                  <em>{quoteEm}</em>
                </>
              ) : null}
            </blockquote>
          ) : null}
          {chips.length > 0 ? (
            <div className="auth-chips">
              {chips.map((c) => (
                <span key={c} className="a-chip">
                  {c}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </aside>

      <div className="auth-side">
        <div className="auth-card">
          <h1>{heading}</h1>
          {sub ? <p className="auth-sub">{sub}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
