"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/shared/sample-badge";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { StatusDot } from "@/components/admin/status-pill";
import type { AdminBooking } from "@/lib/admin/types";

export interface PendingReviewTableProps {
  bookings: AdminBooking[];
}

const columns: AdminColumn<AdminBooking>[] = [
  {
    key: "booking",
    header: "Booking",
    primary: true,
    cell: (row) => (
      <span className="inline-flex items-center gap-2">
        <StatusDot status={row.status} />
        <span className="font-mono text-xs text-muted-foreground">
          {row.id}
        </span>
      </span>
    ),
  },
  {
    key: "client",
    header: "Client",
    cell: (row) => <span className="font-medium text-foreground">{row.client}</span>,
  },
  {
    key: "service",
    header: "Service",
    cell: (row) => row.service,
  },
  {
    key: "datetime",
    header: "Date & Time",
    cell: (row) => (
      <span>
        {row.date}
        {row.time ? ` · ${row.time}` : ""}
      </span>
    ),
  },
  {
    key: "total",
    header: (
      <span className="inline-flex items-center justify-end gap-1.5">
        Total
        <SampleBadge />
      </span>
    ),
    align: "right",
    cell: (row) => (
      <span className="font-medium text-foreground">{row.total}</span>
    ),
  },
  {
    key: "professional",
    header: "Professional",
    cell: (row) => row.professional,
  },
];

/** Pending-review queue: each row offers stub Confirm / Reject actions. */
export function PendingReviewTable({ bookings }: PendingReviewTableProps) {
  return (
    <AdminTable
      caption="Bookings awaiting confirmation"
      columns={columns}
      rows={bookings}
      getRowId={(row) => row.id}
      emptyMessage="No bookings are awaiting review."
      rowActions={() => (
        <>
          <Button
            type="button"
            size="sm"
            className="bg-success text-success-foreground hover:bg-success/90"
          >
            Confirm
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            Reject
          </Button>
        </>
      )}
    />
  );
}
