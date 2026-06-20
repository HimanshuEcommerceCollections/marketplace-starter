import { Card } from "@/components/ui/card";

const COLS = 7;
const ROWS = 6;

/** Loading placeholder matching the services table (desktop) / cards (mobile). */
export function ServiceTableSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading services">
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
        {Array.from({ length: ROWS }).map((_, i) => (
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
        {Array.from({ length: ROWS }).map((_, i) => (
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
