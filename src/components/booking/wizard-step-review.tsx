"use client";

import {
  useBookingDraft,
  toConfiguration,
  addOnsSummary,
  formatWindowLabel,
} from "./booking-provider";
import { ReviewCard, ReviewRow } from "./review-card";
import { computePrice } from "@/lib/pricing/engine";
import { formatMoney } from "@/lib/money";
import type { Money } from "@/lib/booking/contract";

/** Whole-dollar money (e.g. "$109"); optional leading "+" for positive deltas. */
function money(m: Money, sign = false): string {
  const s = formatMoney(m).replace(/\.00$/, "");
  return sign && m.amount > 0 ? `+${s}` : s;
}

export function WizardStepReview() {
  const { state, dispatch, service, pricing } = useBookingDraft();
  const breakdown = computePrice(pricing, toConfiguration(state, service));
  const priceLines = breakdown.line_items.filter(
    (li) => li.kind === "base" || li.amount.amount !== 0,
  );
  const filledWindows = state.windows.filter((w) => w.date);
  const addOns = addOnsSummary(service, state.selections);

  const goTo = (step: "config" | "details") =>
    dispatch({ type: "SET_STEP", step });

  return (
    <div className="space-y-5">
      {/* Service */}
      <ReviewCard title="Service" onEdit={() => goTo("config")}>
        <ReviewRow label="Service" value={service.title} />
        {service.config_options
          .filter((o) => o.input === "select")
          .map((o) => (
            <ReviewRow
              key={o.id}
              label={o.label}
              value={
                o.choices?.find((c) => c.id === state.selections[o.id])?.label ??
                "—"
              }
            />
          ))}
        {service.config_options.some((o) => o.input === "multiselect") ? (
          <ReviewRow label="Add-ons" value={addOns || "None"} />
        ) : null}
      </ReviewCard>

      {/* Pricing */}
      <ReviewCard
        title="Pricing (Estimate)"
        badge={
          <span className="inline-flex items-center rounded-md bg-muted-foreground/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Estimate
          </span>
        }
      >
        {priceLines.map((li, i) => (
          <ReviewRow
            key={`${li.label}-${i}`}
            label={li.kind === "base" ? "Base Session" : li.label}
            value={
              li.kind === "base"
                ? `${breakdown.is_estimate ? "From " : ""}${money(li.amount)}`
                : money(li.amount, true)
            }
          />
        ))}
        <ReviewRow
          label="Estimated Total"
          emphasis
          value={`${breakdown.is_estimate ? "From " : ""}${money(breakdown.total)}`}
        />
      </ReviewCard>

      {/* Schedule */}
      <ReviewCard title="Schedule" onEdit={() => goTo("details")}>
        {filledWindows.length > 0 ? (
          filledWindows.map((w, i) => (
            <ReviewRow
              key={i}
              label={`Window ${i + 1}`}
              value={formatWindowLabel(w)}
            />
          ))
        ) : (
          <ReviewRow label="Windows" value="Flexible" />
        )}
      </ReviewCard>

      {/* Your Details */}
      <ReviewCard title="Your Details" onEdit={() => goTo("details")}>
        <ReviewRow
          label="Name"
          value={`${state.firstName} ${state.lastName}`.trim() || "—"}
        />
        <ReviewRow label="Email" value={state.email || "—"} />
        <ReviewRow label="Phone" value={state.phone || "—"} />
        <ReviewRow label="Location" value={state.address || "—"} />
      </ReviewCard>
    </div>
  );
}
