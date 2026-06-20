"use client";

import * as React from "react";
import { CheckCircle2, Ban, Clock, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceStatusPill } from "@/components/admin/status-pill";
import type { AdminService, ServiceStatus } from "@/lib/admin/types";
import {
  SERVICE_TRANSITIONS,
  serviceTransitionLabel,
} from "@/lib/admin/status";
import { setServiceStatus, ServiceApiError } from "@/lib/admin/services";

export interface ServiceStatusControlProps {
  service: AdminService;
  /** Receives the updated service after a transition. */
  onChanged: (next: AdminService) => void;
}

/** Icon + button variant per target status. */
function transitionStyle(to: ServiceStatus): {
  icon: React.ComponentType<{ className?: string }>;
  variant: "default" | "outline";
} {
  switch (to) {
    case "ACTIVE":
      return { icon: CheckCircle2, variant: "default" };
    case "COMING_SOON":
      return { icon: Clock, variant: "outline" };
    case "DRAFT":
      return { icon: FileEdit, variant: "outline" };
    case "INACTIVE":
      return { icon: Ban, variant: "outline" };
  }
}

/**
 * Lifecycle control used on the details + edit screens. Shows the current status
 * and one button per valid transition (Publish / Mark Coming Soon / Move to
 * Draft / Deactivate), driven by the shared transition map.
 */
export function ServiceStatusControl({ service, onChanged }: ServiceStatusControlProps) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const run = async (to: ServiceStatus) => {
    setBusy(true);
    setError(null);
    try {
      onChanged(await setServiceStatus(service.id, to));
    } catch (err) {
      setError(err instanceof ServiceApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const targets = SERVICE_TRANSITIONS[service.status];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-foreground">
        Status
        <ServiceStatusPill status={service.status} />
      </span>
      <div className="flex flex-col items-end gap-1">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {targets.map((to) => {
            const { icon: Icon, variant } = transitionStyle(to);
            return (
              <Button
                key={to}
                type="button"
                variant={variant}
                size="sm"
                disabled={busy}
                onClick={() => void run(to)}
              >
                <Icon aria-hidden />
                {serviceTransitionLabel(to)}
              </Button>
            );
          })}
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
