import { AboutHero } from "@/components/about/about-hero";
import { AboutStory } from "@/components/about/about-story";
import { AboutValues } from "@/components/about/about-values";
import { AboutBand } from "@/components/about/about-band";
import { AboutCta } from "@/components/about/about-cta";
import type { AboutPageConfig } from "@/lib/about/page";

export interface AboutLandingPageProps {
  config: AboutPageConfig;
}

/**
 * Composes the redesigned About page from its bespoke sections (photo hero →
 * origin story → values grid → dark stats band → photo CTA band). Server
 * component — each section opts into "use client" for its own GSAP.
 */
export function AboutLandingPage({ config }: AboutLandingPageProps) {
  return (
    <>
      <AboutHero {...config.hero} />
      <AboutStory {...config.story} />
      <AboutValues {...config.values} />
      <AboutBand {...config.band} />
      <AboutCta {...config.cta} />
    </>
  );
}
