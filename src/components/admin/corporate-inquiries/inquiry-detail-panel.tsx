"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  setCorporateInquiryStatus,
  CorporateInquiryApiError,
  type CorporateInquiryRow,
} from "@/lib/corporate/api";
import {
  INQUIRY_STATUSES,
  inquiryStatusBadge,
  inquiryTransitionLabel,
} from "@/lib/admin/corporate-inquiries";
import { formatBookingWhen } from "@/lib/booking/format";

export interface InquiryDetailPanelProps {
  inquiry: CorporateInquiryRow;
  onChanged: (updated: CorporateInquiryRow) => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

/**
 * Live corporate-inquiry detail for staff. Read-only contact/company fields plus
 * status triage wired to the API — each button moves the lead to another status.
 */
export function InquiryDetailPanel({
  inquiry,
  onChanged,
}: InquiryDetailPanelProps) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const badge = inquiryStatusBadge(inquiry.status);
  const targets = INQUIRY_STATUSES.filter((s) => s !== inquiry.status);

  async function moveTo(status: CorporateInquiryRow["status"]) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      onChanged(await setCorporateInquiryStatus(inquiry.id, status));
    } catch (err) {
      setError(
        err instanceof CorporateInquiryApiError
          ? err.message
          : "Could not update the inquiry.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-start justify-between gap-3 bg-primary px-5 py-4 text-primary-foreground">
        <div className="min-w-0">
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
            {inquiry.eventType}
          </p>
          <h2 className="mt-1 font-heading text-lg font-semibold leading-tight">
            {inquiry.company}
          </h2>
        </div>
        <div className="shrink-0">
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </div>

      <dl className="divide-y divide-border">
        <Row label="Company" value={inquiry.company} />
        <Row
          label="Contact"
          value={
            <span className="flex flex-col items-end">
              <span>{inquiry.contactName}</span>
              <a
                href={`mailto:${inquiry.contactEmail}`}
                className="text-xs font-normal text-muted-foreground underline-offset-2 hover:underline"
              >
                {inquiry.contactEmail}
              </a>
            </span>
          }
        />
        {inquiry.contactPhone ? (
          <Row label="Phone" value={inquiry.contactPhone} />
        ) : null}
        {inquiry.headcount ? (
          <Row label="Team size" value={inquiry.headcount} />
        ) : null}
        <Row label="Format" value={inquiry.eventType} />
        {inquiry.preferredDate ? (
          <Row label="Preferred date" value={inquiry.preferredDate} />
        ) : null}
        <Row label="Received" value={formatBookingWhen(inquiry.createdAt)} />
        {inquiry.notes ? (
          <Row
            label="Notes"
            value={
              <span className="whitespace-pre-line font-normal">
                {inquiry.notes}
              </span>
            }
          />
        ) : null}
      </dl>

      <div className="flex flex-col gap-3 p-5">
        {error ? (
          <p
            role="alert"
            className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Update status
        </p>
        <div className="flex flex-wrap gap-2">
          {targets.map((status) => (
            <Button
              key={status}
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => void moveTo(status)}
            >
              {busy ? "Working…" : inquiryTransitionLabel(status)}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
