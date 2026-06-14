import { Container } from "@/components/layout/container";
import { PricingTierCard, type PricingTier } from "./pricing-tier-card";

export interface PricingTableProps {
  heading?: string;
  subheading?: string;
  tiers: PricingTier[];
}

/**
 * PROOF element: every tier shows a [Sample] badge and prices are illustrative
 * (sourced from pricing.v1.json sample values). No fabricated claims.
 */
export function PricingTable({ heading, subheading, tiers }: PricingTableProps) {
  return (
    <section className="py-12 md:py-16" aria-labelledby="pricing-heading">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 id="pricing-heading" className="text-2xl font-bold md:text-3xl">
            {heading ?? "Pricing"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {subheading ??
              "Illustrative [Sample] pricing — not a real quote. INTERNAL DRAFT."}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <PricingTierCard key={tier.id} tier={tier} />
          ))}
        </div>
      </Container>
    </section>
  );
}
