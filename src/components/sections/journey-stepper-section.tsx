import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import type { Surface } from "@/lib/services/landing";

export interface JourneyStepperSectionProps {
  heading?: string;
  subheading?: string;
  steps: string[];
  /** Zero-based index of the step to highlight (optional). */
  activeIndex?: number;
  surface?: Surface;
}

/**
 * Compact inline stepper — small numbered chips with labels. Server component,
 * token-only. Wraps responsively (single row on desktop, wraps on smaller).
 */
export function JourneyStepperSection({
  heading,
  subheading,
  steps,
  activeIndex,
  surface = "default",
}: JourneyStepperSectionProps) {
  return (
    <section
      aria-labelledby={heading ? "journey-heading" : undefined}
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container>
        {heading ? (
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <h2
              id="journey-heading"
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
        ) : null}

        <ol className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4">
          {steps.map((label, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4"
              >
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isActive
                      ? "bg-highlight text-highlight-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-foreground">
                  <span className="sr-only">{`Step ${index + 1}: `}</span>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
