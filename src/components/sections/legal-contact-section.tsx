import Link from "next/link";
import { Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icons";
import type { LegalContactConfig } from "@/lib/legal/page";

export type LegalContactSectionProps = LegalContactConfig;

/**
 * "Questions About This Policy / These Terms?" support callout — centered
 * heading + body, an optional response-time chip, an optional contact card
 * (Privacy), and optional action buttons (Terms). Server component, token-only.
 */
export function LegalContactSection({
  heading,
  body,
  note,
  card,
  actions,
}: LegalContactSectionProps) {
  const Icon = card ? getIcon(card.icon) : null;

  return (
    <section
      aria-labelledby="legal-contact-heading"
      className="py-16 md:py-20 lg:py-28"
    >
      <Container size="md">
        <div className="text-center">
          <h2
            id="legal-contact-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            {heading}
          </h2>
          {body ? (
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {body}
            </p>
          ) : null}
          {note ? (
            <span className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Clock aria-hidden className="size-3.5 text-highlight" />
              {note}
            </span>
          ) : null}
        </div>

        {card && Icon ? (
          <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-muted p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground"
              >
                <Icon className="size-6" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {card.email}
                </p>
                {card.note ? (
                  <span className="mt-3 inline-flex items-center rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {card.note}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {actions && actions.length > 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {actions.map((action, i) => (
              <Button
                key={action.href}
                asChild
                size="lg"
                variant={i === 0 ? "default" : "outline"}
                className="w-full sm:w-auto"
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
