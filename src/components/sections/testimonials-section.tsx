import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TestimonialItem } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface TestimonialsSectionProps {
  heading?: string;
  subheading?: string;
  items: TestimonialItem[];
  /** Background. Defaults to "muted" (homepage look). */
  surface?: Surface;
}

/** Per-surface token classes — enables a light, muted, or dark (inverse) band. */
const SURFACE: Record<
  Surface,
  {
    section: string;
    heading: string;
    subheading: string;
    card: string;
    quote: string;
    author: string;
    role: string;
  }
> = {
  default: {
    section: "",
    heading: "text-foreground",
    subheading: "text-muted-foreground",
    card: "bg-card",
    quote: "text-foreground",
    author: "text-foreground",
    role: "text-muted-foreground",
  },
  muted: {
    section: "bg-muted",
    heading: "text-foreground",
    subheading: "text-muted-foreground",
    card: "bg-card",
    quote: "text-foreground",
    author: "text-foreground",
    role: "text-muted-foreground",
  },
  inverse: {
    section: "bg-surface-inverse text-surface-inverse-foreground",
    heading: "text-surface-inverse-foreground",
    subheading: "text-surface-inverse-foreground/80",
    card: "border-surface-inverse-foreground/15 bg-surface-inverse-foreground/5",
    quote: "text-surface-inverse-foreground",
    author: "text-surface-inverse-foreground",
    role: "text-surface-inverse-foreground/70",
  },
};

/**
 * Testimonials — social proof.
 * Server component, token-only, data-driven. Supports light, muted, and dark
 * (inverse) bands.
 */
export function TestimonialsSection({
  heading,
  subheading,
  items,
  surface = "muted",
}: TestimonialsSectionProps) {
  const s = SURFACE[surface];

  return (
    <section
      aria-labelledby="testimonials-heading"
      className={cn("py-16 md:py-20 lg:py-28", s.section)}
    >
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          {heading ? (
            <h2
              id="testimonials-heading"
              className={cn(
                "font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl",
                s.heading,
              )}
            >
              {heading}
            </h2>
          ) : null}
          {subheading ? (
            <p className={cn("mt-4 text-lg leading-relaxed", s.subheading)}>
              {subheading}
            </p>
          ) : null}
        </div>

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {items.map((item) => (
            <li key={item.id}>
              <Card className={cn("h-full rounded-xl p-6", s.card)}>
                <figure className="flex h-full flex-col gap-4">
                  <blockquote
                    className={cn(
                      "font-heading text-lg leading-relaxed",
                      s.quote,
                    )}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-auto">
                    <p
                      className={cn(
                        "flex flex-wrap items-center gap-2 font-semibold",
                        s.author,
                      )}
                    >
                      {item.author}
                    </p>
                    {item.role ? (
                      <p className={cn("mt-1 text-sm", s.role)}>{item.role}</p>
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
