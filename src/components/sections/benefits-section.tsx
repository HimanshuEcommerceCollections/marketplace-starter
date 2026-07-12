import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { FeatureItem } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface BenefitsSectionProps {
  heading?: string;
  subheading?: string;
  items: FeatureItem[];
  /** Desktop column count. Default 3. */
  columns?: 2 | 3 | 4;
  surface?: Surface;
  /** Optional callout below the grid. */
  note?: string;
}

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** Per-surface token classes — enables a light, muted, or dark (inverse) band. */
const SURFACE: Record<
  Surface,
  {
    section: string;
    heading: string;
    subheading: string;
    card: string;
    icon: string;
    badge: string;
    title: string;
    description: string;
    footnote: string;
  }
> = {
  default: {
    section: "",
    heading: "text-foreground",
    subheading: "text-muted-foreground",
    card: "bg-muted",
    icon: "bg-highlight/10 text-highlight",
    badge: "bg-muted-foreground/15 text-muted-foreground",
    title: "text-foreground",
    description: "text-muted-foreground",
    footnote: "text-muted-foreground/80",
  },
  muted: {
    section: "bg-muted",
    heading: "text-foreground",
    subheading: "text-muted-foreground",
    card: "bg-background",
    icon: "bg-highlight/10 text-highlight",
    badge: "bg-muted-foreground/15 text-muted-foreground",
    title: "text-foreground",
    description: "text-muted-foreground",
    footnote: "text-muted-foreground/80",
  },
  inverse: {
    section: "bg-surface-inverse text-surface-inverse-foreground",
    heading: "text-surface-inverse-foreground",
    subheading: "text-surface-inverse-foreground/80",
    card: "border-surface-inverse-foreground/15 bg-surface-inverse-foreground/5",
    icon: "bg-surface-inverse-foreground/10 text-highlight",
    badge: "bg-surface-inverse-foreground/10 text-surface-inverse-foreground/80",
    title: "text-surface-inverse-foreground",
    description: "text-surface-inverse-foreground/70",
    footnote: "text-surface-inverse-foreground/60",
  },
};

/**
 * Stacked benefit cards (square icon top-left, left-aligned). Server component,
 * token-only, data-driven. Equal-height cards. Supports light, muted, and dark
 * (inverse) bands, and an optional per-card fine-print footnote.
 */
export function BenefitsSection({
  heading,
  subheading,
  items,
  columns = 3,
  surface = "default",
  note,
}: BenefitsSectionProps) {
  const s = SURFACE[surface];

  return (
    <section
      aria-labelledby={heading ? "benefits-heading" : undefined}
      className={cn("py-16 md:py-20 lg:py-28", s.section)}
    >
      <Container>
        {heading ? (
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <h2
              id="benefits-heading"
              className={cn(
                "font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl",
                s.heading,
              )}
            >
              {heading}
            </h2>
            {subheading ? (
              <p className={cn("mt-4 text-lg leading-relaxed", s.subheading)}>
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
                <Card
                  className={cn(
                    "flex h-full flex-col items-start gap-4 rounded-xl p-6 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md",
                    s.card,
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center rounded-lg p-2.5",
                        s.icon,
                      )}
                    >
                      <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                    </span>
                    {item.badge ? (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                          s.badge,
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <h3 className={cn("font-heading text-lg font-semibold", s.title)}>
                    {item.title}
                  </h3>
                  <p className={cn("text-sm leading-relaxed", s.description)}>
                    {item.description}
                  </p>
                  {item.footnote ? (
                    <p
                      className={cn(
                        "mt-auto flex items-start gap-1.5 pt-2 text-xs leading-relaxed",
                        s.footnote,
                      )}
                    >
                      <span
                        aria-hidden
                        className="mt-1 size-1 shrink-0 rounded-full bg-current opacity-70"
                      />
                      <span>{item.footnote}</span>
                    </p>
                  ) : null}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="mt-auto inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-highlight hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {item.hrefLabel ?? "Learn More"}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>

        {note ? (
          <p className="mx-auto mt-10 flex max-w-3xl items-start gap-2 rounded-xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden />
            {note}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
