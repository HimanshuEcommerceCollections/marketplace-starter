import { Container } from "@/components/layout/container";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Surface } from "@/lib/services/landing";

export interface NoticeSectionProps {
  /** Lucide icon name for the leading badge. Defaults to "DollarSign". */
  icon?: string;
  heading: string;
  body: string;
  /** Optional tag pill on the trailing edge, e.g. "Helpful Info". */
  tag?: string;
  surface?: Surface;
}

/**
 * Highlighted callout band — leading icon badge, heading + body, optional tag
 * pill (e.g. a minimum-booking notice). Server component, token-only.
 * Desktop: row · Mobile: stacked.
 */
export function NoticeSection({
  icon = "DollarSign",
  heading,
  body,
  tag,
  surface = "default",
}: NoticeSectionProps) {
  const Icon = getIcon(icon);

  return (
    <section
      aria-labelledby="notice-heading"
      className={cn("py-12 md:py-16", surface === "muted" && "bg-muted")}
    >
      <Container>
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:gap-6 md:p-8">
          <span
            aria-hidden
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <Icon className="size-6" strokeWidth={1.75} />
          </span>

          <div className="flex-1">
            <h2
              id="notice-heading"
              className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl"
            >
              {heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              {body}
            </p>
          </div>

          {tag ? (
            <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-highlight/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-highlight">
              {tag}
            </span>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
