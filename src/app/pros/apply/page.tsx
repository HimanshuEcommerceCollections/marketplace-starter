import type { Metadata } from "next";
import { PartnerLandingPage } from "@/components/marketplace/partner-landing-page";
import { getPartnerLanding } from "@/lib/brand/load";
import { getServices } from "@/lib/catalog/load";
import type { FeatureItem } from "@/lib/brand/types";

export const metadata: Metadata = {
  title: "Become a Pro",
  description:
    "Partner with us to connect with clients seeking premium in-home wellness services.",
};

export default function ProApplyPage() {
  const partner = getPartnerLanding();
  const services = getServices();

  const whoItems: FeatureItem[] = services.map((s) => ({
    icon: s.icon,
    title: s.title,
    description: s.summary,
    badge: s.coming_soon ? "Coming Soon" : undefined,
  }));
  const categories = services.map((s) => s.title);

  return (
    <PartnerLandingPage
      config={partner}
      whoItems={whoItems}
      categories={categories}
    />
  );
}
