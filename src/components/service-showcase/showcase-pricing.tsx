"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type {
  ShowcasePricingSection,
  ShowcasePriceChip,
} from "@/lib/service-showcase/page";

export interface ShowcasePricingProps extends ShowcasePricingSection {
  /** Price tiers resolved live from the API (base + duration modifier). */
  chips: ShowcasePriceChip[];
}

/** "Simple, all-in prices" — duration chips with a staggered reveal + CTA. */
export function ShowcasePricing({
  eyebrow,
  heading,
  note,
  cta,
  chips,
}: ShowcasePricingProps) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-ssp-price-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 84%", once: true },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".ssp-price-chip"), {
      scrollTrigger: {
        trigger: scope.querySelector(".ssp-price-chips"),
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
    <section ref={scope} className="ssp-price" aria-labelledby="ssp-price-heading">
      <div className="ssp-section-head js-ssp-price-intro">
        {eyebrow ? <p className="ssp-eyebrow">{eyebrow}</p> : null}
        <h2 id="ssp-price-heading">{heading}</h2>
      </div>
      <div className="ssp-price-chips">
        {chips.map((chip) => (
          <div key={chip.duration} className="ssp-price-chip">
            <span className="d">{chip.duration}</span>
            <span className="p">{chip.price}</span>
          </div>
        ))}
      </div>
      {note ? <p className="ssp-price-note">{note}</p> : null}
      <Link href={cta.href} className="ssp-btn-p">
        {cta.label} →
      </Link>
    </section>
  );
}
