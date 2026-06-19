import { HeroSection } from "@/components/sections/hero-section";
import { TrustSafetySection } from "@/components/sections/trust-safety-section";
import { ServicesGridSection } from "@/components/sections/services-grid-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ComparisonSection } from "@/components/sections/comparison-section";
import { CorporateSection } from "@/components/sections/corporate-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { getBrandContent } from "@/lib/brand/load";
import { getServices } from "@/lib/catalog/load";
import { serviceToGridCard } from "@/lib/catalog/cards";
import {
  fetchPublicCategories,
  categoryToGridCard,
} from "@/lib/catalog/categories-api";
import { isEnabled } from "@/lib/flags/resolve";

// ISR: re-fetch the live categories periodically. The component still renders
// (via the static fallback) if the API is unreachable at build/request time.
export const revalidate = 60;

export default async function HomePage() {
  const content = getBrandContent();
  // Live categories from the API; fall back to the static catalog if it's down.
  const apiCategories = await fetchPublicCategories();
  const serviceCards = apiCategories
    ? apiCategories.map(categoryToGridCard)
    : getServices().map(serviceToGridCard);

  return (
    <>
      <HeroSection {...content.hero} />

      {content.trustProcess ? (
        <TrustSafetySection
          {...content.trustProcess}
          headingClassName="font-display text-display font-bold text-foreground"
        />
      ) : null}

      {content.servicesSection ? (
        <ServicesGridSection {...content.servicesSection} cards={serviceCards} />
      ) : null}

      {content.howItWorks ? <HowItWorksSection {...content.howItWorks} /> : null}

      {isEnabled("testimonials") ? (
        <TestimonialsSection {...content.testimonials} />
      ) : null}

      {content.comparison ? <ComparisonSection {...content.comparison} /> : null}

      {content.corporate ? <CorporateSection {...content.corporate} /> : null}

      {content.finalCta ? <FinalCtaSection {...content.finalCta} /> : null}
    </>
  );
}
