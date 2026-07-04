import Link from "next/link";
import { Check, Info } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { PricingTier, Surface } from "@/lib/services/landing";

export interface PricingTiersSectionProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  draftNote?: string;
  tiers: PricingTier[];
  surface?: Surface;
}

/** Whole-dollar display, e.g. 16500 USD -> "$165" (drops a trailing ".00"). */
function priceLabel(price: PricingTier["price"]): string {
  return formatMoney(price).replace(/\.00$/, "");
}

/**
 * "Session Pricing" — side-by-side draft pricing tiers. Server component,
 * token-only. Featured tiers use the dark (inverse) treatment; every price
 * carries a "Draft" pill. Each card CTA typically joins
 * the interest list for a coming-soon service.
 * Desktop: row of cards · Mobile: stacked.
 */
export function PricingTiersSection({
  eyebrow,
  heading,
  subheading,
  draftNote,
  tiers,
  surface = "default",
}: PricingTiersSectionProps) {
  return (
    <section
      aria-labelledby={heading ? "pricing-tiers-heading" : undefined}
      className={cn("py-16 md:py-20 lg:py-28", surface === "muted" && "bg-muted")}
    >
      <Container>
        {heading || eyebrow || subheading ? (
          <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            {heading ? (
              <h2
                id="pricing-tiers-heading"
                className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
              >
                {heading}
              </h2>
            ) : null}
            {subheading ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {subheading}
              </p>
            ) : null}
          </div>
        ) : null}

        {draftNote ? (
          <p className="mx-auto mb-10 flex max-w-3xl items-center justify-center gap-2 rounded-lg bg-notice/10 px-4 py-2.5 text-center font-sans text-xs font-semibold uppercase leading-tight tracking-label text-notice md:mb-12">
            <Info className="size-4 shrink-0" aria-hidden />
            {draftNote}
          </p>
        ) : null}

        <ul
          role="list"
          className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2"
        >
          {tiers.map((tier) => {
            const featured = tier.featured;
            return (
              <li key={tier.name}>
                <Card
                  className={cn(
                    "flex h-full flex-col gap-5 rounded-2xl p-6 md:p-8",
                    featured
                      ? "border-transparent bg-surface-inverse text-surface-inverse-foreground"
                      : "border-border bg-card",
                  )}
                >
                  {tier.badge ? (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "w-fit uppercase tracking-wide",
                        featured &&
                          "bg-surface-inverse-foreground/10 text-surface-inverse-foreground",
                      )}
                    >
                      {tier.badge}
                    </Badge>
                  ) : null}

                  <div>
                    <h3
                      className={cn(
                        "font-heading text-xl font-semibold",
                        featured
                          ? "text-surface-inverse-foreground"
                          : "text-foreground",
                      )}
                    >
                      {tier.name}
                    </h3>

                    <p className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "text-sm",
                          featured
                            ? "text-surface-inverse-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        From
                      </span>
                      <span className="font-heading text-3xl font-semibold text-highlight">
                        {priceLabel(tier.price)}
                      </span>
                      <Badge variant="secondary" className="uppercase tracking-wide">
                        Estimate
                      </Badge>
                    </p>

                    {tier.duration ? (
                      <p
                        className={cn(
                          "mt-2 text-sm",
                          featured
                            ? "text-surface-inverse-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        Duration: {tier.duration}
                      </p>
                    ) : null}
                  </div>

                  <div
                    className={cn(
                      "border-t pt-5",
                      featured ? "border-surface-inverse-foreground/15" : "border-border",
                    )}
                  >
                    <p
                      className={cn(
                        "mb-3 text-xs font-semibold uppercase tracking-wide",
                        featured
                          ? "text-surface-inverse-foreground/70"
                          : "text-muted-foreground",
                      )}
                    >
                      What&apos;s included
                    </p>
                    <ul role="list" className="flex flex-col gap-2.5">
                      {tier.included.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm">
                          <span
                            aria-hidden
                            className={cn(
                              "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full",
                              featured
                                ? "bg-highlight/20 text-highlight"
                                : "bg-primary/10 text-primary",
                            )}
                          >
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                          <span
                            className={cn(
                              "leading-relaxed",
                              featured
                                ? "text-surface-inverse-foreground/85"
                                : "text-foreground",
                            )}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tier.footnote ? (
                    <p
                      className={cn(
                        "rounded-lg px-3 py-2 text-xs leading-relaxed",
                        featured
                          ? "bg-surface-inverse-foreground/5 text-surface-inverse-foreground/70"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {tier.footnote}
                    </p>
                  ) : null}

                  {tier.cta ? (
                    <div className="mt-auto pt-1">
                      <Button
                        asChild
                        variant={featured ? "default" : "outline"}
                        className={cn(
                          "w-full",
                          featured &&
                            "bg-highlight text-highlight-foreground hover:bg-highlight/90 focus-visible:ring-offset-surface-inverse",
                        )}
                      >
                        <Link href={tier.cta.href}>{tier.cta.label}</Link>
                      </Button>
                    </div>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
