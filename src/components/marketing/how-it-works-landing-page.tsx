import { ServiceLandingHero } from "@/components/marketplace/service-landing-hero";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { CoordinatorSection } from "@/components/sections/coordinator-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import type { HowItWorksPageConfig } from "@/lib/how-it-works/page";
import type { FeatureItem } from "@/lib/brand/types";

export interface HowItWorksLandingPageProps {
  config: HowItWorksPageConfig;
  /** "Services We Cover" cards, derived from the catalog (price as description). */
  servicesItems: FeatureItem[];
}

export function HowItWorksLandingPage({
  config,
  servicesItems,
}: HowItWorksLandingPageProps) {
  return (
    <>
      <ServiceLandingHero
        variant={config.hero.variant}
        eyebrow={config.hero.eyebrow}
        title={config.hero.title}
        subtitle={config.hero.subtitle}
        primaryCta={config.hero.primaryCta}
        secondaryCta={config.hero.secondaryCta}
        trustIndicators={config.hero.trustIndicators}
        image={config.hero.image}
      />

      <HowItWorksSection
        heading={config.journey.heading}
        subheading={config.journey.subheading}
        steps={config.journey.steps}
        note={config.journey.note}
      />

      <BenefitsSection
        heading={config.afterSubmit.heading}
        subheading={config.afterSubmit.subheading}
        columns={4}
        items={config.afterSubmit.items}
        surface="muted"
      />

      <BenefitsSection
        heading={config.review.heading}
        subheading={config.review.subheading}
        columns={4}
        items={config.review.items}
        note={config.review.note}
      />

      <CoordinatorSection
        heading={config.coordinator.heading}
        subheading={config.coordinator.subheading}
        card={config.coordinator.card}
        items={config.coordinator.items}
        surface="muted"
      />

      <BenefitsSection
        heading={config.servicesCovered.heading}
        subheading={config.servicesCovered.subheading}
        columns={4}
        items={servicesItems}
      />

      <FaqSection
        heading={config.faq.heading}
        items={config.faq.items}
        viewAll={config.faq.viewAll}
        surface="muted"
      />

      <TestimonialsSection
        heading={config.testimonials.heading}
        subheading={config.testimonials.subheading}
        items={config.testimonials.items}
        surface="default"
      />

      <FinalCtaSection
        eyebrow={config.cta.eyebrow}
        title={config.cta.title}
        body={config.cta.body}
        primaryCta={config.cta.primaryCta}
        secondaryCta={config.cta.secondaryCta}
      />
    </>
  );
}
