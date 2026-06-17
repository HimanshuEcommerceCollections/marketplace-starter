"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/shared/sample-badge";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SampleNotice } from "@/components/admin/sample-notice";
import { StatusDot } from "@/components/admin/status-pill";
import { MasterDetail } from "@/components/admin/master-detail";
import {
  AdminTable,
  type AdminColumn,
} from "@/components/admin/admin-table";
import { ALL_BOOKINGS } from "@/lib/admin/sample-data";
import type { AdminBooking, BookingStatus } from "@/lib/admin/types";
import {
  BookingTabs,
  type BookingTab,
} from "@/components/admin/bookings/booking-tabs";
import { BookingDetailPanel } from "@/components/admin/bookings/booking-detail-panel";

const STATUSES: BookingStatus[] = [
  "pending",
  "active",
  "completed",
  "cancelled",
];

function buildCounts(): Record<BookingTab, number> {
  const counts = {
    all: ALL_BOOKINGS.length,
    pending: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
  } as Record<BookingTab, number>;
  for (const status of STATUSES) {
    counts[status] = ALL_BOOKINGS.filter((b) => b.status === status).length;
  }
  return counts;
}

const COUNTS = buildCounts();

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = React.useState<BookingTab>("all");
  const [selectedId, setSelectedId] = React.useState<string | undefined>();

  const rows = React.useMemo(
    () =>
      activeTab === "all"
        ? ALL_BOOKINGS
        : ALL_BOOKINGS.filter((b) => b.status === activeTab),
    [activeTab],
  );

  const selected = React.useMemo(
    () => ALL_BOOKINGS.find((b) => b.id === selectedId),
    [selectedId],
  );

  const columns: AdminColumn<AdminBooking>[] = [
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <span className="inline-flex items-center">
          <StatusDot status={row.status} />
        </span>
      ),
    },
    {
      key: "id",
      header: "ID",
      cell: (row) => <span className="text-muted-foreground">{row.id}</span>,
      mobileHidden: true,
    },
    {
      key: "client",
      header: "Client",
      primary: true,
      cell: (row) => row.client,
    },
    {
      key: "service",
      header: "Service",
      cell: (row) => row.service,
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => row.date,
    },
    {
      key: "total",
      header: (
        <span className="inline-flex items-center gap-1.5">
          Total <SampleBadge />
        </span>
      ),
      align: "right",
      cell: (row) => (
        <span className="font-medium text-foreground">{row.total}</span>
      ),
    },
  ];

  const list = (
    <AdminTable<AdminBooking>
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      selectedId={selectedId}
      onRowSelect={(row) => setSelectedId(row.id)}
      caption="Bookings"
      emptyMessage="No bookings in this view."
      actionsHeader="Actions"
      rowActions={(row) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSelectedId(row.id)}
        >
          Details
        </Button>
      )}
    />
  );

  const emptyState = (
    <Card className="flex items-center justify-center px-6 py-16 text-center text-sm text-muted-foreground">
      Select a booking to view its details.
    </Card>
  );

  return (
    <>
      <AdminTopbar
        searchPlaceholder="Search by client, ID, or service..."
        action={
          <Button type="button" size="sm">
            <Plus aria-hidden />
            New Booking
          </Button>
        }
      />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader title="Bookings" />
        <SampleNotice className="mb-6" />

        <div className="mb-4">
          <BookingTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={COUNTS}
          />
        </div>

        <MasterDetail
          list={list}
          detail={selected ? <BookingDetailPanel booking={selected} /> : null}
          detailOpen={Boolean(selected)}
          onClose={() => setSelectedId(undefined)}
          emptyState={emptyState}
          detailLabel="Booking details"
        />
      </div>
    </>
  );
}
