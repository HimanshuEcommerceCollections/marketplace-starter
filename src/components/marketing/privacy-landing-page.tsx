import { PrivacyHero } from "@/components/privacy/privacy-hero";
import { PrivacyBody } from "@/components/privacy/privacy-body";
import { PrivacyCta } from "@/components/privacy/privacy-cta";
import type { PrivacyPageConfig } from "@/lib/privacy/page";

export interface PrivacyLandingPageProps {
  config: PrivacyPageConfig;
}

/**
 * Composes the redesigned Privacy Policy page from its bespoke sections
 * (centered photo hero → sticky-TOC scroll-spy legal body → solid-dark CTA
 * band). Server component — each section opts into "use client" for its own
 * state/GSAP.
 */
export function PrivacyLandingPage({ config }: PrivacyLandingPageProps) {
  return (
    <>
      <PrivacyHero {...config.hero} />
      <PrivacyBody {...config.body} />
      <PrivacyCta {...config.cta} />
    </>
  );
}
