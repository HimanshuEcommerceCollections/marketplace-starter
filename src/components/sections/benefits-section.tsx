import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import type { FeatureItem } from "@/lib/brand/types";

export interface BenefitsSectionProps {
  heading: string;
  subheading?: string;
  items: FeatureItem[];
}

/**
 * Benefits grid. Server component, token-only, data-driven.
 * Desktop: 3 columns · Tablet: 2 columns · Mobile: single column. Equal-height.
 */
export function BenefitsSection({
  heading,
  subheading,
  items,
}: BenefitsSectionProps) {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="py-16 md:py-20 lg:py-28"
    >
      <Container>
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

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <li key={item.title}>
                <Card className="flex h-full flex-col items-start gap-4 rounded-xl bg-muted p-6 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
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
