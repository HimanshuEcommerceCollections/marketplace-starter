import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { ServiceLandingHero } from "./service-landing-hero";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { ProApplyForm } from "@/components/forms/pro-apply-form";
import { isEnabled } from "@/lib/flags/resolve";
import type { PartnerLandingConfig } from "@/lib/partner/landing";
import type { FeatureItem } from "@/lib/brand/types";

export interface PartnerLandingPageProps {
  config: PartnerLandingConfig;
  /** "Who We Work With" cards, derived from the service catalog. */
  whoItems: FeatureItem[];
  /** Service-category options for the application form. */
  categories: string[];
}

/**
 * "Partner with Elevate" (Become a Pro) page — a config-driven composition of
 * the shared section components plus the stub application form. Renders inside
 * the site chrome (navbar + footer).
 */
export function PartnerLandingPage({
  config,
  whoItems,
  categories,
}: PartnerLandingPageProps) {
  return (
    <>
      <ServiceLandingHero
        variant={config.hero.variant}
        eyebrow={config.hero.eyebrow}
        title={config.hero.title}
        subtitle={config.hero.subtitle}
        primaryCta={config.hero.primaryCta}
        secondaryCta={config.hero.secondaryCta}
        image={config.hero.image}
      />

      <BenefitsSection
        heading={config.whoWeWorkWith.heading}
        subheading={config.whoWeWorkWith.subheading}
        columns={4}
        items={whoItems}
        surface="muted"
      />

      <BenefitsSection
        heading={config.whyPartner.heading}
        subheading={config.whyPartner.subheading}
        columns={4}
        items={config.whyPartner.items}
      />

      <HowItWorksSection
        heading={config.process.heading}
        subheading={config.process.subheading}
        steps={config.process.steps}
        surface="muted"
      />

      <BenefitsSection
        heading={config.standards.heading}
        subheading={config.standards.subheading}
        columns={4}
        items={config.standards.items}
      />

      <section id="apply" className="bg-muted py-16 md:py-20 lg:py-28">
        <Container size="md">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {config.apply.heading}
            </h2>
            {config.apply.subheading ? (
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {config.apply.subheading}
              </p>
            ) : null}
          </div>
          <Card className="rounded-2xl p-6 md:p-8">
            {isEnabled("proApplyForm") ? (
              <ProApplyForm categories={categories} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Applications are currently closed.
              </p>
            )}
          </Card>
        </Container>
      </section>

      <TestimonialsSection
        heading={config.testimonials.heading}
        subheading={config.testimonials.subheading}
        items={config.testimonials.items}
        surface="default"
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
