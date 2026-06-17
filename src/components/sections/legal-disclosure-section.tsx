import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icons";
import type { LegalDisclosureConfig } from "@/lib/legal/page";

export type LegalDisclosureSectionProps = LegalDisclosureConfig;

/**
 * "Marketplace Disclosure" block — a bordered panel of regulatory disclosure
 * placeholders, each a card with an icon, title, pending status, and a status
 * pill. Structural placeholder only; no legal representations are made. Server
 * component, token-only.
 */
export function LegalDisclosureSection({
  eyebrow,
  heading,
  body,
  items,
  note,
}: LegalDisclosureSectionProps) {
  return (
    <section
      aria-labelledby="legal-disclosure-heading"
      className="pb-16 md:pb-20 lg:pb-28"
    >
      <Container>
        <div className="rounded-2xl border border-border bg-secondary/30 p-6 md:p-8 lg:p-10">
          {eyebrow ? (
            <Badge variant="secondary" className="mb-4 w-fit">
              {eyebrow}
            </Badge>
          ) : null}

          <h2
            id="legal-disclosure-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            {heading}
          </h2>
          {body ? (
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              {body}
            </p>
          ) : null}

          <ul className="mt-6 space-y-3">
            {items.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <li
                  key={item.title}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 md:p-5"
                >
                  <span
                    aria-hidden
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  {item.badge ? (
                    <Badge variant="warning" className="shrink-0">
                      {item.badge}
                    </Badge>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {note ? (
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              {note}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
