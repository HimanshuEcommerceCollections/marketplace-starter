import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/catalog/types";
import { serviceToGridCard, type GridCard } from "@/lib/catalog/cards";

export interface ServicesGridSectionProps {
  heading: string;
  subheading?: string;
  draftNote?: string;
  /** Pre-adapted cards (e.g. fetched from the API). Takes precedence. */
  cards?: GridCard[];
  /** Raw catalog services, adapted to cards internally (static callers). */
  services?: Service[];
}

/** Services marketplace grid. Server component, token-only, data-driven. */
export function ServicesGridSection({
  heading,
  subheading,
  draftNote,
  cards,
  services,
}: ServicesGridSectionProps) {
  const items: GridCard[] = cards ?? (services ?? []).map(serviceToGridCard);
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="bg-muted py-16 md:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center">
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
        </div>

        {draftNote ? (
          <p className="mb-10 w-full rounded-lg bg-notice/10 px-4 py-2.5 text-center font-sans text-xs font-semibold uppercase leading-none tracking-label text-notice md:mb-12">
            {draftNote}
          </p>
        ) : null}

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((service) => {
            const Icon = getIcon(service.icon);
            const comingSoon = service.comingSoon;
            const priceLabel = service.priceLabel;
            const card = (
              <Card
                className={cn(
                  "flex h-full flex-col gap-2 rounded-md px-6 py-7 transition",
                  comingSoon
                    ? "bg-transparent shadow-none"
                    : "group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md",
                )}
              >
                {comingSoon ? (
                  <Badge variant="secondary" className="mb-1 w-fit">
                    Coming Soon
                  </Badge>
                ) : null}

                <span
                  className={cn(
                    "mb-1 inline-flex w-fit items-center justify-center rounded-lg p-2",
                    comingSoon
                      ? "bg-muted-foreground/10 text-muted-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                </span>

                <h3
                  className={cn(
                    "font-heading text-lg font-semibold leading-tight",
                    comingSoon ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {service.title}
                </h3>

                {!comingSoon && priceLabel ? (
                  <p className="text-sm">
                    <span className="text-muted-foreground">From </span>
                    <span className="font-semibold text-highlight">
                      {priceLabel}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground">
                    Coming Soon
                  </p>
                )}

                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {service.summary}
                </p>
              </Card>
            );

            return (
              <li key={service.id}>
                <Link
                  href={service.href}
                  aria-label={`View ${service.title}`}
                  className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {card}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
