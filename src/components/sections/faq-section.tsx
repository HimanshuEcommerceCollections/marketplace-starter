import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import type { FaqItem, NavItem } from "@/lib/brand/types";

export interface FaqSectionProps {
  heading: string;
  items: FaqItem[];
  /** Optional link to the full FAQ page. */
  viewAll?: NavItem;
}

/** FAQ section — section heading + accordion + optional "view all" link. */
export function FaqSection({ heading, items, viewAll }: FaqSectionProps) {
  return (
    <section aria-labelledby="faq-section-heading" className="py-16 md:py-20 lg:py-28">
      <Container size="md">
        <h2
          id="faq-section-heading"
          className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        >
          {heading}
        </h2>
        <div className="mt-8">
          <FaqAccordion items={items} />
        </div>
        {viewAll ? (
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href={viewAll.href}>{viewAll.label}</Link>
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
