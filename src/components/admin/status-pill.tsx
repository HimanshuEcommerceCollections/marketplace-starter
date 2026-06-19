import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  bookingStatusBadge,
  bookingStatusDot,
  categoryStatusBadge,
  serviceStatusBadge,
} from "@/lib/admin/status";
import type {
  BookingStatus,
  CategoryStatus,
  ServiceStatus,
} from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export function StatusPill({ status }: { status: BookingStatus }) {
  const { variant, label } = bookingStatusBadge(status);
  return <Badge variant={variant}>{label}</Badge>;
}

export function StatusDot({ status }: { status: BookingStatus }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 rounded-full",
        bookingStatusDot(status),
      )}
    />
  );
}

export function ServiceStatusPill({ status }: { status: ServiceStatus }) {
  const { variant, label } = serviceStatusBadge(status);
  return <Badge variant={variant}>{label}</Badge>;
}

export function CategoryStatusPill({ status }: { status: CategoryStatus }) {
  const { variant, label } = categoryStatusBadge(status);
  return <Badge variant={variant}>{label}</Badge>;
}
