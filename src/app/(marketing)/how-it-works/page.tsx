import type { Metadata } from "next";
import { HowItWorksLandingPage } from "@/components/marketing/how-it-works-landing-page";
import { getHowItWorksPage } from "@/lib/brand/load";
import { getServices } from "@/lib/catalog/load";
import { formatMoney } from "@/lib/money";
import type { FeatureItem } from "@/lib/brand/types";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "A simple, guided process designed to make in-home wellness services feel safe, transparent, and easy to schedule.",
};

export default function HowItWorksPage() {
  const config = getHowItWorksPage();
  const services = getServices();

  const servicesItems: FeatureItem[] = services.map((s) => ({
    icon: s.icon,
    title: s.title,
    description:
      s.from_price != null
        ? `From ${formatMoney({ amount: s.from_price, currency: s.currency }).replace(/\.00$/, "")}`
        : "",
    badge: s.coming_soon ? "Coming Soon" : undefined,
  }));

  return (
    <HowItWorksLandingPage config={config} servicesItems={servicesItems} />
  );
}
