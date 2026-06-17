import { PageHero } from "@/components/sections/page-hero";
import { FaqExplorer } from "@/components/marketing/faq-explorer";
import { FaqContactSection } from "@/components/sections/faq-contact-section";
import type { FaqPageConfig } from "@/lib/faq/page";

export interface FaqLandingPageProps {
  config: FaqPageConfig;
}

/** Composes the full "/faq" page from the shared sections + FAQ explorer. */
export function FaqLandingPage({ config }: FaqLandingPageProps) {
  return (
    <>
      <PageHero
        variant={config.hero.variant}
        eyebrow={config.hero.eyebrow}
        title={config.hero.title}
        subtitle={config.hero.subtitle}
        primaryCta={config.hero.primaryCta}
        secondaryCta={config.hero.secondaryCta}
      />

      <FaqExplorer search={config.search} categories={config.categories} />

      <FaqContactSection
        heading={config.contact.heading}
        body={config.contact.body}
        note={config.contact.note}
        primaryCta={config.contact.primaryCta}
        secondaryCta={config.contact.secondaryCta}
        card={config.contact.card}
      />
    </>
  );
}
