"use client";

import * as React from "react";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { StatusDot } from "@/components/admin/status-pill";
import type { AdminBooking } from "@/lib/admin/types";

export interface ActiveBookingsTableProps {
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
    key: "stage",
    header: "Coordinator Stage",
    cell: (row) =>
      row.stage ? (
        <span className="font-medium text-primary">{row.stage}</span>
      ) : (
        "—"
      ),
  },
  {
    key: "professional",
    header: "Professional",
    cell: (row) => row.professional,
  },
  {
    key: "date",
    header: "Date",
    cell: (row) => row.date,
  },
];

/** Read-only view of bookings currently in progress (no row actions). */
export function ActiveBookingsTable({ bookings }: ActiveBookingsTableProps) {
  return (
    <AdminTable
      caption="Active bookings in progress"
      columns={columns}
      rows={bookings}
      getRowId={(row) => row.id}
      emptyMessage="No active bookings right now."
    />
  );
}
