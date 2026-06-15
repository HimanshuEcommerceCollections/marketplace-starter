import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/lib/brand/types";

export interface FinalCtaSectionProps {
  eyebrow?: string;
  title: string;
  body?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
}

/** Final CTA — brand (sage) surface band. Server component, token-only. */
export function FinalCtaSection({
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
}: FinalCtaSectionProps) {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="final-cta-section bg-surface-brand text-surface-brand-foreground"
    >
      <Container className="py-16 text-center md:py-20 lg:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-widest text-surface-brand-foreground/80">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id="final-cta-heading"
            className="final-cta-title font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
          {body ? (
            <p className="final-cta-body text-lg leading-relaxed text-surface-brand-foreground/85">
              {body}
            </p>
          ) : null}

          <div className="final-cta-buttons mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full bg-background text-foreground hover:bg-background/90 focus-visible:ring-offset-surface-brand sm:w-auto"
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            {secondaryCta ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-surface-brand-foreground/40 bg-transparent text-surface-brand-foreground hover:bg-surface-brand-foreground/10 hover:text-surface-brand-foreground focus-visible:ring-offset-surface-brand sm:w-auto"
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
