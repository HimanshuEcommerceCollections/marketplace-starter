import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { HowItWorksStep } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface ProcessStepsSectionProps {
  heading?: string;
  subheading?: string;
  steps: HowItWorksStep[];
  /** Desktop column count. Default 4. */
  columns?: 2 | 3 | 4;
  surface?: Surface;
}

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Numbered process cards (01, 02, …). Server component, token-only.
 * Desktop: up to 4 columns · Tablet: 2 columns · Mobile: single column.
 */
export function ProcessStepsSection({
  heading,
  subheading,
  steps,
  columns = 4,
  surface = "default",
}: ProcessStepsSectionProps) {
  return (
    <section
      aria-labelledby={heading ? "process-heading" : undefined}
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container>
        {heading ? (
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <h2
              id="process-heading"
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

        <ol
          className={cn("grid grid-cols-1 gap-6 lg:gap-8", COLUMN_CLASS[columns])}
        >
          {steps.map((step, index) => {
            const Icon = step.icon ? getIcon(step.icon) : null;
            return (
              <li key={step.title}>
                <Card
                  className={cn(
                    "flex h-full flex-col items-start gap-4 rounded-xl p-6",
                    surface === "muted" ? "bg-background" : "bg-muted",
                  )}
                >
                  {Icon ? (
                    <div className="flex w-full items-center gap-3">
                      <span
                        aria-hidden
                        className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-highlight/10 text-highlight"
                      >
                        <Icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {`Step ${index + 1}`}
                      </span>
                    </div>
                  ) : (
                    <span
                      aria-hidden
                      className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-sm"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    <span className="sr-only">{`Step ${index + 1}: `}</span>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </Card>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
