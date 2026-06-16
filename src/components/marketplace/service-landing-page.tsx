import { ServiceViewTracker } from "@/components/marketplace/service-view-tracker";
import { ServiceLandingHero } from "@/components/marketplace/service-landing-hero";
import { TrustSafetySection } from "@/components/sections/trust-safety-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { ProcessStepsSection } from "@/components/sections/process-steps-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { JourneyStepperSection } from "@/components/sections/journey-stepper-section";
import { SessionConfiguratorSection } from "@/components/sections/session-configurator-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { isEnabled } from "@/lib/flags/resolve";
import type { ServiceLandingConfig, ServiceSection } from "@/lib/services/landing";
import type { TestimonialItem } from "@/lib/brand/types";

export interface ServiceLandingPageProps {
  config: ServiceLandingConfig;
  /** Pre-formatted starting price (from the pricing engine), e.g. "From $79.00". */
  priceLabel?: string;
  category?: string;
  price?: number;
  currency?: string;
  /** Brand testimonials, used when a testimonials section omits its own items. */
  fallbackTestimonials?: {
    heading?: string;
    subheading?: string;
    items: TestimonialItem[];
  };
}

/**
 * Generic, config-driven service landing page. Renders the hero, then maps the
 * ordered `sections[]` to reusable section components. Adding/redesigning a
 * service page is pure configuration — no changes here.
 */
export function ServiceLandingPage({
  config,
  priceLabel,
  category,
  price,
  currency,
  fallbackTestimonials,
}: ServiceLandingPageProps) {
  const renderSection = (section: ServiceSection, index: number) => {
    const key = `${section.type}-${index}`;

    switch (section.type) {
      case "cards":
        return section.variant === "stacked" ? (
          <BenefitsSection
            key={key}
            heading={section.heading}
            subheading={section.subheading}
            columns={section.columns}
            items={section.items}
            surface={section.surface}
          />
        ) : (
          <TrustSafetySection
            key={key}
            heading={section.heading}
            subheading={section.subheading}
            columns={section.columns}
            items={section.items}
            surface={section.surface}
          />
        );

      case "processCards":
        return (
          <ProcessStepsSection
            key={key}
            heading={section.heading}
            subheading={section.subheading}
            columns={section.columns}
            steps={section.steps}
            surface={section.surface}
          />
        );

      case "timeline":
        return (
          <HowItWorksSection
            key={key}
            heading={section.heading ?? ""}
            subheading={section.subheading}
            steps={section.steps}
            surface={section.surface}
          />
        );

      case "stepper":
        return (
          <JourneyStepperSection
            key={key}
            heading={section.heading}
            subheading={section.subheading}
            steps={section.steps}
            activeIndex={section.activeIndex}
            surface={section.surface}
          />
        );

      case "configurator":
        return (
          <SessionConfiguratorSection
            key={key}
            variant={section.variant}
            heading={section.heading}
            subheading={section.subheading}
            groups={section.groups}
            cta={section.cta}
            surface={section.surface}
          />
        );

      case "testimonials": {
        const data = section.items
          ? { heading: section.heading, subheading: section.subheading, items: section.items }
          : fallbackTestimonials;
        if (!isEnabled("testimonials") || !data) return null;
        return (
          <TestimonialsSection
            key={key}
            heading={section.heading ?? data.heading}
            subheading={section.subheading ?? data.subheading}
            items={data.items}
            surface={section.surface}
          />
        );
      }

      case "faq":
        return (
          <FaqSection
            key={key}
            heading={section.heading}
            items={section.items}
            viewAll={section.viewAll}
            surface={section.surface}
          />
        );

      case "cta":
        return (
          <FinalCtaSection
            key={key}
            eyebrow={section.eyebrow}
            title={section.title}
            body={section.body}
            primaryCta={section.primaryCta}
            secondaryCta={section.secondaryCta}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ServiceViewTracker
        serviceId={config.slug}
        category={category}
        price={price}
        currency={currency}
      />

      <ServiceLandingHero
        variant={config.hero.variant}
        eyebrow={config.hero.eyebrow}
        title={config.hero.title}
        subtitle={config.hero.subtitle}
        priceLabel={priceLabel}
        primaryCta={config.hero.primaryCta}
        secondaryCta={config.hero.secondaryCta}
        trustIndicators={config.hero.trustIndicators}
        image={config.hero.image}
      />

      {config.sections.map(renderSection)}
    </>
  );
}
