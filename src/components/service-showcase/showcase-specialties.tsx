"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type {
  ShowcaseSpecialtiesSection,
  ShowcaseSpecialty,
  ShowcaseAddOn,
} from "@/lib/service-showcase/page";

export interface ShowcaseSpecialtiesProps extends ShowcaseSpecialtiesSection {
  /** Focus cards, resolved live from the API. */
  items: ShowcaseSpecialty[];
  /** Optional add-on cards (label + description), resolved live from the API. */
  addOns: ShowcaseAddOn[];
}

/**
 * Dark photo band — "Choose your focus". Focus cards and add-ons are rendered
 * entirely from the service config API (no static list); only the section's
 * editorial headings come from config.
 */
export function ShowcaseSpecialties({
  eyebrow,
  heading,
  sub,
  addOnsHeading,
  items,
  addOns,
}: ShowcaseSpecialtiesProps) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-ssp-specialties-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".ssp-style-card"), {
      scrollTrigger: {
        trigger: scope.querySelector(".ssp-styles-grid"),
        start: "top 88%",
        once: true,
      },
      y: 28,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.06,
      ease: "power3.out",
    });
    const addonGrid = scope.querySelector(".ssp-addons-grid");
    if (addonGrid) {
      gsap.from(scope.querySelectorAll(".ssp-addon-card"), {
        scrollTrigger: { trigger: addonGrid, start: "top 90%", once: true },
        y: 24,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <section
      ref={scope}
      className="ssp-styles"
      aria-labelledby="ssp-styles-heading"
    >
      <div className="ssp-styles-inner">
        <div className="ssp-section-head js-ssp-specialties-intro">
          {eyebrow ? <p className="ssp-eyebrow">{eyebrow}</p> : null}
          <h2 id="ssp-styles-heading">{heading}</h2>
          {sub ? <p>{sub}</p> : null}
        </div>

        {items.length > 0 ? (
          <div className="ssp-styles-grid">
            {items.map((item) => (
              <article key={item.title} className="ssp-style-card">
                <h3>{item.title}</h3>
                {item.body ? <p>{item.body}</p> : null}
              </article>
            ))}
          </div>
        ) : null}

        {addOns.length > 0 ? (
          <div className="ssp-addons">
            {addOnsHeading ? (
              <p className="ssp-addons-head">{addOnsHeading}</p>
            ) : null}
            <div className="ssp-addons-grid">
              {addOns.map((addOn) => (
                <article key={addOn.title} className="ssp-addon-card">
                  <h3>{addOn.title}</h3>
                  {addOn.body ? <p>{addOn.body}</p> : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
