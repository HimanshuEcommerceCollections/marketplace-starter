import { Check, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import type { ComparisonRow } from "@/lib/brand/types";

export interface ComparisonSectionProps {
  heading: string;
  subheading?: string;
  traditionalLabel: string;
  elevateLabel: string;
  rows: ComparisonRow[];
}

/** Traditional vs. Elevate comparison table. Server component, token-only. */
export function ComparisonSection({
  heading,
  subheading,
  traditionalLabel,
  elevateLabel,
  rows,
}: ComparisonSectionProps) {
  return (
    <section
      aria-labelledby="comparison-heading"
      className="py-16 md:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2
            id="comparison-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            {heading}
          </h2>
          {subheading ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-1 bg-muted sm:grid-cols-2">
            <p className="px-5 py-3 text-sm font-semibold text-muted-foreground">
              {traditionalLabel}
            </p>
            <p className="border-t border-border px-5 py-3 text-sm font-semibold text-primary sm:border-l sm:border-t-0">
              {elevateLabel}
            </p>
          </div>

          <ul role="list">
            {rows.map((row) => (
              <li
                key={row.elevate}
                className="grid grid-cols-1 border-t border-border sm:grid-cols-2"
              >
                <div className="flex items-center gap-2 px-5 py-4 text-sm text-muted-foreground">
                  <X aria-hidden className="size-4 shrink-0" />
                  <span>{row.traditional}</span>
                </div>
                <div className="flex items-center gap-2 border-t border-border px-5 py-4 text-sm text-foreground sm:border-l sm:border-t-0">
                  <Check aria-hidden className="size-4 shrink-0 text-primary" />
                  <span>{row.elevate}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
