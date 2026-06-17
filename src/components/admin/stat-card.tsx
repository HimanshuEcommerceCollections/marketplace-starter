import * as React from "react";
import { Card } from "@/components/ui/card";
import { SampleBadge } from "@/components/shared/sample-badge";
import type { Kpi } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  kpi: Kpi;
}

/**
 * KPI stat card. Each carries its own SampleBadge since the value is an
 * illustrative metric. Sub-line color is chosen for readability on bg-card:
 * warning → text-highlight, success → text-primary, default → muted.
 */
export function StatCard({ kpi }: StatCardProps) {
  const subClass =
    kpi.tone === "warning"
      ? "text-highlight"
      : kpi.tone === "success"
        ? "text-primary"
        : "text-muted-foreground";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {kpi.label}
        </span>
        <SampleBadge />
      </div>
      <p className="mt-2 font-heading text-3xl font-bold text-foreground">
        {kpi.value}
      </p>
      {kpi.sub ? (
        <p className={cn("mt-1 text-sm font-medium", subClass)}>{kpi.sub}</p>
      ) : null}
    </Card>
  );
}
