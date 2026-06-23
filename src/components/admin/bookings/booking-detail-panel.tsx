"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/shared/sample-badge";
import { StatusPill } from "@/components/admin/status-pill";
import {
  setBookingStatus,
  toAdminStatus,
  type AdminBookingRow,
} from "@/lib/admin/bookings";
import { BookingApiError } from "@/lib/booking/api";
import { formatBookingDate, formatBookingTimeRange } from "@/lib/booking/format";
import { formatMoney } from "@/lib/money";

export interface BookingDetailPanelProps {
  booking: AdminBookingRow;
  onChanged: (updated: AdminBookingRow) => void;
}

function Row({
  label,
  value,
  sample,
}: {
  label: string;
  value: React.ReactNode;
  sample?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
        {sample ? <SampleBadge /> : null}
      </dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

const TERMINAL = ["COMPLETED", "CANCELLED", "NO_SHOW"];

/**
 * Live booking detail for staff. Read-only fields + status moderation wired to
 * the API (Confirm → CONFIRMED, Reject → CANCELLED). Reschedule/messaging are
 * not modelled server-side, so they're intentionally omitted.
 */
export function BookingDetailPanel({ booking, onChanged }: BookingDetailPanelProps) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const options = (booking.selections ?? []).map((s) => s.optionLabel).filter(Boolean);
  const canModerate = !TERMINAL.includes(booking.status);

  async function moderate(status: "CONFIRMED" | "CANCELLED") {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      onChanged(await setBookingStatus(booking.id, status));
    } catch (err) {
      setError(err instanceof BookingApiError ? err.message : "Could not update the booking.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-start justify-between gap-3 bg-primary px-5 py-4 text-primary-foreground">
        <div className="min-w-0">
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
            {booking.reference}
          </p>
          <h2 className="mt-1 font-heading text-lg font-semibold leading-tight">
            {booking.serviceName} · {booking.customerName}
          </h2>
        </div>
        <div className="shrink-0">
          <StatusPill status={toAdminStatus(booking.status)} />
        </div>
      </div>

      <dl className="divide-y divide-border">
        <Row label="Service" value={booking.serviceName} />
        <Row
          label="Client"
          value={
            <span className="flex flex-col items-end">
              <span>{booking.customerName}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {booking.customerEmail}
              </span>
            </span>
          }
        />
        <Row label="Date" value={formatBookingDate(booking.scheduledDate)} />
        <Row label="Time" value={formatBookingTimeRange(booking.scheduledStart, booking.scheduledEnd)} />
        <Row label="Professional" value={booking.providerName ?? "Unassigned"} />
        <Row
          label="Total"
          sample
          value={formatMoney({ amount: booking.priceAmount, currency: booking.currency })}
        />
        {options.length > 0 ? <Row label="Options" value={options.join(" · ")} /> : null}
        <Row label="Location" value={booking.locationMode.toLowerCase()} />
        {booking.contactPhone ? <Row label="Phone" value={booking.contactPhone} /> : null}
        {booking.address ? <Row label="Address" value={booking.address} /> : null}
        {booking.notes ? (
          <Row label="Notes" value={<span className="font-normal">{booking.notes}</span>} />
        ) : null}
      </dl>

      <div className="flex flex-col gap-3 p-5">
        {error ? (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        {canModerate ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              disabled={busy}
              className="flex-1 bg-success text-success-foreground hover:bg-success/90"
              onClick={() => void moderate("CONFIRMED")}
            >
              {busy ? "Working…" : "Confirm Booking"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => void moderate("CANCELLED")}
            >
              Reject Booking
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            This booking is {toAdminStatus(booking.status)} — no further action available.
          </p>
        )}
      </div>
    </Card>
  );
}
