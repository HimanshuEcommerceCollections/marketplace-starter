"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/shared/sample-badge";
import { StatusPill } from "@/components/admin/status-pill";
import type { AdminBooking } from "@/lib/admin/types";

export interface BookingDetailPanelProps {
  booking: AdminBooking;
}

/** Read-style labeled field built from an editable-looking Input. Stub only. */
function Field({
  label,
  value,
  hint,
  htmlFor,
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <Input id={htmlFor} defaultValue={value} className="bg-card" />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/**
 * Editable-looking detail panel for a single booking. Header band uses the
 * primary treatment; the body presents the booking fields as stub inputs plus
 * an internal-notes textarea and the moderation/management actions. All
 * controls are stub (type="button", no backend wiring).
 */
export function BookingDetailPanel({ booking }: BookingDetailPanelProps) {
  return (
    <Card className="overflow-hidden p-0">
      {/* Header band */}
      <div className="flex items-start justify-between gap-3 bg-primary px-5 py-4 text-primary-foreground">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
            {booking.id}
          </p>
          <h2 className="mt-1 font-heading text-lg font-semibold leading-tight">
            {booking.service} · {booking.client}
          </h2>
        </div>
        <div className="shrink-0">
          <StatusPill status={booking.status} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Booking details — editable
        </p>

        <Field
          label="Service"
          htmlFor="detail-service"
          value={booking.serviceDetail ?? booking.service}
        />
        <Field
          label="Client"
          htmlFor="detail-client"
          value={
            booking.clientFullName
              ? `${booking.clientFullName}${booking.clientEmail ? ` · ${booking.clientEmail}` : ""}`
              : booking.client
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date" htmlFor="detail-date" value={booking.date} />
          <Field
            label="Time"
            htmlFor="detail-time"
            value={booking.time ?? "To be confirmed"}
          />
        </div>

        <Field
          label="Professional"
          htmlFor="detail-pro"
          value={booking.professional}
          hint={booking.professionalMatched ? "(matched)" : undefined}
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label
              htmlFor="detail-price"
              className="text-xs uppercase tracking-wide text-muted-foreground"
            >
              Price override
            </Label>
            <SampleBadge />
          </div>
          <Input
            id="detail-price"
            defaultValue={booking.priceOverride ?? booking.total}
            className="bg-card"
          />
        </div>

        <Field
          label="Location"
          htmlFor="detail-location"
          value={booking.location ?? "Not specified"}
        />

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="detail-notes"
            className="text-xs uppercase tracking-wide text-muted-foreground"
          >
            Internal notes
          </Label>
          <Textarea
            id="detail-notes"
            placeholder="Add a note for the coordination team…"
            className="bg-card"
          />
        </div>

        {/* Primary moderation actions */}
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            className="flex-1 bg-success text-success-foreground hover:bg-success/90"
          >
            Confirm Booking
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
          >
            Reject Booking
          </Button>
        </div>

        {/* Secondary management actions */}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm">
            Reschedule
          </Button>
          <Button type="button" variant="outline" size="sm">
            Message Client
          </Button>
          <Button type="button" variant="secondary" size="sm">
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}
