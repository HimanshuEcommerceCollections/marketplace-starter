import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleBadge } from "@/components/shared/sample-badge";
import { getIcon } from "@/lib/icons";
import { formatMoney } from "@/lib/money";
import type { Service } from "@/lib/catalog/types";

export interface ServicesGridSectionProps {
  heading: string;
  subheading?: string;
  draftNote?: string;
  services: Service[];
}

/** Services marketplace grid. Server component, token-only, data-driven. */
export function ServicesGridSection({
  heading,
  subheading,
  draftNote,
  services,
}: ServicesGridSectionProps) {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="services-section bg-muted py-16 md:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2
            id="services-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            {heading}
          </h2>
          {subheading ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          ) : null}
          {draftNote ? (
            <p className="mx-auto mt-6 w-fit max-w-full rounded-full bg-highlight/10 px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-highlight">
              {draftNote}
            </p>
          ) : null}
        </div>

        <ul
          role="list"
          className="services-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <li key={service.id} className={service.coming_soon ? "service-card-coming-soon" : "service-card"}>
                <Card className="flex h-full flex-col gap-3 rounded-xl p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2.5 text-primary">
                      <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                    </span>
                    {service.coming_soon ? (
                      <Badge variant="secondary">Coming Soon</Badge>
                    ) : null}
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>

                  <div className="mt-auto pt-2">
                    {!service.coming_soon && service.from_price != null ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm">
                          <span className="text-muted-foreground">From </span>
                          <span className="font-semibold text-highlight">
                            {formatMoney({
                              amount: service.from_price,
                              currency: service.currency,
                            })}
                          </span>
                        </p>
                        <SampleBadge />
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-muted-foreground">
                        Availability coming soon
                      </p>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
