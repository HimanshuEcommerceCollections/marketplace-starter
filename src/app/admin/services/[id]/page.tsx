"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceStatusPill } from "@/components/admin/status-pill";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ServiceStatusControl } from "@/components/admin/services/service-status-control";
import { ServiceAssetsPanel } from "@/components/admin/services/service-assets-panel";
import { ServiceConfigPanel } from "@/components/admin/services/service-config-panel";
import { ServicePricingPreview } from "@/components/admin/services/service-pricing-preview";
import { getService, ServiceApiError } from "@/lib/admin/services";
import type { AdminService } from "@/lib/admin/types";
import { formatDate, formatCents } from "@/lib/admin/format";

export default function ServiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [service, setService] = React.useState<AdminService | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setService(await getService(id));
    } catch (err) {
      setError(
        err instanceof ServiceApiError ? err.message : "Failed to load service.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const onStatusChanged = (next: AdminService) => setService(next);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/admin/services"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to services
      </Link>

      {loading ? (
        <Card className="h-48 animate-pulse bg-muted/60" />
      ) : error || !service ? (
        <Card className="flex items-center gap-2 px-4 py-8 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" aria-hidden />
          {error ?? "Service not found."}
        </Card>
      ) : (
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                  {service.name}
                </h1>
                <ServiceStatusPill status={service.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">/{service.slug}</p>
            </div>
            <Button asChild>
              <Link href={`/admin/services/${service.id}/edit`}>
                <Pencil aria-hidden />
                Edit
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="details">
            <TabsList aria-label="Service editor">
              <TabsTrigger value="details">Service Details</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="configurations">Configurations</TabsTrigger>
              <TabsTrigger value="pricing">Pricing Preview</TabsTrigger>
              <TabsTrigger value="publish">Publish</TabsTrigger>
            </TabsList>

            <div className="pt-5">
              <TabsContent value="details">
                <Card className="divide-y divide-border p-0">
                  <Row
                    label="Base price"
                    value={
                      <span className="inline-flex items-center gap-2">
                        {formatCents(service.basePrice)}
                      </span>
                    }
                  />
                  <Row
                    label="Description"
                    value={
                      service.description || (
                        <span className="text-muted-foreground">No description</span>
                      )
                    }
                  />
                  <Row label="Created" value={formatDate(service.createdAt)} />
                  <Row label="Updated" value={formatDate(service.updatedAt)} />
                </Card>
              </TabsContent>

              <TabsContent value="assets">
                <ServiceAssetsPanel slug={service.slug} />
              </TabsContent>

              <TabsContent value="configurations">
                <ServiceConfigPanel serviceId={service.id} />
              </TabsContent>

              <TabsContent value="pricing">
                <ServicePricingPreview serviceId={service.id} basePrice={service.basePrice} />
              </TabsContent>

              <TabsContent value="publish">
                <ServiceStatusControl service={service} onChanged={onStatusChanged} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
