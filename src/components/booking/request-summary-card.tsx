import * as React from "react";

export interface RequestSummaryCardProps {
  serviceTitle: string;
  session: string;
  addOns: string;
  schedule: string;
  /** Pre-formatted estimated total, e.g. "From $144". */
  total: string;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-surface-inverse-foreground/70">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

/**
 * Confirm-step request summary (dark rail, desktop only). Token-only.
 * Labeled rows rather than price line items.
 */
export function RequestSummaryCard({
  serviceTitle,
  session,
  addOns,
  schedule,
  total,
}: RequestSummaryCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface-inverse text-surface-inverse-foreground">
      <div className="space-y-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-surface-inverse-foreground/70">
          Request Summary
        </p>
        <h3 className="font-heading text-xl font-semibold">{serviceTitle}</h3>
        <span className="inline-flex w-fit items-center rounded-md bg-surface-inverse-foreground/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-surface-inverse-foreground/80">
          Draft Pricing
        </span>
      </div>
      <dl className="space-y-4 px-6 pb-6 text-sm">
        <Row label="Session" value={session} />
        <Row label="Add-ons" value={addOns || "—"} />
        <Row label="Schedule" value={schedule || "—"} />
        <Row
          label="Estimated"
          value={
            <span className="text-highlight">
              {total}{" "}
              <span className="text-xs uppercase tracking-wide text-surface-inverse-foreground/70">
                Draft
              </span>
            </span>
          }
        />
      </dl>
    </div>
  );
}
