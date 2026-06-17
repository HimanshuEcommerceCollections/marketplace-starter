import { Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { FeatureItem } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface CoordinatorSectionProps {
  heading: string;
  subheading?: string;
  card: { icon?: string; title: string; description: string; note?: string };
  items: FeatureItem[];
  surface?: Surface;
}

/**
 * Two-column "Why a Coordinator Is Involved" section: a dark info card on the
 * left, a list of responsibilities on the right. Server component, token-only.
 */
export function CoordinatorSection({
  heading,
  subheading,
  card,
  items,
  surface = "default",
}: CoordinatorSectionProps) {
  const CardIcon = getIcon(card.icon);

  return (
    <section
      aria-labelledby="coordinator-heading"
      className={cn("py-16 md:py-20 lg:py-28", surface === "muted" && "bg-muted")}
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="coordinator-heading"
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

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Coordinator card */}
          <div>
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
              <p className="mt-2 leading-relaxed text-surface-inverse-foreground/80">
                {card.description}
              </p>
            </div>
            {card.note ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 shrink-0 text-highlight" aria-hidden />
                {card.note}
              </p>
            ) : null}
          </div>

          {/* Responsibilities */}
          <ul className="space-y-4">
            {items.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <li
                  key={item.title}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
