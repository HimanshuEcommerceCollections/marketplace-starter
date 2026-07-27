import type { BookingStatusValue, MyBooking } from "./api";

/** SCREAMING_SNAKE_CASE, i.e. the shape of the deprecated `ServiceArea` enum. */
const ENUM_SHAPED = /^[A-Z0-9]+(?:_[A-Z0-9]+)*$/;

/**
 * Render an area name for display.
 *
 * Areas are admin-created rows now, so the authority is whatever human-readable
 * name the server sends ("Cary", "Wake Forest") — it is rendered VERBATIM. There
 * is deliberately no lookup table: a hardcoded 12-town map made every area an
 * admin added render as a raw token.
 *
 * The one transformation left is a compatibility shim: `Booking.area` is still
 * dual-written as the legacy `ServiceArea` enum, so an all-caps token like
 * "WAKE_FOREST" is title-cased rather than shown raw. Anything that does not
 * look like an enum member passes straight through untouched. Delete the shim
 * once the legacy column is dropped and the booking payload carries
 * `areaNameSnapshot`.
 */
export function areaLabel(area: string | null): string | null {
  if (!area) return null;
  const trimmed = area.trim();
  if (!trimmed) return null;
  if (!ENUM_SHAPED.test(trimmed)) return trimmed;
  return trimmed
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * "Your home · Cary" style location line for a booking (falls back to mode).
 *
 * Snapshot beats FK for DISPLAY: `areaNameSnapshot` is the name the customer was
 * shown at booking time and survives a rename or a ZIP being re-homed, so it is
 * preferred over the legacy enum whenever the server sends it.
 */
export function locationLabel(
  b: Pick<MyBooking, "area" | "locationMode" | "areaNameSnapshot">,
): string {
  const town = areaLabel(b.areaNameSnapshot ?? null) ?? areaLabel(b.area);
  if (b.locationMode === "REMOTE") return "Remote session";
  return town ? `Your home · ${town}` : "Your home";
}

/** Duration in minutes derived from the scheduled window, e.g. "90 min". */
export function formatDuration(startIso: string, endIso: string): string | null {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
  return `${Math.round((end - start) / 60000)} min`;
}

/** Relative countdown for an upcoming booking: "Today" / "Tomorrow" / "In 5 days".
 *  Returns null for past instants (nothing to count down to). */
export function relativeCountdown(startIso: string): string | null {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return null;
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((startDay.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return null;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

/** Status → mockup badge class + human label. */
export function statusBadge(status: BookingStatusValue): {
  cls: "confirmed" | "pending" | "completed" | "cancelled";
  label: string;
} {
  switch (status) {
    case "CONFIRMED":
      return { cls: "confirmed", label: "Confirmed" };
    case "IN_PROGRESS":
      return { cls: "confirmed", label: "In progress" };
    case "PENDING":
      return { cls: "pending", label: "Coordinator reviewing" };
    case "COMPLETED":
      return { cls: "completed", label: "Completed" };
    case "CANCELLED":
      return { cls: "cancelled", label: "Cancelled" };
    case "NO_SHOW":
      return { cls: "cancelled", label: "No-show" };
  }
}

/** Tab keys shown above the booking list. */
export type BookingTabKey =
  | "all"
  | "upcoming"
  | "pending"
  | "completed"
  | "cancelled";

export const BOOKING_TABS: Array<{
  key: BookingTabKey;
  label: string;
  statuses?: BookingStatusValue[];
}> = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming", statuses: ["CONFIRMED", "IN_PROGRESS"] },
  { key: "pending", label: "Pending", statuses: ["PENDING"] },
  { key: "completed", label: "Completed", statuses: ["COMPLETED"] },
  { key: "cancelled", label: "Cancelled", statuses: ["CANCELLED", "NO_SHOW"] },
];

/** Whether a booking status belongs under the given tab. */
export function matchesTab(status: BookingStatusValue, tab: BookingTabKey): boolean {
  if (tab === "all") return true;
  const def = BOOKING_TABS.find((t) => t.key === tab);
  return def?.statuses?.includes(status) ?? false;
}

/** ISO instant → iCalendar UTC basic format, e.g. "20260715T180000Z". */
function icsStamp(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  );
}

/** Build a minimal VCALENDAR string for a booking (for "Add to calendar"). */
export function buildIcs(b: MyBooking): string {
  const withPro = b.providerName ? ` with ${b.providerName}` : "";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Elevate//Bookings//EN",
    "BEGIN:VEVENT",
    `UID:${b.reference}@elevate`,
    `DTSTART:${icsStamp(b.scheduledStart)}`,
    `DTEND:${icsStamp(b.scheduledEnd)}`,
    `SUMMARY:Elevate — ${b.serviceName}${withPro}`,
    `LOCATION:${locationLabel(b)}`,
    `DESCRIPTION:Ref ${b.reference}. Your professional arrives 10 minutes early — nothing to prepare.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
