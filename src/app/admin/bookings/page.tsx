"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusDot } from "@/components/admin/status-pill";
import { MasterDetail } from "@/components/admin/master-detail";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import {
  BookingTabs,
  type BookingTab,
} from "@/components/admin/bookings/booking-tabs";
import { BookingDetailPanel } from "@/components/admin/bookings/booking-detail-panel";
import {
  listBookings,
  toAdminStatus,
  type AdminBookingRow,
} from "@/lib/admin/bookings";
import { BookingApiError } from "@/lib/booking/api";
import { formatBookingShortDate } from "@/lib/booking/format";
import { formatMoney } from "@/lib/money";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = React.useState<AdminBookingRow[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<BookingTab>("all");
  const [selectedId, setSelectedId] = React.useState<string | undefined>();

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const { items } = await listBookings({ limit: 100 });
      setBookings(items);
    } catch (err) {
      setError(err instanceof BookingApiError ? err.message : "Failed to load bookings.");
      setBookings([]);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const counts = React.useMemo(() => {
    const c = { all: 0, pending: 0, active: 0, completed: 0, cancelled: 0 } as Record<
      BookingTab,
      number
    >;
    for (const b of bookings ?? []) {
      c.all += 1;
      c[toAdminStatus(b.status)] += 1;
    }
    return c;
  }, [bookings]);

  const rows = React.useMemo(
    () =>
      (bookings ?? []).filter(
        (b) => activeTab === "all" || toAdminStatus(b.status) === activeTab,
      ),
    [bookings, activeTab],
  );

  const selected = React.useMemo(
    () => (bookings ?? []).find((b) => b.id === selectedId),
    [bookings, selectedId],
  );

  const onChanged = (updated: AdminBookingRow) =>
    setBookings((bs) => bs?.map((b) => (b.id === updated.id ? updated : b)) ?? null);

  const columns: AdminColumn<AdminBookingRow>[] = [
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusDot status={toAdminStatus(row.status)} />,
    },
    {
      key: "id",
      header: "Ref",
      cell: (row) => <span className="font-mono text-xs text-muted-foreground">{row.reference}</span>,
      mobileHidden: true,
    },
    { key: "client", header: "Client", primary: true, cell: (row) => row.customerName },
    { key: "service", header: "Service", cell: (row) => row.serviceName },
    { key: "date", header: "Date", cell: (row) => formatBookingShortDate(row.scheduledStart) },
    {
      key: "total",
      header: (
        <span className="inline-flex items-center gap-1.5">
          Total
        </span>
      ),
      align: "right",
      cell: (row) => (
        <span className="font-medium text-foreground">
          {formatMoney({ amount: row.priceAmount, currency: row.currency })}
        </span>
      ),
    },
  ];

  const list = (
    <AdminTable<AdminBookingRow>
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      selectedId={selectedId}
      onRowSelect={(row) => setSelectedId(row.id)}
      caption="Bookings"
      emptyMessage="No bookings in this view."
      actionsHeader="Actions"
      rowActions={(row) => (
        <Button type="button" variant="outline" size="sm" onClick={() => setSelectedId(row.id)}>
          Details
        </Button>
      )}
    />
  );

  return (
    <>
      <AdminTopbar searchPlaceholder="Search by client, ref, or service..." />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader title="Bookings" />

        {error ? (
          <Card className="mb-6 flex items-center gap-2 px-4 py-3 text-sm text-destructive">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            {error}
          </Card>
        ) : null}

        <div className="mb-4">
          <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
        </div>

        {bookings === null && !error ? (
          <Card className="h-48 animate-pulse bg-muted/60" />
        ) : (
          <MasterDetail
            list={list}
            detail={selected ? <BookingDetailPanel booking={selected} onChanged={onChanged} /> : null}
            detailOpen={Boolean(selected)}
            onClose={() => setSelectedId(undefined)}
            emptyState={
              <Card className="flex items-center justify-center px-6 py-16 text-center text-sm text-muted-foreground">
                Select a booking to view its details.
              </Card>
            }
            detailLabel="Booking details"
          />
        )}
      </div>
    </>
  );
}
