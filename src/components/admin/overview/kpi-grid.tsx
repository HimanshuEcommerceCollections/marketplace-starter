"use client";

import * as React from "react";
import { StatCard } from "@/components/admin/stat-card";
import type { Kpi } from "@/lib/admin/types";

export interface KpiGridProps {
  kpis: Kpi[];
}

/** Responsive 1→2→4 column grid of KPI stat cards. */
export function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <StatCard key={kpi.label} kpi={kpi} />
      ))}
    </div>
  );
}
