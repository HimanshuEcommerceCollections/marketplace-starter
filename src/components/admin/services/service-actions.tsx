"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  CheckCircle2,
  Ban,
  Clock,
  FileEdit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { AdminService, ServiceStatus } from "@/lib/admin/types";
import {
  SERVICE_TRANSITIONS,
  serviceTransitionLabel,
} from "@/lib/admin/status";
import { setServiceStatus, ServiceApiError } from "@/lib/admin/services";

export interface ServiceActionsProps {
  service: AdminService;
  /** Called after a successful lifecycle change so the list can refetch. */
  onChanged: () => void;
  onError?: (message: string) => void;
}

const TRANSITION_ICON: Record<
  ServiceStatus,
  React.ComponentType<{ className?: string }>
> = {
  ACTIVE: CheckCircle2,
  COMING_SOON: Clock,
  DRAFT: FileEdit,
  INACTIVE: Ban,
};

/** Row actions menu: View · Edit · one item per valid status transition. */
export function ServiceActions({ service, onChanged, onError }: ServiceActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  const run = async (to: ServiceStatus) => {
    setBusy(true);
    try {
      await setServiceStatus(service.id, to);
      onChanged();
    } catch (err) {
      onError?.(
        err instanceof ServiceApiError ? err.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  };

  const targets = SERVICE_TRANSITIONS[service.status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${service.name}`}
          disabled={busy}
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => router.push(`/admin/services/${service.id}`)}>
          <Eye className="size-4" aria-hidden />
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => router.push(`/admin/services/${service.id}/edit`)}
        >
          <Pencil className="size-4" aria-hidden />
          Edit
        </DropdownMenuItem>
        {targets.map((to) => {
          const Icon = TRANSITION_ICON[to];
          return (
            <DropdownMenuItem key={to} onSelect={() => void run(to)}>
              <Icon className="size-4" aria-hidden />
              {serviceTransitionLabel(to)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
