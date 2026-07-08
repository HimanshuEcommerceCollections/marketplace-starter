"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type {
  MassagePricingSection,
  MassagePriceChip,
} from "@/lib/massage/page";

export interface MassagePricingProps extends MassagePricingSection {
  /** Price tiers resolved live from the API (base + duration modifier). */
  chips: MassagePriceChip[];
}

/** "Simple, all-in prices" — duration chips with a staggered reveal + CTA. */
export function MassagePricing({
  eyebrow,
  heading,
  note,
  cta,
  chips,
}: MassagePricingProps) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-msg-price-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 84%", once: true },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".msg-price-chip"), {
      scrollTrigger: {
        trigger: scope.querySelector(".msg-price-chips"),
        start: "top 86%",
        once: true,
      },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="msg-price" aria-labelledby="msg-price-heading">
      <div className="msg-section-head js-msg-price-intro">
        {eyebrow ? <p className="msg-eyebrow">{eyebrow}</p> : null}
        <h2 id="msg-price-heading">{heading}</h2>
      </div>
      <div className="msg-price-chips">
        {chips.map((chip) => (
          <div key={chip.duration} className="msg-price-chip">
            <span className="d">{chip.duration}</span>
            <span className="p">{chip.price}</span>
          </div>
        ))}
      </div>
      {note ? <p className="msg-price-note">{note}</p> : null}
      <Link href={cta.href} className="msg-btn-p">
        {cta.label} →
      </Link>
    </section>
  );
}
