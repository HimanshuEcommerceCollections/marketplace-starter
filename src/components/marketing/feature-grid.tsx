import { Container } from "@/components/layout/container";
import { FeatureCard } from "./feature-card";
import type { FeatureItem } from "@/lib/brand/types";

export interface FeatureGridProps {
  heading?: string;
  subheading?: string;
  items: FeatureItem[];
}

export function FeatureGrid({ heading, subheading, items }: FeatureGridProps) {
  return (
    <section className="py-12 md:py-16" aria-labelledby={heading ? "features-heading" : undefined}>
      <Container>
        {heading ? (
          <div className="mx-auto mb-10 max-w-container-sm text-center">
            <h2 id="features-heading" className="text-2xl font-bold md:text-3xl">
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-2 text-muted-foreground">{subheading}</p>
            ) : null}
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
