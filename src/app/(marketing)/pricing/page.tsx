import type { Metadata } from "next";
import { PricingLandingPage } from "@/components/marketing/pricing-landing-page";
import { getPricingPage } from "@/lib/brand/load";
import { getServices } from "@/lib/catalog/load";
import { getPricingTable } from "@/lib/pricing/load";
import { computePrice } from "@/lib/pricing/engine";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent draft pricing. Final pricing is confirmed during booking.",
};

export default function PricingPage() {
  const config = getPricingPage();
  const services = getServices();
  const table = getPricingTable();

  // "From $X" for each active service, sourced from the pricing engine.
  const priceLabels: Record<string, string> = {};
  for (const s of services) {
    if (s.coming_soon) continue;
    const breakdown = computePrice(table, {
      service_id: s.id,
      selections: {},
      quantity: 1,
    });
    priceLabels[s.id] =
      `From ${formatMoney(breakdown.total).replace(/\.00$/, "")}`;
  }

  return (
    <PricingLandingPage
      config={config}
      services={services}
      priceLabels={priceLabels}
    />
  );
}
