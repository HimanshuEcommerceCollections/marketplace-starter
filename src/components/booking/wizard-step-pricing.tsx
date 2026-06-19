"use client";

import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBrand } from "@/components/layout/brand-provider";
import { useBookingDraft, toConfiguration, selectionSummary } from "./booking-provider";
import { computePrice } from "@/lib/pricing/engine";
import { formatMoney } from "@/lib/money";
import type { Money } from "@/lib/booking/contract";

/** Whole-dollar money (e.g. "$109"); optional leading "+" for positive deltas. */
function money(m: Money, sign = false): string {
  const s = formatMoney(m).replace(/\.00$/, "");
  return sign && m.amount > 0 ? `+${s}` : s;
}

/**
 * Step 3 — "Review Your Pricing". Detailed, itemized DRAFT estimate driven by
 * the pricing engine. Token-only; reusable across services.
 */
export function WizardStepPricing() {
  const { state, service, pricing } = useBookingDraft();
  const { config } = useBrand();

  const breakdown = computePrice(pricing, toConfiguration(state, service));
  const summary = selectionSummary(service, state.selections);
  // Only non-zero lines (a $0 base — e.g. Beauty — is omitted; its total comes
  // entirely from the selected services).
  const lines = breakdown.line_items.filter((li) => li.amount.amount !== 0);

  return (
    <div className="space-y-6">
      {/* DRAFT notice */}
      <div className="flex items-start gap-2 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          All pricing is a DRAFT estimate. Final pricing confirmed by coordinator
          before your session.
        </p>
      </div>

      {/* Itemized breakdown */}
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="border-b border-border bg-muted/60 p-6">
          <h3 className="font-heading text-xl font-semibold text-foreground">
            {service.title}
            {summary ? ` — ${summary}` : ""}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {config.serviceArea ? (
              <span className="inline-flex items-center rounded-md bg-highlight/10 px-2 py-0.5 text-xs font-semibold text-highlight">
                {config.serviceArea}
              </span>
            ) : null}
            <Badge variant="secondary" className="uppercase tracking-wide">
              Draft Pricing
            </Badge>
          </div>
        </div>

        <dl className="divide-y divide-border">
          {lines.map((li, i) => (
            <div
              key={`${li.label}-${i}`}
              className="flex items-center justify-between gap-4 p-6"
            >
              <dt className="text-sm text-foreground">
                {li.kind === "base"
                  ? `Base Session${summary ? `: ${summary}` : ""}`
                  : li.label}
              </dt>
              <dd className="flex shrink-0 items-center gap-2 text-sm font-semibold">
                <span className={li.kind === "base" ? "text-foreground" : "text-highlight"}>
                  {li.kind === "base"
                    ? `${breakdown.is_estimate ? "From " : ""}${money(li.amount)}`
                    : money(li.amount, true)}
                </span>
                {li.kind !== "base" ? (
                  <Badge variant="secondary" className="uppercase tracking-wide">
                    Draft
                  </Badge>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-border bg-muted/60 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-foreground">
              {breakdown.is_estimate ? "Estimated Total (DRAFT)" : "Total"}
            </span>
            <span className="font-heading text-2xl font-semibold text-highlight">
              {breakdown.is_estimate ? "From " : ""}
              {money(breakdown.total)}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            This is a draft estimate. The coordinator will confirm final pricing
            before confirming your session.
          </p>
        </div>
      </div>
    </div>
  );
}
