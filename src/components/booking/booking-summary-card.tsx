import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import type { DisplayedPrice, Money } from "@/lib/booking/contract";

export interface BookingSummaryCardProps {
  serviceTitle: string;
  breakdown: DisplayedPrice;
  /** Label for the base line (e.g. "60 minutes · Swedish"); defaults to title. */
  baseLabel?: string;
  /** "See Full Pricing" action (advances the flow). */
  onSeePricing?: () => void;
  ctaLabel?: string;
  /** Condensed variant: no CTA / coordinator note, "Total" label, badge at bottom. */
  condensed?: boolean;
}

/** Whole-dollar money (e.g. "$109"); optional leading "+" for positive deltas. */
function money(m: Money, sign = false): string {
  const s = formatMoney(m).replace(/\.00$/, "");
  return sign && m.amount > 0 ? `+${s}` : s;
}

/**
 * Live booking summary. Token-only. Driven by the pricing engine breakdown.
 * Dark sticky card on desktop; light card below the form on tablet/mobile.
 */
export function BookingSummaryCard({
  serviceTitle,
  breakdown,
  baseLabel,
  onSeePricing,
  ctaLabel = "See Full Pricing",
  condensed = false,
}: BookingSummaryCardProps) {
  const base = baseLabel || serviceTitle;
  const draftBadge = (
    <span className="inline-flex w-fit items-center rounded-md bg-muted-foreground/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:bg-surface-inverse-foreground/15 lg:text-surface-inverse-foreground/80">
      Draft Pricing
    </span>
  );
  // Base line + only the selections that change the price.
  const lines = breakdown.line_items.filter(
    (li) => li.kind === "base" || li.amount.amount !== 0,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted text-foreground lg:border-transparent lg:bg-surface-inverse lg:text-surface-inverse-foreground">
      <div className="space-y-3 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground lg:text-surface-inverse-foreground/70">
          Booking Summary
        </p>
        <h3 className="font-heading text-xl font-semibold">{serviceTitle}</h3>
        {!condensed ? draftBadge : null}
      </div>

      <div className="space-y-3 px-6">
        <dl className="space-y-3 text-sm">
          {lines.map((li, i) => (
            <div
              key={`${li.label}-${i}`}
              className="flex items-baseline justify-between gap-4"
            >
              <dt className="text-muted-foreground lg:text-surface-inverse-foreground/70">
                {li.kind === "base" ? base : li.label}
              </dt>
              <dd className="font-medium">
                {li.kind === "base"
                  ? `${breakdown.is_estimate ? "From " : ""}${money(li.amount)}`
                  : money(li.amount, true)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-border pt-3 lg:border-surface-inverse-foreground/20">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm font-semibold">
              {condensed
                ? "Total"
                : breakdown.is_estimate
                  ? "Estimated Total"
                  : "Total"}
            </span>
            <span className="font-heading text-xl font-semibold text-highlight">
              {breakdown.is_estimate ? "From " : ""}
              {money(breakdown.total)}
            </span>
          </div>
          {!condensed ? (
            <p className="mt-2 text-xs text-muted-foreground lg:text-surface-inverse-foreground/60">
              DRAFT — Final price confirmed by coordinator.
            </p>
          ) : null}
        </div>
      </div>

      {condensed ? (
        <div className="p-6 pt-4">{draftBadge}</div>
      ) : onSeePricing ? (
        <div className="mt-4 p-2">
          <Button
            type="button"
            onClick={onSeePricing}
            className="w-full bg-highlight text-highlight-foreground hover:bg-highlight/90 focus-visible:ring-offset-surface-inverse"
          >
            {ctaLabel}
            <ArrowRight aria-hidden />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
