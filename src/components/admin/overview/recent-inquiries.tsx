"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { inquiryStatusBadge } from "@/lib/admin/corporate-inquiries";
import type { CorporateInquiryRow } from "@/lib/corporate/api";
import { formatBookingShortDate } from "@/lib/booking/format";

export interface RecentInquiriesProps {
  /** All loaded inquiries (already newest-first from the server). */
  inquiries: CorporateInquiryRow[];
  /** How many recent rows to show. */
  limit?: number;
}

/**
 * Overview-dashboard snippet: the most recent corporate inquiries with a "new"
 * count badge and a link to the full /admin/corporate-inquiries section.
 */
export function RecentInquiries({ inquiries, limit = 5 }: RecentInquiriesProps) {
  const newCount = inquiries.filter((i) => i.status === "NEW").length;
  const rows = inquiries.slice(0, limit);

  const columns: AdminColumn<CorporateInquiryRow>[] = [
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const b = inquiryStatusBadge(row.status);
        return <Badge variant={b.variant}>{b.label}</Badge>;
      },
    },
    {
      key: "company",
      header: "Company",
      primary: true,
      cell: (row) => row.company,
    },
    {
      key: "contact",
      header: "Contact",
      mobileHidden: true,
      cell: (row) => (
        <span className="flex flex-col">
          <span className="text-foreground">{row.contactName}</span>
          <span className="text-xs text-muted-foreground">
            {row.contactEmail}
          </span>
        </span>
      ),
    },
    {
      key: "format",
      header: "Format",
      mobileHidden: true,
      cell: (row) => row.eventType,
    },
    {
      key: "received",
      header: "Received",
      align: "right",
      cell: (row) => formatBookingShortDate(row.createdAt),
    },
  ];

  return (
    <>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Corporate Inquiries
            </h2>
            {newCount > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-warning px-2 py-0.5 text-xs font-semibold text-warning-foreground">
                {newCount} new
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Proposal requests from the Corporate page.
          </p>
        </div>
        <Link
          href="/admin/corporate-inquiries"
          className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View all
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <AdminTable<CorporateInquiryRow>
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        caption="Recent corporate inquiries"
        emptyMessage="No inquiries yet."
      />
    </>
  );
}
