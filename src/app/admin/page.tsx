"use client";

import * as React from "react";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SampleNotice } from "@/components/admin/sample-notice";
import { KpiGrid } from "@/components/admin/overview/kpi-grid";
import { SectionHeading } from "@/components/admin/overview/section-heading";
import { PendingReviewTable } from "@/components/admin/overview/pending-review-table";
import { ActiveBookingsTable } from "@/components/admin/overview/active-bookings-table";
import { ServicesOverviewGrid } from "@/components/admin/overview/services-overview-grid";
import {
  ACTIVE_BOOKINGS,
  DASHBOARD_SUBTITLE,
  KPIS,
  PENDING_BOOKINGS,
  SERVICES_OVERVIEW,
  TODAY_LABEL,
} from "@/lib/admin/sample-data";

/**
 * Admin Overview / Dashboard. Wrapped by the admin route group's AdminShell
 * (sidebar + drawer + draft banner + footer), so this composes only the topbar,
 * page header, sample notice, and the dashboard content blocks.
 */
export default function AdminOverviewPage() {
  return (
    <>
      <AdminTopbar
        searchPlaceholder="Search bookings, clients..."
        date={TODAY_LABEL}
      />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader title="Dashboard" subtitle={DASHBOARD_SUBTITLE} />
        <SampleNotice className="mb-6" />

        <KpiGrid kpis={KPIS} />

        <section className="mt-8">
          <SectionHeading
            title="Pending Review"
            count={PENDING_BOOKINGS.length}
            subtitle="These bookings need your confirmation before they can proceed."
          />
          <PendingReviewTable bookings={PENDING_BOOKINGS} />
        </section>

        <section className="mt-8">
          <SectionHeading
            title={`Active Bookings — ${ACTIVE_BOOKINGS.length} in progress`}
          />
          <ActiveBookingsTable bookings={ACTIVE_BOOKINGS} />
        </section>

        <section className="mt-8">
          <SectionHeading title="Services Overview" />
          <ServicesOverviewGrid items={SERVICES_OVERVIEW} />
        </section>
      </div>
    </>
  );
}
