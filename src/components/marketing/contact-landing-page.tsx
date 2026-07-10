import { ContactHero } from "@/components/contact/contact-hero";
import { ContactMethods } from "@/components/contact/contact-methods";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactBand } from "@/components/contact/contact-band";
import type { ContactPageConfig } from "@/lib/contact/page";

export interface ContactLandingPageProps {
  config: ContactPageConfig;
}

/**
 * Composes the Contact page from its bespoke sections (centered photo hero →
 * two-column methods + mailto composer → solid-dark reachability band). Server
 * component — each section opts into "use client" for its own state/GSAP.
 */
export function ContactLandingPage({ config }: ContactLandingPageProps) {
  return (
    <>
      <ContactHero {...config.hero} />
      <section className="ct-wrap" aria-labelledby="ct-methods-heading">
        <h2 id="ct-methods-heading" className="sr-only">
          {config.methodsHeading}
        </h2>
        <ContactMethods methods={config.methods} />
        <ContactForm {...config.form} />
      </section>
      <ContactBand {...config.band} />
    </>
  );
}
