import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { InterestListForm } from "@/components/forms/interest-list-form";
import { getIcon } from "@/lib/icons";
import { isEnabled } from "@/lib/flags/resolve";
import { cn } from "@/lib/utils";
import type { InterestListBullet, Surface } from "@/lib/services/landing";

export interface InterestListSectionProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  serviceId?: string;
  bullets?: InterestListBullet[];
  footnote?: string;
  submitLabel?: string;
  surface?: Surface;
}

/**
 * Interest-list capture band — copy + value-prop bullets beside a stub form.
 * Server component, token-only. Stands in for the booking flow on coming-soon
 * services. Desktop: two columns · Mobile: stacked (copy first).
 */
export function InterestListSection({
  eyebrow,
  heading,
  subheading,
  serviceId,
  bullets,
  footnote,
  submitLabel,
  surface = "muted",
}: InterestListSectionProps) {
  const formEnabled = isEnabled("waitlistForm");

  return (
    <section
      aria-labelledby="interest-list-heading"
      className={cn("py-16 md:py-20 lg:py-28", surface === "muted" && "bg-muted")}
    >
      <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            <h2
              id="interest-list-heading"
              className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {subheading}
              </p>
            ) : null}
          </div>

          {bullets && bullets.length > 0 ? (
            <ul role="list" className="flex flex-col gap-3">
              {bullets.map((bullet) => {
                const Icon = getIcon(bullet.icon);
                return (
                  <li key={bullet.text} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-highlight/10 text-highlight"
                    >
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-sm text-muted-foreground">{bullet.text}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        <Card className="rounded-2xl border-border p-6 md:p-8">
          {formEnabled ? (
            <>
              <InterestListForm serviceId={serviceId} submitLabel={submitLabel} />
              {footnote ? (
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {footnote}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              The interest list is currently closed.
            </p>
          )}
        </Card>
      </Container>
    </section>
  );
}
