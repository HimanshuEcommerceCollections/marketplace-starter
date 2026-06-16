import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { FeatureItem } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface BenefitsSectionProps {
  heading?: string;
  subheading?: string;
  items: FeatureItem[];
  /** Desktop column count. Default 3. */
  columns?: 2 | 3 | 4;
  surface?: Surface;
}

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Stacked benefit cards (square icon top-left, left-aligned). Server component,
 * token-only, data-driven. Equal-height cards.
 */
export function BenefitsSection({
  heading,
  subheading,
  items,
  columns = 3,
  surface = "default",
}: BenefitsSectionProps) {
  return (
    <section
      aria-labelledby={heading ? "benefits-heading" : undefined}
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container>
        {heading ? (
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <h2
              id="benefits-heading"
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
                    "flex h-full flex-col items-start gap-4 rounded-xl p-6 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md",
                    surface === "muted" ? "bg-background" : "bg-muted",
                  )}
                >
                  <span className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2.5 text-primary">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
