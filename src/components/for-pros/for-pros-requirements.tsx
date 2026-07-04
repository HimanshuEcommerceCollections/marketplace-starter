"use client";

import {
  Certificate,
  Briefcase,
  ShieldCheck,
  FileText,
  Car,
  Heart,
  Sparkle,
  type Icon,
} from "@phosphor-icons/react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ForProsRequirementsSection } from "@/lib/for-pros/page";

// Page-local icon map — imported directly rather than via the global registry.
const ICONS: Record<string, Icon> = {
  Certificate,
  Briefcase,
  ShieldCheck,
  FileText,
  Car,
  Heart,
};

/** "Requirements" — six criteria in a two-column grid, per-item scroll reveal. */
export function ForProsRequirements({
  eyebrow,
  heading,
  sub,
  items,
}: ForProsRequirementsSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    scope.querySelectorAll(".fp-req-item").forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: "top 90%", once: true },
        y: 24,
        autoAlpha: 0,
        duration: 0.5,
        delay: i * 0.06,
        ease: "power3.out",
      });
    });
  }, []);

  return (
    <section ref={scope} className="fp-req" aria-labelledby="fp-req-heading">
      <div className="fp-section-head">
        {eyebrow ? <p className="fp-eyebrow">{eyebrow}</p> : null}
        <h2 id="fp-req-heading">{heading}</h2>
        {sub ? <p>{sub}</p> : null}
      </div>
      <ul className="fp-req-grid">
        {items.map((item) => {
          const IconGlyph = ICONS[item.icon] ?? Sparkle;
          return (
            <li key={item.lead} className="fp-req-item">
              <IconGlyph weight="regular" aria-hidden />
              <span>
                <b>{item.lead}</b> {item.text}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
