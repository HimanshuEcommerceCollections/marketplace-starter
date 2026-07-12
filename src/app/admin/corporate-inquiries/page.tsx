"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MasterDetail } from "@/components/admin/master-detail";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { InquiryDetailPanel } from "@/components/admin/corporate-inquiries/inquiry-detail-panel";
import {
  listCorporateInquiries,
  CorporateInquiryApiError,
  type CorporateInquiryRow,
  type CorporateInquiryStatusValue,
} from "@/lib/corporate/api";
import {
  INQUIRY_STATUSES,
  inquiryStatusBadge,
} from "@/lib/admin/corporate-inquiries";
import { formatBookingShortDate } from "@/lib/booking/format";

type Filter = "ALL" | CorporateInquiryStatusValue;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All" },
  ...INQUIRY_STATUSES.map((s) => ({
    key: s,
    label: inquiryStatusBadge(s).label,
  })),
];

export default function AdminCorporateInquiriesPage() {
  const [inquiries, setInquiries] = React.useState<
    CorporateInquiryRow[] | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<Filter>("ALL");
  const [selectedId, setSelectedId] = React.useState<string | undefined>();

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const { items } = await listCorporateInquiries({ limit: 100 });
      setInquiries(items);
    } catch (err) {
      setError(
        err instanceof CorporateInquiryApiError
          ? err.message
          : "Failed to load inquiries.",
      );
      setInquiries([]);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const counts = React.useMemo(() => {
    const c: Record<Filter, number> = {
      ALL: 0,
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      CLOSED: 0,
    };
    for (const i of inquiries ?? []) {
      c.ALL += 1;
      c[i.status] += 1;
    }
    return c;
  }, [inquiries]);

  const rows = React.useMemo(
    () =>
      (inquiries ?? []).filter((i) => filter === "ALL" || i.status === filter),
    [inquiries, filter],
  );

  const selected = React.useMemo(
    () => (inquiries ?? []).find((i) => i.id === selectedId),
    [inquiries, selectedId],
  );

  const onChanged = (updated: CorporateInquiryRow) =>
    setInquiries(
      (list) => list?.map((i) => (i.id === updated.id ? updated : i)) ?? null,
    );

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
      cell: (row) => (
        <span className="flex flex-col">
          <span className="text-foreground">{row.contactName}</span>
          <span className="text-xs text-muted-foreground">
            {row.contactEmail}
          </span>
        </span>
      ),
    },
    { key: "format", header: "Format", cell: (row) => row.eventType },
    {
      key: "team",
      header: "Team size",
      cell: (row) => row.headcount ?? "—",
      mobileHidden: true,
    },
    {
      key: "received",
      header: "Received",
      align: "right",
      cell: (row) => formatBookingShortDate(row.createdAt),
    },
  ];

  const list = (
    <AdminTable<CorporateInquiryRow>
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      selectedId={selectedId}
      onRowSelect={(row) => setSelectedId(row.id)}
      caption="Corporate inquiries"
      emptyMessage="No inquiries in this view."
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

  return (
    <>
      <AdminTopbar searchPlaceholder="Search inquiries..." />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader title="Corporate Inquiries" />

        {error ? (
          <Card className="mb-6 flex items-center gap-2 px-4 py-3 text-sm text-destructive">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            {error}
          </Card>
        ) : null}

        <div
          className="mb-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by status"
        >
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              type="button"
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">
                {counts[f.key]}
              </span>
            </Button>
          ))}
        </div>

        {inquiries === null && !error ? (
          <Card className="h-48 animate-pulse bg-muted/60" />
        ) : (
          <MasterDetail
            list={list}
            detail={
              selected ? (
                <InquiryDetailPanel inquiry={selected} onChanged={onChanged} />
              ) : null
            }
            detailOpen={Boolean(selected)}
            onClose={() => setSelectedId(undefined)}
            emptyState={
              <Card className="flex items-center justify-center px-6 py-16 text-center text-sm text-muted-foreground">
                Select an inquiry to view its details.
              </Card>
            }
            detailLabel="Inquiry details"
          />
        )}
      </div>
    </>
  );
}
