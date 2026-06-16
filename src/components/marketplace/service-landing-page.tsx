import { ServiceViewTracker } from "@/components/marketplace/service-view-tracker";
import { ServiceLandingHero } from "@/components/marketplace/service-landing-hero";
import { TrustSafetySection } from "@/components/sections/trust-safety-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { SessionConfiguratorSection } from "@/components/sections/session-configurator-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { isEnabled } from "@/lib/flags/resolve";
import type { ServiceLandingConfig } from "@/lib/services/landing";
import type { TestimonialItem } from "@/lib/brand/types";

export interface ServiceLandingPageProps {
  config: ServiceLandingConfig;
  /** Pre-formatted starting price (derived from pricing engine), e.g. "From $109.00". */
  priceLabel?: string;
  /** Service category, for the service_view analytics event. */
  category?: string;
  /** Starting price in minor units + currency, for analytics. */
  price?: number;
  currency?: string;
  /** Brand-level testimonials, used unless the service overrides them. */
  fallbackTestimonials?: {
    heading?: string;
    subheading?: string;
    items: TestimonialItem[];
  };
}

/**
 * Generic, config-driven service landing page. Composes the shared sections;
 * every section except the hero/CTA is optional and only renders when the
 * config provides it. Adding a new service page requires NO changes here.
 */
export function ServiceLandingPage({
  config,
  priceLabel,
  category,
  price,
  currency,
  fallbackTestimonials,
}: ServiceLandingPageProps) {
  const testimonials = config.testimonials ?? fallbackTestimonials;

  return (
    <>
      <ServiceViewTracker
        serviceId={config.slug}
        category={category}
        price={price}
        currency={currency}
      />

      <ServiceLandingHero
        eyebrow={config.hero.eyebrow}
        title={config.hero.title}
        subtitle={config.hero.subtitle}
        priceLabel={priceLabel}
        primaryCta={config.hero.primaryCta}
        secondaryCta={config.hero.secondaryCta}
        trustIndicators={config.hero.trustIndicators}
        image={config.hero.image}
      />

      {config.trust ? (
        <TrustSafetySection
          heading={config.trust.heading}
          subheading={config.trust.subheading}
          columns={config.trust.columns}
          items={config.trust.items}
        />
      ) : null}

      {config.timeline ? (
        <HowItWorksSection
          heading={config.timeline.heading}
          subheading={config.timeline.subheading}
          steps={config.timeline.steps}
        />
      ) : null}

      {config.configurator ? (
        <SessionConfiguratorSection
          heading={config.configurator.heading}
          subheading={config.configurator.subheading}
          groups={config.configurator.groups}
          cta={config.configurator.cta}
        />
      ) : null}

      {config.benefits ? (
        <BenefitsSection
          heading={config.benefits.heading}
          subheading={config.benefits.subheading}
          items={config.benefits.items}
        />
      ) : null}

      {isEnabled("testimonials") && testimonials ? (
        <TestimonialsSection
          heading={testimonials.heading}
          subheading={testimonials.subheading}
          items={testimonials.items}
        />
      ) : null}

      {config.faq ? (
        <FaqSection
          heading={config.faq.heading}
          items={config.faq.items}
          viewAll={config.faq.viewAll}
        />
      ) : null}

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
