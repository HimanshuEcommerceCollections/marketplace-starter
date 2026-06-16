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
import { isEnabled } from "@/lib/flags/resolve";

export default function HomePage() {
  const content = getBrandContent();
  const services = getServices();

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
        <ServicesGridSection {...content.servicesSection} services={services} />
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
