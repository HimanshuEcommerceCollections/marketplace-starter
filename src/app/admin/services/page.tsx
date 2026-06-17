"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/shared/sample-badge";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SampleNotice } from "@/components/admin/sample-notice";
import { ServiceStatusPill } from "@/components/admin/status-pill";
import {
  AdminTable,
  type AdminColumn,
} from "@/components/admin/admin-table";
import { MasterDetail } from "@/components/admin/master-detail";
import { ADMIN_SERVICES } from "@/lib/admin/sample-data";
import type { AdminService } from "@/lib/admin/types";
import { ServiceEditPanel } from "@/components/admin/services/service-edit-panel";

export default function AdminServicesPage() {
  const [selectedId, setSelectedId] = React.useState<string | undefined>(
    undefined,
  );
  const selected = ADMIN_SERVICES.find((s) => s.id === selectedId);

  const columns: AdminColumn<AdminService>[] = [
    {
      key: "name",
      header: "Service",
      primary: true,
      cell: (row) => row.name,
    },
    {
      key: "category",
      header: "Category",
      cell: (row) => row.category,
    },
    {
      key: "basePrice",
      header: (
        <span className="inline-flex items-center gap-2">
          Base Price
          <SampleBadge />
        </span>
      ),
      cell: (row) => (
        <span className="font-medium text-foreground">{row.basePrice}</span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      cell: (row) => row.duration,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <ServiceStatusPill status={row.status} />,
    },
  ];

  return (
    <>
      <AdminTopbar
        searchPlaceholder="Search services..."
        action={
          <Button type="button" size="sm">
            <Plus aria-hidden />
            Add Service
          </Button>
        }
      />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AdminPageHeader
          title="Services & Pricing"
          subtitle="Manage service offerings, base pricing, duration, and availability"
        />
        <SampleNotice className="mb-6" />

        <MasterDetail
          detailOpen={Boolean(selected)}
          onClose={() => setSelectedId(undefined)}
          detailLabel="Edit service"
          emptyState={
            <Card className="flex items-center justify-center p-8 text-center text-sm text-muted-foreground">
              Select a service to edit.
            </Card>
          }
          list={
            <AdminTable
              columns={columns}
              rows={ADMIN_SERVICES}
              getRowId={(row) => row.id}
              selectedId={selectedId}
              onRowSelect={(row) => setSelectedId(row.id)}
              caption="Services and pricing"
              emptyMessage="No services to show."
              rowActions={(row) => (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedId(row.id)}
                >
                  Edit
                </Button>
              )}
            />
          }
          detail={
            selected ? (
              <ServiceEditPanel key={selected.id} service={selected} />
            ) : null
          }
        />
      </div>
    </>
  );
}
