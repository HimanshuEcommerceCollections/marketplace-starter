import type { BadgeProps } from "@/components/ui/badge";
import type { BookingStatus, CategoryStatus, ServiceStatus } from "./types";

type Variant = NonNullable<BadgeProps["variant"]>;

/**
 * Booking-status → Badge variant + label.
 * NOTE: the mockups use a blue accent for "active"; blue is not a design token,
 * so active maps to `secondary` (a deliberate token-compliance choice).
 */
export function bookingStatusBadge(s: BookingStatus): {
  variant: Variant;
  label: string;
} {
  switch (s) {
    case "pending":
      return { variant: "warning", label: "Pending" };
    case "active":
      return { variant: "secondary", label: "Active" };
    case "completed":
      return { variant: "success", label: "Completed" };
    case "cancelled":
      return { variant: "destructive", label: "Cancelled" };
  }
}

/** Token bg class for the small status dot. */
export function bookingStatusDot(s: BookingStatus): string {
  switch (s) {
    case "pending":
      return "bg-warning";
    case "active":
      return "bg-primary";
    case "completed":
      return "bg-success";
    case "cancelled":
      return "bg-muted-foreground";
  }
}

export function serviceStatusBadge(s: ServiceStatus): {
  variant: Variant;
  label: string;
} {
  return s === "active"
    ? { variant: "success", label: "Active" }
    : { variant: "destructive", label: "Inactive" };
}

/**
 * Category-status → Badge variant + label.
 * Draft = neutral (secondary), Active = success (olive/green), Inactive = destructive
 * (mirrors `serviceStatusBadge`'s inactive treatment for consistency).
 */
export function categoryStatusBadge(s: CategoryStatus): {
  variant: Variant;
  label: string;
} {
  switch (s) {
    case "DRAFT":
      return { variant: "secondary", label: "Draft" };
    case "ACTIVE":
      return { variant: "success", label: "Active" };
    case "INACTIVE":
      return { variant: "destructive", label: "Inactive" };
  }
}
