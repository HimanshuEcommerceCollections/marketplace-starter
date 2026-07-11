"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { LifeCoachingPricingSection } from "@/lib/life-coaching/page";

/** "Simple, all-in prices" — static duration chips with a staggered reveal + CTA. */
export function LifeCoachingPricing({
  eyebrow,
  heading,
  note,
  cta,
  chips,
}: LifeCoachingPricingSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-lc-price-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 84%", once: true },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".lc-price-chip"), {
      scrollTrigger: {
        trigger: scope.querySelector(".lc-price-chips"),
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
    <section ref={scope} className="lc-price" aria-labelledby="lc-price-heading">
      <div className="lc-section-head js-lc-price-intro">
        {eyebrow ? <span className="lc-eyebrow">{eyebrow}</span> : null}
        <h2 id="lc-price-heading">
          {heading.lead}{" "}
          {heading.accent ? <em>{heading.accent}</em> : null}
          {heading.trail ? <> {heading.trail}</> : null}
        </h2>
      </div>
      <div className="lc-price-chips">
        {chips.map((chip) => (
          <div key={chip.duration} className="lc-price-chip">
            <span className="d">{chip.duration}</span>
            <span className="p">{chip.price}</span>
          </div>
        ))}
      </div>
      {note ? <p className="lc-price-note">{note}</p> : null}
      <Link href={cta.href} className="lc-btn-dark">
        {cta.label} →
      </Link>
    </section>
  );
}
