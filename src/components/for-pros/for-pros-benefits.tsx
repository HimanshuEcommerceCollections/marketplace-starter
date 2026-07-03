"use client";

import {
  CalendarCheck,
  HandCoins,
  Clock,
  Headset,
  Sparkle,
  type Icon,
} from "@phosphor-icons/react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ForProsBenefitsSection } from "@/lib/for-pros/page";

// Page-local icon map — imported directly rather than via the global registry,
// since these glyphs are specific to this section.
const ICONS: Record<string, Icon> = {
  CalendarCheck,
  HandCoins,
  Clock,
  Headset,
};

/** "Built for independents" — four benefit cards with a per-card scroll reveal. */
export function ForProsBenefits({
  eyebrow,
  heading,
  sub,
  items,
}: ForProsBenefitsSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    scope.querySelectorAll(".fp-benefit-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
        y: 48,
        autoAlpha: 0,
        duration: 0.7,
        delay: i * 0.08,
        ease: "power3.out",
      });
    });
  }, []);

  return (
    <section
      ref={scope}
      id="fp-benefits"
      className="fp-benefits"
      aria-labelledby="fp-benefits-heading"
    >
      <div className="fp-section-head">
        {eyebrow ? <p className="fp-eyebrow">{eyebrow}</p> : null}
        <h2 id="fp-benefits-heading">{heading}</h2>
        {sub ? <p>{sub}</p> : null}
      </div>
      <div className="fp-benefits-grid">
        {items.map((item) => {
          const IconGlyph = ICONS[item.icon] ?? Sparkle;
          return (
            <article key={item.title} className="fp-benefit-card">
              <div className="fp-benefit-icon">
                <IconGlyph weight="regular" aria-hidden />
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
