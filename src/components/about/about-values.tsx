"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { AboutValuesSection } from "@/lib/about/page";

/** "What we stand on" — centered head + four value cards. */
export function AboutValues({ eyebrow, heading, sub, items }: AboutValuesSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    scope.querySelectorAll(".ab-value-card").forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
        y: 40,
        autoAlpha: 0,
        duration: 0.65,
        delay: (index % 2) * 0.1,
        ease: "power3.out",
      });
    });
  }, []);

  return (
    <section ref={scope} className="ab-values" aria-labelledby="ab-values-heading">
      <div className="ab-section-head">
        {eyebrow ? <p className="ab-eyebrow">{eyebrow}</p> : null}
        <h2 id="ab-values-heading">{heading}</h2>
        {sub ? <p>{sub}</p> : null}
      </div>
      <div className="ab-values-grid">
        {items.map((item) => {
          const IconGlyph = getPhosphorIcon(item.icon);
          return (
            <article key={item.title} className="ab-value-card">
              <span className="ab-value-icon" aria-hidden>
                <IconGlyph weight="regular" />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
