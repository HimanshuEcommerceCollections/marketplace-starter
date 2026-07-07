import { TermsHero } from "@/components/terms/terms-hero";
import { TermsBody } from "@/components/terms/terms-body";
import { TermsDarkBand } from "@/components/terms/terms-dark-band";
import type { TermsPageConfig } from "@/lib/terms/page";

export interface TermsLandingPageProps {
  config: TermsPageConfig;
}

/**
 * Composes the redesigned Terms of Service page from its bespoke sections
 * (photo hero → sticky-TOC legal body → dark CTA band). Server component —
 * each section opts into "use client" for its own GSAP / scroll-spy.
 */
export function TermsLandingPage({ config }: TermsLandingPageProps) {
  return (
    <>
      <TermsHero {...config.hero} />
      <TermsBody {...config.body} />
      <TermsDarkBand {...config.darkBand} />
    </>
  );
}
