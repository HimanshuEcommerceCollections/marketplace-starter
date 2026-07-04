"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { StatusDot } from "@/components/admin/status-pill";
import type { AdminBooking } from "@/lib/admin/types";

export interface PendingReviewTableProps {
  bookings: AdminBooking[];
  /** When provided, each row gets working Confirm/Reject actions (id = booking id). */
  onConfirm?: (id: string) => void;
  onReject?: (id: string) => void;
  busyId?: string;
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
          {row.reference ?? row.id}
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

/** Pending-review queue. Confirm/Reject are wired only when handlers are passed. */
export function PendingReviewTable({
  bookings,
  onConfirm,
  onReject,
  busyId,
}: PendingReviewTableProps) {
  const interactive = Boolean(onConfirm || onReject);
  return (
    <AdminTable
      caption="Bookings awaiting confirmation"
      columns={columns}
      rows={bookings}
      getRowId={(row) => row.id}
      emptyMessage="No bookings are awaiting review."
      rowActions={
        interactive
          ? (row) => (
              <>
                <Button
                  type="button"
                  size="sm"
                  disabled={busyId === row.id}
                  className="bg-success text-success-foreground hover:bg-success/90"
                  onClick={() => onConfirm?.(row.id)}
                >
                  Confirm
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busyId === row.id}
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => onReject?.(row.id)}
                >
                  Reject
                </Button>
              </>
            )
          : undefined
      }
    />
  );
}
