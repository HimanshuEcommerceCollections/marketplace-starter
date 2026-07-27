import { Card } from "@/components/ui/card";

const COLS = 6;

/**
 * Loading placeholder for the coverage tables.
 *
 * Deliberate divergence from `admin/services/page.tsx`, which sets
 * `loading = true` on EVERY load and so flashes a skeleton on each page change.
 * The coverage pages show this only on the initial load and keep rows mounted
 * with `aria-busy` afterwards — at 50 rows a per-page flash is jarring.
 */
export function CoverageTableSkeleton({ rows = 8, label = "Loading" }: {
  rows?: number;
  label?: string;
}) {
  return (
    <div aria-busy="true" aria-label={label}>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <div className="flex items-center gap-4 border-b border-border bg-muted px-4 py-3">
          {Array.from({ length: COLS }).map((_, i) => (
            <div
              key={i}
              className="h-3 flex-1 animate-pulse rounded bg-muted-foreground/20"
            />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
          >
            {Array.from({ length: COLS }).map((_, j) => (
              <div key={j} className="h-4 flex-1 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ))}
      </div>

      {/* Mobile */}
      <ul className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: Math.min(rows, 5) }).map((_, i) => (
          <li key={i}>
            <Card className="space-y-3 p-4">
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
