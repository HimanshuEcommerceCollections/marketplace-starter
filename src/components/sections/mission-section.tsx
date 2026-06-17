import { Quote } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Surface } from "@/lib/services/landing";

export interface MissionValue {
  /** Lucide icon name from the registry. */
  icon?: string;
  label: string;
}

export interface MissionSectionProps {
  heading: string;
  /** Narrative paragraphs rendered in the left column. */
  paragraphs: string[];
  /** Pull-quote rendered on a brand (sage) card in the right column. */
  quote: {
    /** Lucide icon name; falls back to a quote glyph. */
    icon?: string;
    text: string;
    body?: string;
    attribution?: string;
  };
  /** Optional value chips below the columns. */
  values?: MissionValue[];
  surface?: Surface;
}

/**
 * "Why Elevate Exists" — a two-column narrative + brand pull-quote card, with an
 * optional row of value chips beneath. Server component, token-only, data-driven.
 * Desktop: copy left, quote card right · Mobile/tablet: stacked.
 */
export function MissionSection({
  heading,
  paragraphs,
  quote,
  values = [],
  surface = "default",
}: MissionSectionProps) {
  const QuoteIcon = quote.icon ? getIcon(quote.icon) : Quote;

  return (
    <section
      aria-labelledby="mission-heading"
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2
              id="mission-heading"
              className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              {heading}
            </h2>
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <Card className="flex flex-col gap-5 rounded-2xl border-transparent bg-surface-brand p-8 text-surface-brand-foreground md:p-10">
            <span
              aria-hidden
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-brand-foreground/10 text-surface-brand-foreground"
            >
              <QuoteIcon className="size-5" strokeWidth={1.75} />
            </span>
            <blockquote className="font-heading text-2xl font-semibold leading-snug md:text-3xl">
              {quote.text}
            </blockquote>
            {quote.body ? (
              <p className="leading-relaxed text-surface-brand-foreground/85">
                {quote.body}
              </p>
            ) : null}
            {quote.attribution ? (
              <p className="mt-auto text-xs font-semibold uppercase tracking-widest text-surface-brand-foreground/70">
                {quote.attribution}
              </p>
            ) : null}
          </Card>
        </div>

        {values.length > 0 ? (
          <ul className="mt-10 flex flex-wrap gap-3 md:mt-12">
            {values.map((value) => {
              const Icon = getIcon(value.icon);
              return (
                <li
                  key={value.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
                >
                  <span
                    aria-hidden
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                  >
                    <Icon className="size-3.5" strokeWidth={2} />
                  </span>
                  {value.label}
                </li>
              );
            })}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
