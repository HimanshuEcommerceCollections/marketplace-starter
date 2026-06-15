import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/lib/brand/types";

export interface CorporateSectionProps {
  eyebrow?: string;
  title: string;
  body?: string;
  tags: string[];
  cta: NavItem;
}

/** Corporate CTA — dark inverse surface. Server component, token-only. */
export function CorporateSection({
  eyebrow,
  title,
  body,
  tags,
  cta,
}: CorporateSectionProps) {
  return (
    <section
      id="corporate"
      aria-labelledby="corporate-heading"
      className="corporate-section bg-surface-inverse text-surface-inverse-foreground"
    >
      <Container className="py-16 text-center md:py-20 lg:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-widest text-highlight">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id="corporate-heading"
            className="corporate-title font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
          {body ? (
            <p className="corporate-body text-lg leading-relaxed text-surface-inverse-foreground/80">
              {body}
            </p>
          ) : null}

          {tags.length > 0 ? (
            <ul className="corporate-benefits-row flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-surface-inverse-foreground/20 px-3 py-1 text-xs font-medium text-surface-inverse-foreground/80"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <Button
            asChild
            size="lg"
            className="mt-2 bg-highlight text-highlight-foreground hover:bg-highlight/90 focus-visible:ring-offset-surface-inverse"
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
