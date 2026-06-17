import { ServiceLandingHero } from "@/components/marketplace/service-landing-hero";
import { MissionSection } from "@/components/sections/mission-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { ServicesGridSection } from "@/components/sections/services-grid-section";
import { ServiceAreaSection } from "@/components/sections/service-area-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import type { AboutPageConfig } from "@/lib/about/page";
import type { Service } from "@/lib/catalog/types";

export interface AboutLandingPageProps {
  config: AboutPageConfig;
  /** Service catalog, rendered as the "Our Service Categories" grid. */
  services: Service[];
}

/**
 * "About" page — a config-driven composition of the shared section components.
 * Renders inside the site chrome (navbar + footer).
 */
export function AboutLandingPage({ config, services }: AboutLandingPageProps) {
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

      <MissionSection
        heading={config.mission.heading}
        paragraphs={config.mission.paragraphs}
        quote={config.mission.quote}
        values={config.mission.values}
      />

      <BenefitsSection
        heading={config.difference.heading}
        subheading={config.difference.subheading}
        columns={4}
        items={config.difference.items}
        surface="muted"
      />

      <BenefitsSection
        heading={config.review.heading}
        subheading={config.review.subheading}
        columns={4}
        items={config.review.items}
        note={config.review.note}
      />

      <ServicesGridSection
        heading={config.serviceCategories.heading}
        subheading={config.serviceCategories.subheading}
        draftNote={config.serviceCategories.draftNote}
        services={services}
      />

      <ServiceAreaSection
        heading={config.serviceArea.heading}
        paragraphs={config.serviceArea.paragraphs}
        mapLabel={config.serviceArea.mapLabel}
        areas={config.serviceArea.areas}
        image={config.serviceArea.image}
      />

      <TestimonialsSection
        heading={config.testimonials.heading}
        subheading={config.testimonials.subheading}
        items={config.testimonials.items}
      />

      <FaqSection
        heading={config.faq.heading}
        items={config.faq.items}
        viewAll={config.faq.viewAll}
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
