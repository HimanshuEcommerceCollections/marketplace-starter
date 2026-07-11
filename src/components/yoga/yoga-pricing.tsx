"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { YogaPricingSection } from "@/lib/yoga/page";

/** "Simple, all-in prices" — static duration chips with a staggered reveal + CTA. */
export function YogaPricing({
  eyebrow,
  heading,
  note,
  cta,
  chips,
}: YogaPricingSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-yoga-price-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 84%", once: true },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".yoga-price-chip"), {
      scrollTrigger: {
        trigger: scope.querySelector(".yoga-price-chips"),
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
    <section ref={scope} className="yoga-price" aria-labelledby="yoga-price-heading">
      <div className="yoga-section-head js-yoga-price-intro">
        {eyebrow ? <span className="yoga-eyebrow">{eyebrow}</span> : null}
        <h2 id="yoga-price-heading">
          {heading.lead}{" "}
          {heading.accent ? <em>{heading.accent}</em> : null}
          {heading.trail ? <> {heading.trail}</> : null}
        </h2>
      </div>
      <div className="yoga-price-chips">
        {chips.map((chip) => (
          <div key={chip.duration} className="yoga-price-chip">
            <span className="d">{chip.duration}</span>
            <span className="p">{chip.price}</span>
          </div>
        ))}
      </div>
      {note ? <p className="yoga-price-note">{note}</p> : null}
      <Link href={cta.href} className="yoga-btn-dark">
        {cta.label} →
      </Link>
    </section>
  );
}
