import { FaqHero } from "@/components/faq/faq-hero";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { FaqBand } from "@/components/faq/faq-band";
import type { FaqPageConfig } from "@/lib/faq/page";

export interface FaqLandingPageProps {
  config: FaqPageConfig;
}

/**
 * Composes the redesigned FAQ page from its bespoke sections (photo hero →
 * sticky category filter + accordion → "ask a human" dark band). Server
 * component — each section opts into "use client" for its own state/GSAP.
 */
export function FaqLandingPage({ config }: FaqLandingPageProps) {
  return (
    <>
      <FaqHero {...config.hero} />
      <FaqBrowser {...config.browser} />
      <FaqBand {...config.band} />
    </>
  );
}
