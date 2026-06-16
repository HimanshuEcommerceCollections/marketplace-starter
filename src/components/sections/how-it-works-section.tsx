import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import type { HowItWorksStep } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface HowItWorksSectionProps {
  heading: string;
  subheading?: string;
  steps: HowItWorksStep[];
  surface?: Surface;
}

/**
 * How It Works timeline. Server component, token-only, data-driven.
 * Desktop: horizontal timeline · Tablet: 3x2 grid · Mobile: vertical timeline.
 */
export function HowItWorksSection({
  heading,
  subheading,
  steps,
  surface = "default",
}: HowItWorksSectionProps) {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2
            id="how-it-works-heading"
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

        <ol className="flex flex-col md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-12 lg:grid-cols-6 lg:gap-x-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const number = String(index + 1).padStart(2, "0");

            return (
              <li
                key={step.title}
                className="relative flex gap-4 pb-10 last:pb-0 md:flex-col md:items-center md:gap-4 md:pb-0 md:text-center lg:px-4"
              >
                {!isLast ? (
                  <>
                    <span
                      aria-hidden
                      className="absolute left-7 top-7 h-full w-px -translate-x-1/2 bg-border md:hidden"
                    />
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-7 hidden h-px w-full -translate-y-1/2 bg-border lg:block"
                    />
                  </>
                ) : null}

                <span
                  aria-hidden
                  className="relative z-10 inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-sm ring-4 ring-primary/10"
                >
                  {number}
                </span>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    <span className="sr-only">{`Step ${index + 1}: `}</span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
