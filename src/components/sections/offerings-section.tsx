import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { OfferingItem } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface OfferingsSectionProps {
  heading?: string;
  subheading?: string;
  items: OfferingItem[];
  /** Desktop column count. Default 4. */
  columns?: 2 | 3 | 4;
  surface?: Surface;
  /** Optional callout below the grid. */
  note?: string;
}

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Featured-offering cards: top accent bar, icon, optional badge, and an
 * optional "Inquire about this →" link. A sibling of {@link BenefitsSection}
 * for offers that need a per-card call to action. Server component, token-only,
 * data-driven, equal-height cards.
 */
export function OfferingsSection({
  heading,
  subheading,
  items,
  columns = 4,
  surface = "default",
  note,
}: OfferingsSectionProps) {
  return (
    <section
      aria-labelledby={heading ? "offerings-heading" : undefined}
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container>
        {heading ? (
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <h2
              id="offerings-heading"
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
        ) : null}

        <ul
          role="list"
          className={cn("grid grid-cols-1 gap-6 lg:gap-8", COLUMN_CLASS[columns])}
        >
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <li key={item.title}>
                <Card
                  className={cn(
                    "flex h-full flex-col items-start gap-4 rounded-xl border-t-2 border-t-highlight p-6 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md",
                    surface === "muted" ? "bg-background" : "bg-muted",
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="inline-flex items-center justify-center rounded-lg bg-highlight/10 p-2.5 text-highlight">
                      <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                    </span>
                    {item.badge ? (
                      <span className="inline-flex items-center rounded-md bg-highlight/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-highlight">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  {item.cta ? (
                    <Link
                      href={item.cta.href}
                      className="mt-auto inline-flex items-center gap-1 rounded-md text-sm font-semibold text-highlight transition-colors hover:text-highlight/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.cta.label}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>

        {note ? (
          <p className="mx-auto mt-10 flex max-w-3xl items-start gap-2 rounded-xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden />
            {note}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
