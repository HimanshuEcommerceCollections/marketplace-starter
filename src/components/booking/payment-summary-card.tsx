import * as React from "react";
import Image from "next/image";
import { CalendarDays, Clock, MapPin, Sparkles, UserRound } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { formatMoney } from "@/lib/money";
import type { DisplayedPrice, Money } from "@/lib/booking/contract";

export interface PaymentSummaryCardProps {
  service: { title: string; icon?: string; image?: string };
  /** Estimate breakdown, used only to itemize the charge (labels + line amounts). */
  breakdown: DisplayedPrice;
  /** Authoritative amount charged, from the backend PaymentIntent (source of truth). */
  totalLabel: string;
  durationLabel?: string;
  /** Assigned professional, when one is known ("if applicable"). */
  therapistLabel?: string;
  dateLabel?: string;
  timeLabel?: string;
  locationLabel?: string;
  /** Chosen single-select options other than duration, e.g. "Swedish (Relaxation)". */
  sessionLabel?: string;
  /** Joined multi-select add-ons, e.g. "Hot Stones, Aromatherapy Oil". */
  addOns?: string;
}

/** Exact money (e.g. "$109.00"); optional leading "+" for positive deltas. Cents
 *  are kept here (unlike the estimate cards) because this is a real charge. */
function money(m: Money, sign = false): string {
  const s = formatMoney(m);
  return sign && m.amount > 0 ? `+${s}` : s;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        aria-hidden
        strokeWidth={1.75}
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
      />
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}

/**
 * Sticky booking recap shown alongside the Stripe Payment Element. The header
 * media, service identity, appointment details and an itemized price breakdown
 * reassure the customer of exactly what they're paying for. The TOTAL is the
 * backend-decided charge (totalLabel) — never the client estimate — so it always
 * matches the Pay button. Token-only styling. Reusable across brands.
 */
export function PaymentSummaryCard({
  service,
  breakdown,
  totalLabel,
  durationLabel,
  therapistLabel,
  dateLabel,
  timeLabel,
  locationLabel,
  sessionLabel,
  addOns,
}: PaymentSummaryCardProps) {
  const Icon = getIcon(service.icon);
  // Priced lines only (a $0 base — e.g. Beauty — is omitted, as elsewhere).
  const lines = breakdown.line_items.filter((li) => li.amount.amount !== 0);

  return (
    <section
      aria-label="Booking summary"
      className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-md"
    >
      {/* Header media — service photo, or a warm branded tile as a graceful fallback. */}
      <div className="relative aspect-[16/10] w-full">
        {service.image ? (
          <Image
            src={service.image}
            alt=""
            fill
            sizes="(min-width: 64rem) 30vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-brand to-surface-inverse">
            <Icon
              aria-hidden
              strokeWidth={1.25}
              className="size-14 text-surface-inverse-foreground/90"
            />
          </div>
        )}
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Booking Summary
          </p>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {service.title}
          </h2>
          {durationLabel ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
              <Clock aria-hidden strokeWidth={1.75} className="size-3.5" />
              {durationLabel}
            </span>
          ) : null}
        </div>

        {/* Appointment details */}
        <dl className="space-y-3 border-t border-border pt-5">
          {dateLabel ? (
            <DetailRow icon={CalendarDays} label="Date" value={dateLabel} />
          ) : null}
          {timeLabel ? (
            <DetailRow icon={Clock} label="Time" value={timeLabel} />
          ) : null}
          {therapistLabel ? (
            <DetailRow
              icon={UserRound}
              label="Therapist"
              value={therapistLabel}
            />
          ) : null}
          {locationLabel ? (
            <DetailRow icon={MapPin} label="Location" value={locationLabel} />
          ) : null}
          {sessionLabel || addOns ? (
            <DetailRow
              icon={Sparkles}
              label="Selected options"
              value={[sessionLabel, addOns].filter(Boolean).join(" · ")}
            />
          ) : null}
        </dl>

        {/* Price breakdown */}
        <dl className="space-y-3 border-t border-border pt-5 text-sm">
          {lines.map((li, i) => (
            <div
              key={`${li.label}-${i}`}
              className="flex items-baseline justify-between gap-4"
            >
              <dt className="text-muted-foreground">
                {li.kind === "base" ? sessionLabel || "Session" : li.label}
              </dt>
              <dd className="font-medium text-foreground">
                {money(li.amount, li.kind !== "base")}
              </dd>
            </div>
          ))}
        </dl>

        {/* Total — the authoritative amount to be charged (matches the Pay button). */}
        <div className="border-t border-border pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm font-semibold text-foreground">
              Total due today
            </span>
            <span className="font-heading text-2xl font-semibold text-highlight">
              {totalLabel}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Taxes included where applicable. Charged once in a single payment.
          </p>
        </div>
      </div>
    </section>
  );
}
