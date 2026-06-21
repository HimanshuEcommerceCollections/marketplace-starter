"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/components/layout/brand-provider";
import type { BookingRequest } from "@/lib/booking/contract";

const NEXT_STEPS = [
  "A coordinator reviews your request and checks availability.",
  "We match you with a vetted, independent professional.",
  "You'll receive an email confirmation with the final details.",
  "Your professional arrives at the confirmed time.",
];

/** Derive a friendly reference, e.g. "ELV-2026-4821", from the request. */
function bookingReference(prefix: string, request?: BookingRequest): string {
  if (!request) return `${prefix}-0000-0000`;
  const year = new Date(request.created_at).getFullYear();
  let h = 0;
  for (const ch of request.request_id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `${prefix}-${year}-${String(h % 10000).padStart(4, "0")}`;
}

/**
 * Booking confirmation content (Step 6 / Done). Pure, centered content — the
 * stepper + chrome are supplied by the wizard layout. Degrades to a placeholder
 * reference when visited without an in-progress request.
 */
export function BookingSuccessScreen({
  request,
  reference: liveReference,
  live = false,
}: {
  request?: BookingRequest;
  /** Real backend booking reference (live submit). */
  reference?: string;
  /** True when this was a real (API) booking, not the demo stub. */
  live?: boolean;
}) {
  const { config } = useBrand();
  const prefix =
    config.bookingPrefix ?? config.shortName.slice(0, 3).toUpperCase();
  const reference = React.useMemo(
    () => liveReference ?? bookingReference(prefix, request),
    [liveReference, prefix, request],
  );

  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div role="status">
      <span
        aria-hidden
        className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Check className="size-9" strokeWidth={2.5} />
      </span>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 font-heading text-3xl font-semibold tracking-tight text-foreground outline-none md:text-4xl"
      >
        Request Submitted!
      </h1>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
        Your booking request has been received. A coordinator will contact you
        within one business hour to confirm availability and finalize details.
      </p>

      {/* Reference number */}
      <div className="mx-auto mt-8 max-w-md rounded-2xl bg-surface-inverse p-6 text-surface-inverse-foreground">
        <p className="text-xs font-semibold uppercase tracking-widest text-surface-inverse-foreground/70">
          Your Reference Number
        </p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <span className="font-heading text-2xl font-semibold md:text-3xl">
            {reference}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy reference number"
            className="inline-flex items-center gap-1 rounded-md bg-highlight/20 px-2.5 py-1 text-xs font-semibold text-highlight transition-colors hover:bg-highlight/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inverse"
          >
            <Copy className="size-3" aria-hidden />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-3 text-sm text-surface-inverse-foreground/60">
          Keep this number for your records. You&apos;ll receive email
          confirmation shortly.
        </p>
      </div>

      {/* What happens next */}
      <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-border text-left">
        <div className="border-b border-border bg-muted/60 px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            What Happens Next?
          </h2>
        </div>
        <ol className="divide-y divide-border">
          {NEXT_STEPS.map((step, i) => (
            <li key={i} className="flex items-center gap-3 px-6 py-4">
              <span
                aria-hidden
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              >
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="w-full bg-highlight text-highlight-foreground hover:bg-highlight/90 sm:w-auto"
        >
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="/book">Book Another Service</Link>
        </Button>
      </div>

      <p className="mx-auto mt-6 max-w-md text-xs text-muted-foreground">
        {live
          ? "DRAFT EXPERIENCE — Your booking request has been recorded. A coordinator will confirm availability and final pricing."
          : "DRAFT EXPERIENCE — This confirmation is a demonstration only. No actual booking has been made."}
      </p>
    </div>
  );
}
