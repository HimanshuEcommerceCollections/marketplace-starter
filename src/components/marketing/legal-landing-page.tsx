import { PageHero } from "@/components/sections/page-hero";
import { NoticeCallout } from "@/components/shared/notice-callout";
import { LegalContentsSection } from "@/components/sections/legal-contents-section";
import { LegalSectionsSection } from "@/components/sections/legal-sections-section";
import { LegalDisclosureSection } from "@/components/sections/legal-disclosure-section";
import { LegalContactSection } from "@/components/sections/legal-contact-section";
import type { LegalPageConfig } from "@/lib/legal/page";

export interface LegalLandingPageProps {
  config: LegalPageConfig;
}

/**
 * Legal / policy page (Privacy, Terms, …) — a config-driven composition of the
 * shared PageHero + legal sections. Reusable across brands and documents via
 * {@link LegalPageConfig}. Renders inside the site chrome (navbar + footer).
 */
export function LegalLandingPage({ config }: LegalLandingPageProps) {
  const { hero, contents, sections, disclosure, contact } = config;

  return (
    <>
      <PageHero
        variant={hero.variant ?? "light"}
        breadcrumb={hero.breadcrumb}
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        divider={hero.divider}
        meta={hero.meta}
        notice={
          hero.notice ? <NoticeCallout>{hero.notice}</NoticeCallout> : undefined
        }
      />

      <LegalContentsSection
        heading={contents.heading}
        subtitle={contents.subtitle}
        items={sections.items}
      />

      <LegalSectionsSection
        heading={sections.heading}
        subtitle={sections.subtitle}
        items={sections.items}
      />

      {disclosure ? <LegalDisclosureSection {...disclosure} /> : null}

      <LegalContactSection
        heading={contact.heading}
        body={contact.body}
        note={contact.note}
        card={contact.card}
        actions={contact.actions}
      />
    </>
  );
}
