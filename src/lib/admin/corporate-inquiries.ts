import type { BadgeProps } from "@/components/ui/badge";
import type { CorporateInquiryStatusValue } from "@/lib/corporate/api";

type Variant = NonNullable<BadgeProps["variant"]>;

/** All statuses in triage order (also drives the filter tabs). */
export const INQUIRY_STATUSES: CorporateInquiryStatusValue[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CLOSED",
];

/**
 * Inquiry-status → Badge variant + label.
 * New = warning (awaiting triage), Contacted = secondary (in progress),
 * Qualified = success (hot lead), Closed = outline (resolved/archived).
 */
export function inquiryStatusBadge(s: CorporateInquiryStatusValue): {
  variant: Variant;
  label: string;
} {
  switch (s) {
    case "NEW":
      return { variant: "warning", label: "New" };
    case "CONTACTED":
      return { variant: "secondary", label: "Contacted" };
    case "QUALIFIED":
      return { variant: "success", label: "Qualified" };
    case "CLOSED":
      return { variant: "outline", label: "Closed" };
  }
}

/** Action label for moving an inquiry to the given status. */
export function inquiryTransitionLabel(to: CorporateInquiryStatusValue): string {
  switch (to) {
    case "NEW":
      return "Reopen as New";
    case "CONTACTED":
      return "Mark Contacted";
    case "QUALIFIED":
      return "Mark Qualified";
    case "CLOSED":
      return "Close";
  }
}
