import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { cn } from "@/lib/utils";
import type { FaqItem, NavItem } from "@/lib/brand/types";
import type { Surface } from "@/lib/services/landing";

export interface FaqSectionProps {
  heading?: string;
  /** With items → accordion; without → just the "view all" link. */
  items?: FaqItem[];
  viewAll?: NavItem;
  surface?: Surface;
}

/** FAQ section — optional heading + accordion + optional "view all" link. */
export function FaqSection({
  heading,
  items,
  viewAll,
  surface = "default",
}: FaqSectionProps) {
  const hasAccordion = !!items && items.length > 0;

  return (
    <section
      aria-labelledby={heading ? "faq-section-heading" : undefined}
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container size="md">
        {heading ? (
          <h2
            id="faq-section-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            {heading}
          </h2>
        ) : null}

        {hasAccordion ? (
          <div className={cn(heading && "mt-8")}>
            <FaqAccordion items={items!} />
          </div>
        ) : null}

        {viewAll ? (
          <div className={cn(hasAccordion || heading ? "mt-8" : undefined)}>
            {hasAccordion ? (
              <Button asChild variant="outline">
                <Link href={viewAll.href}>{viewAll.label}</Link>
              </Button>
            ) : (
              <Button asChild variant="link" className="px-0">
                <Link href={viewAll.href}>
                  {viewAll.label}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            )}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
