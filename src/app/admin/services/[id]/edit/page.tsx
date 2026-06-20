"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/services/service-form";
import { ServiceStatusControl } from "@/components/admin/services/service-status-control";
import { getService, ServiceApiError } from "@/lib/admin/services";
import type { AdminService } from "@/lib/admin/types";

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [service, setService] = React.useState<AdminService | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getService(id)
      .then((c) => {
        if (active) setService(c);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ServiceApiError ? err.message : "Failed to load service.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href={`/admin/services/${id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to service
      </Link>
      <AdminPageHeader
        title="Edit service"
        subtitle="Update the service details, or change its published status."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        {loading ? (
          <Card className="h-72 animate-pulse bg-muted/60" />
        ) : error || !service ? (
          <Card className="flex items-center gap-2 px-4 py-8 text-sm text-destructive">
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            {error ?? "Service not found."}
          </Card>
        ) : (
          <>
            <ServiceForm mode="edit" initial={service} />
            <ServiceStatusControl service={service} onChanged={setService} />
          </>
        )}
      </div>
    </div>
  );
}
