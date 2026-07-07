import type { Metadata } from "next";
import { PricingLandingPage } from "@/components/marketing/pricing-landing-page";
import type { PricingServiceCardVM } from "@/components/pricing/pricing-service-grid";
import { getPricingPage } from "@/lib/brand/load";
import { getServices } from "@/lib/catalog/load";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent, all-inclusive pricing. The price you see at booking is the price you pay — tips and travel included.",
};

export default function PricingPage() {
  const config = getPricingPage();
  const services = getServices();

  // Assemble the service cards from the catalog + per-service display extras.
  // Price = the display "from" band (config override, else catalog from_price);
  // coming-soon services keep their coming-soon behavior (route to the waitlist).
  const serviceCards: PricingServiceCardVM[] = services
    .map((s): PricingServiceCardVM | null => {
      const ex = config.services.extras[s.id];
      if (!ex) return null;
      const amount = ex.priceMinor ?? s.from_price ?? 0;
      return {
        slug: s.id,
        title: ex.title ?? s.title,
        icon: s.icon,
        price: formatMoney({ amount, currency: s.currency }).replace(/\.00$/, ""),
        duration: ex.duration,
        points: ex.points,
        coordinator: !!ex.coordinator,
        ctaLabel: s.coming_soon
          ? config.services.ctaComingSoon
          : config.services.ctaActive,
        href: s.coming_soon
          ? `/waitlist?service=${s.id}`
          : `/book?service=${s.id}`,
      };
    })
    .filter((c): c is PricingServiceCardVM => c !== null);

  return <PricingLandingPage config={config} serviceCards={serviceCards} />;
}
