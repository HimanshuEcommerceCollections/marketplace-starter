"use client";

import { useBookingDraft, toConfiguration } from "./booking-provider";
import { PriceSummaryCard } from "./price-summary-card";
import { computePrice } from "@/lib/pricing/engine";

export function WizardStepReview() {
  const ctx = useBookingDraft();
  const { state, service } = ctx;
  const config = toConfiguration(state, service);
  const breakdown = computePrice(ctx.pricing, config);

  const selectionRows = Object.entries(state.selections).filter(
    ([, v]) => v !== false && v !== "" && v != null,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review &amp; submit</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm your details. Submitting is a stub — no booking is sent.
        </p>
      </div>

      <dl className="grid gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Service</dt>
          <dd className="font-medium">{service.title}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Quantity</dt>
          <dd>{state.quantity}</dd>
        </div>
        {selectionRows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd>{String(v)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Preferred date</dt>
          <dd>{state.scheduleDates[0] ?? "Flexible"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Time window</dt>
          <dd>{state.timeWindows[0] ?? "anytime"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Contact</dt>
          <dd>
            {state.contact.name || "—"}
            {state.contact.email ? ` · ${state.contact.email}` : ""}
          </dd>
        </div>
      </dl>

      <PriceSummaryCard breakdown={breakdown} sample />
    </div>
  );
}
