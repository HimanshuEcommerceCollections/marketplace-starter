import type { BadgeProps } from "@/components/ui/badge";
import type { BookingStatusValue } from "./api";

type Variant = NonNullable<BadgeProps["variant"]>;

/** Booking lifecycle (server BookingStatus) → Badge variant + label. */
export function bookingStatusBadge(s: BookingStatusValue): {
  variant: Variant;
  label: string;
} {
  switch (s) {
    case "PENDING":
      return { variant: "warning", label: "Pending" };
    case "CONFIRMED":
      return { variant: "success", label: "Confirmed" };
    case "IN_PROGRESS":
      return { variant: "secondary", label: "In progress" };
    case "COMPLETED":
      return { variant: "success", label: "Completed" };
    case "CANCELLED":
      return { variant: "destructive", label: "Cancelled" };
    case "NO_SHOW":
      return { variant: "destructive", label: "No-show" };
  }
}

/** Statuses a customer may cancel from. */
export const CANCELLABLE_STATUSES: BookingStatusValue[] = ["PENDING", "CONFIRMED"];

export function isCancellable(s: BookingStatusValue): boolean {
  return CANCELLABLE_STATUSES.includes(s);
}
