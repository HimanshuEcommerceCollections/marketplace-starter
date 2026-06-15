import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { SampleBadge } from "@/components/shared/sample-badge";
import type { TestimonialItem } from "@/lib/brand/types";

export interface TestimonialsSectionProps {
  heading?: string;
  subheading?: string;
  items: TestimonialItem[];
}

/**
 * Testimonials — social proof, always visibly [Sample]-labeled (rule).
 * Server component, token-only, data-driven.
 */
export function TestimonialsSection({
  heading,
  subheading,
  items,
}: TestimonialsSectionProps) {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="testimonials-section bg-muted py-16 md:py-20 lg:py-28"
    >
      <Container>
        <div className="section-header mx-auto mb-12 max-w-2xl text-center md:mb-16">
          {heading ? (
            <h2
              id="testimonials-heading"
              className="section-title font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              {heading}
            </h2>
          ) : null}
          {subheading ? (
            <p className="section-subtitle mt-4 text-lg leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          ) : null}
        </div>

        <ul
          role="list"
          className="testimonials-cards grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {items.map((item) => (
            <li key={item.id}>
              <Card className="testimonial-card h-full rounded-xl bg-card p-6">
                <figure className="flex h-full flex-col gap-4">
                  <SampleBadge className="self-start border-transparent bg-accent text-accent-foreground" />
                  <blockquote className="font-heading text-lg leading-relaxed text-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-auto">
                    <p className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
                      {item.author}
                      <SampleBadge />
                    </p>
                    {item.role ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.role}
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
