import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { FeatureItem } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface TrustSafetySectionProps {
  heading?: string;
  subheading?: string;
  items: FeatureItem[];
  /** Desktop column count. Default 3. */
  columns?: 2 | 3 | 4;
  surface?: Surface;
  /** Override the heading's typography classes (token utilities only). */
  headingClassName?: string;
}

const DEFAULT_HEADING_CLASS =
  "font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl";

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Centered trust / process cards (round icon, centered text). Server component,
 * token-only, data-driven.
 */
export function TrustSafetySection({
  heading,
  subheading,
  items,
  columns = 3,
  surface = "default",
  headingClassName = DEFAULT_HEADING_CLASS,
}: TrustSafetySectionProps) {
  return (
    <section
      aria-labelledby={heading ? "trust-heading" : undefined}
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container>
        {heading ? (
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <h2 id="trust-heading" className={headingClassName}>
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
                <Card className="flex h-full flex-col items-center gap-4 rounded-xl p-8 text-center">
                  <span className="inline-flex size-14 items-center justify-center rounded-full border border-border bg-background text-primary">
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
