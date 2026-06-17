import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { FeatureItem } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface TrustSafetySectionProps {
  heading?: string;
  subheading?: string;
  items: FeatureItem[];
  /** Desktop column count. Default 3. */
  columns?: 2 | 3 | 4;
  surface?: Surface;
  /** Override the heading's typography classes (token utilities only). */
  headingClassName?: string;
}

const DEFAULT_HEADING_CLASS =
  "font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl";

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "lg:grid-cols-3",
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
    title: string;
    description: string;
  }
> = {
  default: {
    section: "",
    heading: "text-foreground",
    subheading: "text-muted-foreground",
    card: "",
    icon: "border-border bg-background text-primary",
    title: "text-foreground",
    description: "text-muted-foreground",
  },
  muted: {
    section: "bg-muted",
    heading: "text-foreground",
    subheading: "text-muted-foreground",
    card: "",
    icon: "border-border bg-background text-primary",
    title: "text-foreground",
    description: "text-muted-foreground",
  },
  inverse: {
    section: "bg-surface-inverse text-surface-inverse-foreground",
    heading: "text-surface-inverse-foreground",
    subheading: "text-surface-inverse-foreground/80",
    card: "border-surface-inverse-foreground/15 bg-surface-inverse-foreground/5",
    icon: "border-surface-inverse-foreground/20 bg-surface-inverse-foreground/10 text-highlight",
    title: "text-surface-inverse-foreground",
    description: "text-surface-inverse-foreground/70",
  },
};

/**
 * Centered trust / process cards (round icon, centered text). Server component,
 * token-only, data-driven. Supports light, muted, and dark (inverse) bands.
 */
export function TrustSafetySection({
  heading,
  subheading,
  items,
  columns = 3,
  surface = "default",
  headingClassName = DEFAULT_HEADING_CLASS,
}: TrustSafetySectionProps) {
  const s = SURFACE[surface];

  return (
    <section
      aria-labelledby={heading ? "trust-heading" : undefined}
      className={cn("py-16 md:py-20 lg:py-28", s.section)}
    >
      <Container>
        {heading ? (
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <h2 id="trust-heading" className={cn(headingClassName, s.heading)}>
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
                    "flex h-full flex-col items-center gap-4 rounded-xl p-8 text-center",
                    s.card,
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-14 items-center justify-center rounded-full border",
                      s.icon,
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className={cn("font-heading text-lg font-semibold", s.title)}>
                    {item.title}
                  </h3>
                  <p className={cn("text-sm leading-relaxed", s.description)}>
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
