import { ForProsHero } from "@/components/for-pros/for-pros-hero";
import { ForProsBenefits } from "@/components/for-pros/for-pros-benefits";
import { ForProsEarnings } from "@/components/for-pros/for-pros-earnings";
import { ForProsSteps } from "@/components/for-pros/for-pros-steps";
import { ForProsRequirements } from "@/components/for-pros/for-pros-requirements";
import { ForProsFaq } from "@/components/for-pros/for-pros-faq";
import { ForProsCta } from "@/components/for-pros/for-pros-cta";
import type { ForProsPageConfig } from "@/lib/for-pros/page";

export interface ForProsLandingPageProps {
  config: ForProsPageConfig;
}

/**
 * Composes the redesigned For Pros page from its bespoke, full-bleed sections
 * (hero → benefits → earnings band → getting-started steps → requirements →
 * FAQ → CTA). Server component — each section opts into "use client" for its
 * own GSAP.
 */
export function ForProsLandingPage({ config }: ForProsLandingPageProps) {
  return (
    <>
      <ForProsHero {...config.hero} />
      <ForProsBenefits {...config.benefits} />
      <ForProsEarnings {...config.earnings} />
      <ForProsSteps {...config.steps} />
      <ForProsRequirements {...config.requirements} />
      <ForProsFaq {...config.faq} />
      <ForProsCta {...config.cta} />
    </>
  );
}
