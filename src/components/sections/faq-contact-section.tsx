import Link from "next/link";
import { Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/brand/types";
import type { FaqSupportPoint } from "@/lib/faq/page";

export interface FaqContactSectionProps {
  heading: string;
  body?: string;
  note?: string;
  primaryCta?: NavItem;
  secondaryCta?: NavItem;
  card: {
    icon?: string;
    title: string;
    description?: string;
    availability: FaqSupportPoint[];
  };
  surface?: "default" | "muted";
}

/**
 * "Still Have Questions?" support band — copy + CTAs on the left, a dark
 * coordinator availability card on the right. Server component, token-only.
 */
export function FaqContactSection({
  heading,
  body,
  note,
  primaryCta,
  secondaryCta,
  card,
  surface = "muted",
}: FaqContactSectionProps) {
  const CardIcon = getIcon(card.icon);

  return (
    <section
      aria-labelledby="faq-contact-heading"
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2
              id="faq-contact-heading"
              className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              {heading}
            </h2>
            {body ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {body}
              </p>
            ) : null}
            {note ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock aria-hidden className="size-4 shrink-0 text-highlight" />
                {note}
              </p>
            ) : null}

            {primaryCta || secondaryCta ? (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {primaryCta ? (
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href={primaryCta.href}>{primaryCta.label}</Link>
                  </Button>
                ) : null}
                {secondaryCta ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl bg-surface-inverse p-8 text-surface-inverse-foreground">
            <span
              aria-hidden
              className="inline-flex size-12 items-center justify-center rounded-full bg-surface-inverse-foreground/10 text-surface-inverse-foreground"
            >
              <CardIcon className="size-6" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 font-heading text-xl font-semibold">
              {card.title}
            </h3>
            {card.description ? (
              <p className="mt-2 leading-relaxed text-surface-inverse-foreground/80">
                {card.description}
              </p>
            ) : null}
            {card.availability.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {card.availability.map((point) => {
                  const Icon = getIcon(point.icon);
                  return (
                    <li
                      key={point.label}
                      className="flex items-center gap-3 text-sm text-surface-inverse-foreground/90"
                    >
                      <span
                        aria-hidden
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-inverse-foreground/10"
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                      </span>
                      {point.label}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
