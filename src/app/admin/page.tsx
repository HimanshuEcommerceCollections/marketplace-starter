"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { KpiGrid } from "@/components/admin/overview/kpi-grid";
import { SectionHeading } from "@/components/admin/overview/section-heading";
import { PendingReviewTable } from "@/components/admin/overview/pending-review-table";
import { ActiveBookingsTable } from "@/components/admin/overview/active-bookings-table";
import { ServicesOverviewGrid } from "@/components/admin/overview/services-overview-grid";
import { RecentInquiries } from "@/components/admin/overview/recent-inquiries";
import {
  listBookings,
  setBookingStatus,
  toAdminStatus,
  toAdminBooking,
  type AdminBookingRow,
} from "@/lib/admin/bookings";
import { BookingApiError } from "@/lib/booking/api";
import {
  listCorporateInquiries,
  type CorporateInquiryRow,
} from "@/lib/corporate/api";
import {
  DASHBOARD_SUBTITLE,
  KPIS,
  SERVICES_OVERVIEW,
  TODAY_LABEL,
} from "@/lib/admin/sample-data";

/**
 * Admin Overview / Dashboard. The Pending Review + Active Bookings tables are
 * live (server data via the bookings API); the KPI tiles + Services Overview
 * remain illustrative placeholders for now.
 */
export default function AdminOverviewPage() {
  const [bookings, setBookings] = React.useState<AdminBookingRow[] | null>(null);
  const [inquiries, setInquiries] = React.useState<CorporateInquiryRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [busyId, setBusyId] = React.useState<string | undefined>();

  const load = React.useCallback(async () => {
    setError(null);
    // Load both in parallel; an inquiries failure must not blank the bookings.
    const [bk, inq] = await Promise.allSettled([
      listBookings({ limit: 100 }),
      listCorporateInquiries({ limit: 100 }),
    ]);
    if (bk.status === "fulfilled") {
      setBookings(bk.value.items);
    } else {
      const err = bk.reason;
      setError(err instanceof BookingApiError ? err.message : "Failed to load bookings.");
      setBookings([]);
    }
    setInquiries(inq.status === "fulfilled" ? inq.value.items : []);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function moderate(id: string, status: "CONFIRMED" | "CANCELLED") {
    setBusyId(id);
    setError(null);
    try {
      const updated = await setBookingStatus(id, status);
      setBookings((bs) => bs?.map((b) => (b.id === updated.id ? updated : b)) ?? null);
    } catch (err) {
      setError(err instanceof BookingApiError ? err.message : "Could not update the booking.");
    } finally {
      setBusyId(undefined);
    }
  }

  const pending = (bookings ?? [])
    .filter((b) => toAdminStatus(b.status) === "pending")
    .map(toAdminBooking);
  const active = (bookings ?? [])
    .filter((b) => toAdminStatus(b.status) === "active")
    .map(toAdminBooking);

  return (
    <>
      <AdminTopbar searchPlaceholder="Search bookings, clients..." date={TODAY_LABEL} />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader title="Dashboard" subtitle={DASHBOARD_SUBTITLE} />

        <KpiGrid kpis={KPIS} />

        {error ? (
          <Card className="mt-6 flex items-center gap-2 px-4 py-3 text-sm text-destructive">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            {error}
          </Card>
        ) : null}

        <section className="mt-8">
          <SectionHeading
            title="Pending Review"
            count={pending.length}
            subtitle="These bookings need your confirmation before they can proceed."
          />
          <PendingReviewTable
            bookings={pending}
            busyId={busyId}
            onConfirm={(id) => void moderate(id, "CONFIRMED")}
            onReject={(id) => void moderate(id, "CANCELLED")}
          />
        </section>

        <section className="mt-8">
          <SectionHeading title={`Active Bookings — ${active.length} in progress`} />
          <ActiveBookingsTable bookings={active} />
        </section>

        <section className="mt-8">
          <RecentInquiries inquiries={inquiries} />
        </section>

        <section className="mt-8">
          <SectionHeading title="Services Overview" />
          <ServicesOverviewGrid items={SERVICES_OVERVIEW} />
        </section>
      </div>
    </>
  );
}
