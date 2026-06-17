import Link from "next/link";
import { Info } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceLandingHero } from "@/components/marketplace/service-landing-hero";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { PricingCard, type PricingCardProps } from "./pricing-card";
import { getIcon } from "@/lib/icons";
import { formatMoney } from "@/lib/money";
import type { PricingPageConfig } from "@/lib/pricing/page";
import type { Service } from "@/lib/catalog/types";

function money(amount: number, currency: string): string {
  return `From ${formatMoney({ amount, currency }).replace(/\.00$/, "")}`;
}

export interface PricingLandingPageProps {
  config: PricingPageConfig;
  services: Service[];
  /** Pre-formatted "From $X" per active service slug (from the pricing engine). */
  priceLabels: Record<string, string>;
}

export function PricingLandingPage({
  config,
  services,
  priceLabels,
}: PricingLandingPageProps) {
  const extras = config.servicePricing.extras;

  const serviceCards: (PricingCardProps & { slug: string })[] = services.map(
    (s) => {
      const ex = extras[s.id];
      if (s.coming_soon && ex?.comingSoon) {
        return {
          slug: s.id,
          title: s.title,
          icon: s.icon,
          status: "coming-soon",
          tiers: ex.comingSoon.tiers.map((t) => ({
            label: t.label,
            value: money(t.amount, s.currency),
          })),
          comingSoonNote: ex.comingSoon.note,
        };
      }
      return {
        slug: s.id,
        title: s.title,
        icon: s.icon,
        status: s.coming_soon ? "coming-soon" : "active",
        priceLabel: priceLabels[s.id],
        minimumBadge: ex?.minimumBadge,
        minimumNote: ex?.minimumNote,
      };
    },
  );

  const fromCards = config.fromPrices.slugs
    .map((slug) => {
      const s = services.find((x) => x.id === slug);
      const ex = extras[slug]?.comingSoon;
      if (!s || !ex) return null;
      return {
        slug,
        title: s.title,
        icon: s.icon,
        tiers: ex.tiers.map((t) => ({
          label: t.label,
          value: money(t.amount, s.currency),
        })),
        description: ex.description,
        interest: ex.interest,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

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

      {/* Service pricing grid */}
      <section
        aria-labelledby="service-pricing-heading"
        className="py-16 md:py-20 lg:py-28"
      >
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <h2
              id="service-pricing-heading"
              className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              {config.servicePricing.heading}
            </h2>
            {config.servicePricing.subheading ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {config.servicePricing.subheading}
              </p>
            ) : null}
          </div>

          <ul
            role="list"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {serviceCards.map((c) => (
              <li key={c.slug}>
                <PricingCard {...c} />
              </li>
            ))}
          </ul>

          {config.servicePricing.footnote ? (
            <p className="mx-auto mt-8 flex max-w-3xl items-start gap-2 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              {config.servicePricing.footnote}
            </p>
          ) : null}
        </Container>
      </section>

      <BenefitsSection
        heading={config.whatAffects.heading}
        subheading={config.whatAffects.subheading}
        columns={4}
        items={config.whatAffects.items}
        surface="muted"
      />

      {/* Why FROM prices */}
      <section
        aria-labelledby="from-prices-heading"
        className="py-16 md:py-20 lg:py-28"
      >
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <h2
              id="from-prices-heading"
              className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
            >
              {config.fromPrices.heading}
            </h2>
            {config.fromPrices.subheading ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {config.fromPrices.subheading}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {fromCards.map((c) => {
              const Icon = getIcon(c.icon);
              return (
                <Card
                  key={c.slug}
                  className="flex flex-col gap-4 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-inverse text-surface-inverse-foreground"
                    >
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {c.title}
                    </h3>
                  </div>
                  <dl className="space-y-1.5">
                    {c.tiers.map((t) => (
                      <div
                        key={t.label}
                        className="flex items-baseline justify-between gap-2 text-sm"
                      >
                        <dt className="text-muted-foreground">{t.label}</dt>
                        <dd className="font-semibold text-foreground">
                          {t.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <div className="mt-auto pt-1">
                    <Button asChild variant="secondary">
                      <Link href={c.interest.href}>{c.interest.label}</Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <HowItWorksSection
        heading={config.howYouSee.heading}
        subheading={config.howYouSee.subheading}
        steps={config.howYouSee.steps}
        note={config.howYouSee.note}
        surface="muted"
      />

      <FaqSection
        heading={config.faq.heading}
        items={config.faq.items}
        viewAll={config.faq.viewAll}
      />

      <TestimonialsSection
        heading={config.testimonials.heading}
        subheading={config.testimonials.subheading}
        items={config.testimonials.items}
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
