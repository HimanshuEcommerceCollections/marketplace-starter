"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { PricingPageConfig } from "@/lib/pricing/page";

/** Full-bleed photo hero for the Pricing page (sits behind the floating nav). */
export function PricingHero({
  eyebrow,
  title,
  titleAccent,
  sub,
}: PricingPageConfig["hero"]) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".pr-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-pr-hero"), {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="pr-hero" aria-labelledby="pr-hero-title">
      <div aria-hidden className="pr-hero-bg" />
      <div className="pr-hero-inner">
        {eyebrow ? <p className="js-pr-hero pr-eyebrow">{eyebrow}</p> : null}
        <h1 id="pr-hero-title" className="js-pr-hero pr-hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-pr-hero pr-hero-sub">{sub}</p> : null}
      </div>
    </section>
  );
}
