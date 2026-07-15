/**
 * Preferred booking time RANGES (time-of-day windows). The customer picks up to
 * MAX_WINDOWS preferred (date + range) windows; the server derives the concrete
 * scheduledStart from the first window's range `start` and keeps every window in
 * schedulePreferences.
 */
export interface TimeRange {
  value: string;
  label: string;
  /** Representative clock start ("HH:mm") used to build the concrete slot. */
  start: string;
}

export const TIME_RANGES: readonly TimeRange[] = [
  { value: "morning", label: "Morning (8 AM – 12 PM)", start: "08:00" },
  { value: "afternoon", label: "Afternoon (12 – 5 PM)", start: "12:00" },
  { value: "evening", label: "Evening (5 – 9 PM)", start: "17:00" },
];

/** Maximum number of preferred (date + range) windows a customer may request. */
export const MAX_WINDOWS = 3;

/** Clock start ("HH:mm") for a range value; falls back to 09:00. */
export function rangeStart(value: string | undefined): string {
  return TIME_RANGES.find((r) => r.value === value)?.start ?? "09:00";
}

/** Human label for a range value (e.g. "morning" → "Morning (8 AM – 12 PM)"). */
export function rangeLabel(value: string | undefined): string {
  if (!value) return "";
  return TIME_RANGES.find((r) => r.value === value)?.label ?? value;
}
