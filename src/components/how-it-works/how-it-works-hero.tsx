"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { HowItWorksHero as HowItWorksHeroConfig } from "@/lib/how-it-works/page";

/** Full-bleed photo hero for the How It Works page (sits behind the floating nav). */
export function HowItWorksHero({
  eyebrow,
  title,
  titleAccent,
  sub,
}: HowItWorksHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".hiw-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-hiw-hero-reveal"), {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="hiw-hero" aria-labelledby="hiw-hero-title">
      <div aria-hidden className="hiw-hero-bg" />
      <div className="hiw-hero-inner">
        {eyebrow ? (
          <p className="js-hiw-hero-reveal hero-eyebrow">{eyebrow}</p>
        ) : null}
        <h1 id="hiw-hero-title" className="js-hiw-hero-reveal hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-hiw-hero-reveal hero-sub">{sub}</p> : null}
      </div>
    </section>
  );
}
