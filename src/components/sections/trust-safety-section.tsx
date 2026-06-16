import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import type { ProcessCard } from "@/lib/brand/types";

export interface TrustSafetySectionProps {
  heading: string;
  subheading?: string;
  items: ProcessCard[];
  /** Desktop column count. Default 3 (homepage); use 4 for service landing. */
  columns?: 3 | 4;
}

const COLUMN_CLASS: Record<3 | 4, string> = {
  3: "lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** Trust / process cards. Server component, token-only, data-driven. */
export function TrustSafetySection({
  heading,
  subheading,
  items,
  columns = 3,
}: TrustSafetySectionProps) {
  return (
    <section
      aria-labelledby="trust-heading"
      className="py-16 md:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2
            id="trust-heading"
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

        <ul
          role="list"
          className={`grid grid-cols-1 gap-6 lg:gap-8 ${COLUMN_CLASS[columns]}`}
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
