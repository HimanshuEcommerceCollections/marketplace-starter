import { formatMoney } from "@/lib/money";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** Format an ISO date string for admin tables/details (e.g. "Jun 19, 2026"). */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateFmt.format(d);
}

/** Format minor-unit cents as currency (e.g. 7500 -> "$75.00"). */
export function formatCents(cents: number, currency = "USD"): string {
  return formatMoney({ amount: cents, currency });
}
