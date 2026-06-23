/** Friendly date-only with full weekday, e.g. "2026-06-25" -> "Thursday, Jun 25, 2026". */
export function formatBookingDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr || "—";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Compact date for tables — month + day only, e.g. ISO -> "Jun 25". */
export function formatBookingShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Friendly time-only, e.g. "10:00" -> "10:00 am". */
export function formatBookingTime(timeStr: string): string {
  const [h, m] = (timeStr ?? "").split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeStr || "—";
  const period = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Clock time from an ISO datetime, lowercased — e.g. "…T09:00" -> "9:00 am". */
function clock(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .toLowerCase();
}

/** Time range from start/end ISO datetimes, e.g. "9:00 am – 12:00 pm". */
export function formatBookingTimeRange(startIso: string, endIso: string): string {
  if (Number.isNaN(new Date(startIso).getTime())) return "—";
  const start = clock(startIso);
  return Number.isNaN(new Date(endIso).getTime()) ? start : `${start} – ${clock(endIso)}`;
}

/** Friendly date-time for bookings, e.g. "Thu, Jun 25, 2026 · 10:00 AM". */
export function formatBookingWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date} · ${time}`;
}
