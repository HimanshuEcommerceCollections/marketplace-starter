import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { ServiceLandingHero } from "@/components/marketplace/service-landing-hero";
import { OfferingsSection } from "@/components/sections/offerings-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { CorporateQuoteForm } from "@/components/forms/corporate-quote-form";
import type { CorporatePageConfig } from "@/lib/corporate/page";

export interface CorporateLandingPageProps {
  config: CorporatePageConfig;
}

/**
 * "Corporate Wellness" page — the destination of the Corporate navbar link. A
 * config-driven composition of the shared section components plus the stub
 * corporate-quote form. Renders inside the site chrome (navbar + footer).
 */
export function CorporateLandingPage({ config }: CorporateLandingPageProps) {
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

      <OfferingsSection
        heading={config.offerings.heading}
        subheading={config.offerings.subheading}
        columns={4}
        items={config.offerings.items}
        note={config.offerings.note}
      />

      <BenefitsSection
        heading={config.whoItsFor.heading}
        subheading={config.whoItsFor.subheading}
        columns={4}
        items={config.whoItsFor.items}
        surface="muted"
      />

      <HowItWorksSection
        heading={config.process.heading}
        subheading={config.process.subheading}
        steps={config.process.steps}
        note={config.process.note}
      />

      <BenefitsSection
        heading={config.whyWorkWith.heading}
        subheading={config.whyWorkWith.subheading}
        columns={4}
        items={config.whyWorkWith.items}
        surface="muted"
      />

      <section id="quote" className="py-16 md:py-20 lg:py-28">
        <Container size="md">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {config.quote.heading}
            </h2>
            {config.quote.subheading ? (
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {config.quote.subheading}
              </p>
            ) : null}
          </div>
          <Card className="rounded-2xl p-6 md:p-8">
            <CorporateQuoteForm eventTypes={config.quote.eventTypes} />
          </Card>
        </Container>
      </section>

      <TestimonialsSection
        heading={config.testimonials.heading}
        subheading={config.testimonials.subheading}
        items={config.testimonials.items}
        surface="muted"
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
