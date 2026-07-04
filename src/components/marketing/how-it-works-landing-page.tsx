import { HowItWorksHero } from "@/components/how-it-works/how-it-works-hero";
import { HowItWorksSteps } from "@/components/how-it-works/how-it-works-steps";
import { CoordinatorBand } from "@/components/how-it-works/coordinator-band";
import { CoverageBand } from "@/components/how-it-works/coverage-band";
import { HowItWorksFaq } from "@/components/how-it-works/how-it-works-faq";
import { HowItWorksCta } from "@/components/how-it-works/how-it-works-cta";
import type { HowItWorksPageConfig } from "@/lib/how-it-works/page";

export interface HowItWorksLandingPageProps {
  config: HowItWorksPageConfig;
}

/**
 * Composes the redesigned How It Works page from its bespoke, full-bleed
 * sections (hero → step rows → coordinator band → coverage → FAQ → CTA).
 * Server component — each section opts into "use client" for its own GSAP.
 */
export function HowItWorksLandingPage({ config }: HowItWorksLandingPageProps) {
  return (
    <>
      <HowItWorksHero {...config.hero} />
      <HowItWorksSteps {...config.steps} />
      <CoordinatorBand {...config.coordinator} />
      <CoverageBand {...config.coverage} />
      <HowItWorksFaq {...config.faq} />
      <HowItWorksCta {...config.cta} />
    </>
  );
}
