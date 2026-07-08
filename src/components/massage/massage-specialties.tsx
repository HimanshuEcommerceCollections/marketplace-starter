"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type {
  MassageSpecialtiesSection,
  MassageSpecialty,
  MassageAddOn,
} from "@/lib/massage/page";

export interface MassageSpecialtiesProps extends MassageSpecialtiesSection {
  /** Session-type cards, resolved live from the API. */
  items: MassageSpecialty[];
  /** Add-on cards (label + description + surcharge), resolved live from the API. */
  addOns: MassageAddOn[];
}

/**
 * Dark photo band — "Choose your focus". Session types and add-ons are rendered
 * entirely from the service config API (no static list); only the section's
 * editorial headings come from config.
 */
export function MassageSpecialties({
  eyebrow,
  heading,
  sub,
  addOnsHeading,
  items,
  addOns,
}: MassageSpecialtiesProps) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-msg-specialties-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".msg-style-card"), {
      scrollTrigger: {
        trigger: scope.querySelector(".msg-styles-grid"),
        start: "top 88%",
        once: true,
      },
      y: 28,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.06,
      ease: "power3.out",
    });
    const addonGrid = scope.querySelector(".msg-addons-grid");
    if (addonGrid) {
      gsap.from(scope.querySelectorAll(".msg-addon-card"), {
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
      className="msg-styles"
      aria-labelledby="msg-styles-heading"
    >
      <div className="msg-styles-inner">
        <div className="msg-section-head js-msg-specialties-intro">
          {eyebrow ? <p className="msg-eyebrow">{eyebrow}</p> : null}
          <h2 id="msg-styles-heading">{heading}</h2>
          {sub ? <p>{sub}</p> : null}
        </div>

        {items.length > 0 ? (
          <div className="msg-styles-grid">
            {items.map((item) => (
              <article key={item.title} className="msg-style-card">
                <h3>{item.title}</h3>
                {item.body ? <p>{item.body}</p> : null}
              </article>
            ))}
          </div>
        ) : null}

        {addOns.length > 0 ? (
          <div className="msg-addons">
            {addOnsHeading ? (
              <p className="msg-addons-head">{addOnsHeading}</p>
            ) : null}
            <div className="msg-addons-grid">
              {addOns.map((addOn) => (
                <article key={addOn.title} className="msg-addon-card">
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
