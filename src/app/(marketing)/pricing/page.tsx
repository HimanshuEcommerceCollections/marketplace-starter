import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PricingTable } from "@/components/marketing/pricing-table";
import type { PricingTier } from "@/components/marketing/pricing-tier-card";
import { getServices } from "@/lib/catalog/load";
import { getPricingTable } from "@/lib/pricing/load";
import { computePrice } from "@/lib/pricing/engine";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  const table = getPricingTable();
  const tiers: PricingTier[] = getServices()
    .slice(0, 3)
    .map((s, i) => {
      const breakdown = computePrice(table, {
        service_id: s.id,
        selections: {},
        quantity: 1,
      });
      return {
        id: s.id,
        name: s.title,
        priceLabel: formatMoney(breakdown.total),
        description: s.summary,
        features: s.config_options
          .slice(0, 4)
          .map((o) => ({ label: o.label, included: true })),
        highlighted: i === 1,
        cta: { label: "Book", href: `/book?service=${s.id}` },
      };
    });

  return (
    <>
      <Container className="pt-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
        <p className="mx-auto mt-2 max-w-prose text-muted-foreground">
          Illustrative [Sample] pricing — not a real quote. INTERNAL DRAFT.
        </p>
      </Container>
      <PricingTable heading="Plans" tiers={tiers} />
    </>
  );
}
