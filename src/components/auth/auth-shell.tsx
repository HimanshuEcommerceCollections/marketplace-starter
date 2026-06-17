import * as React from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { SampleBadge } from "@/components/shared/sample-badge";
import { isEnabled } from "@/lib/flags/resolve";
import type { AuthUserType } from "@/lib/auth/user-type";
import type { TestimonialItem } from "@/lib/brand/types";

const DRAFT_NOTICE =
  "DRAFT EXPERIENCE — Pricing and service availability shown for demonstration purposes.";

export interface AuthShellProps {
  /** Which audience this screen serves — switches the whole layout. */
  userType: AuthUserType;
  brandName: string;
  logoSublabel?: string;
  /** Heading shown directly above the form (e.g. "Welcome back"). */
  formHeading: string;
  formSub?: string;
  /** Brand-panel marketing headline (customer split-screen only). */
  panelTitle?: string;
  categories?: string[];
  quote?: TestimonialItem;
  children: React.ReactNode;
}

/** Top draft banner (RULE: the draft notice appears on every page; the auth
 *  screens drop the global navbar, so they render their own — like /book). */
function DraftBanner({ tone }: { tone: "light" | "dark" }) {
  if (!isEnabled("demoBanner")) return null;
  return (
    <div
      role="region"
      aria-label="Draft experience notice"
      className={
        tone === "dark"
          ? "bg-surface-inverse px-4 py-2 text-center text-xs font-medium text-surface-inverse-foreground"
          : "bg-secondary px-4 py-2 text-center text-xs font-medium text-secondary-foreground"
      }
    >
      <TriangleAlert
        className="mr-1.5 inline size-3.5 -translate-y-px"
        aria-hidden
      />
      {DRAFT_NOTICE}
    </div>
  );
}

function Wordmark({
  brandName,
  logoSublabel,
  onDark,
}: {
  brandName: string;
  logoSublabel?: string;
  onDark?: boolean;
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
        <span
          className={
            onDark
              ? "text-xs font-medium text-primary-foreground/70"
              : "text-xs font-medium text-muted-foreground"
          }
        >
          {logoSublabel}
        </span>
      ) : null}
    </Link>
  );
}

function SampleQuote({
  quote,
  onDark,
}: {
  quote: TestimonialItem;
  onDark?: boolean;
}) {
  return (
    <figure className="border-l-2 border-highlight pl-4">
      <SampleBadge
        className={
          onDark ? "mb-2 border-primary-foreground/40 text-primary-foreground" : "mb-2"
        }
      />
      <blockquote
        className={
          onDark
            ? "font-heading text-sm italic text-primary-foreground/80"
            : "font-heading text-sm italic text-muted-foreground"
        }
      >
        &ldquo;{quote.quote}&rdquo;
      </blockquote>
    </figure>
  );
}

/**
 * Frame for the auth screens. Two distinct layouts by user type:
 *
 * - `user`   — customer split-screen: brand panel (left) + form column (right).
 * - `system` — internal/staff console: a centered card on a dark backdrop.
 */
export function AuthShell({
  userType,
  brandName,
  logoSublabel,
  formHeading,
  formSub,
  panelTitle,
  categories = [],
  quote,
  children,
}: AuthShellProps) {
  if (userType === "system") {
    return (
      <div className="flex min-h-screen flex-col bg-surface-inverse text-surface-inverse-foreground">
        <DraftBanner tone="dark" />
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="mb-6 flex flex-col items-center text-center">
              <Wordmark
                brandName={brandName}
                logoSublabel={logoSublabel}
                onDark
              />
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface-inverse-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-surface-inverse-foreground/80">
                System Console · Authorized access
              </span>
            </div>
            <div className="rounded-2xl bg-card p-6 text-card-foreground shadow-lg sm:p-8">
              <h1 className="font-heading text-2xl font-semibold">
                {formHeading}
              </h1>
              {formSub ? (
                <p className="mt-1 text-sm text-muted-foreground">{formSub}</p>
              ) : null}
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // userType === "user" — customer-facing split-screen.
  return (
    <div className="flex min-h-screen flex-col">
      <DraftBanner tone="light" />
      <div className="grid flex-1 lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="relative hidden flex-col justify-between gap-10 bg-primary p-10 text-primary-foreground lg:flex xl:p-14">
          <Wordmark
            brandName={brandName}
            logoSublabel={logoSublabel}
            onDark
          />

          <div className="flex flex-1 flex-col justify-center gap-10">
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-t-2 border-primary-foreground/15 border-t-highlight bg-primary-foreground/5 text-sm text-primary-foreground/40">
              Lifestyle Photography Placeholder
            </div>
            {panelTitle ? (
              <h2 className="max-w-md font-heading text-4xl font-semibold leading-tight xl:text-5xl">
                {panelTitle}
              </h2>
            ) : null}
          </div>

          <div className="space-y-5">
            {categories.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li
                    key={c}
                    className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground/90"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            ) : null}
            {quote ? <SampleQuote quote={quote} onDark /> : null}
          </div>
        </aside>

        {/* Form column */}
        <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            {/* Compact wordmark for mobile, where the brand panel is hidden. */}
            <div className="mb-8 lg:hidden">
              <Wordmark brandName={brandName} logoSublabel={logoSublabel} />
            </div>
            <h1 className="font-heading text-3xl font-semibold text-foreground">
              {formHeading}
            </h1>
            {formSub ? (
              <p className="mt-1 text-muted-foreground">{formSub}</p>
            ) : null}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
