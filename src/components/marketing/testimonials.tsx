import { Container } from "@/components/layout/container";
import { TestimonialCard } from "./testimonial-card";
import type { TestimonialItem } from "@/lib/brand/types";

export interface TestimonialsProps {
  heading?: string;
  items: TestimonialItem[];
}

/**
 * Social proof section. RULE-CRITICAL: all entries are clearly-labeled
 * [Sample] placeholders — never fabricated real customers.
 */
export function Testimonials({ heading, items }: TestimonialsProps) {
  if (items.length === 0) return null;
  return (
    <section className="py-12 md:py-16" aria-labelledby="testimonials-heading">
      <Container>
        <div className="mx-auto mb-10 max-w-container-sm text-center">
          <h2
            id="testimonials-heading"
            className="text-2xl font-bold md:text-3xl"
          >
            {heading ?? "What people say"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            [Sample] — illustrative placeholders, not real customers.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <TestimonialCard key={item.id} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
