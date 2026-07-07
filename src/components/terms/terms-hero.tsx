"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { TermsHero as TermsHeroConfig } from "@/lib/terms/page";

/** Full-bleed photo hero for the Terms page (sits behind the floating nav). */
export function TermsHero({ eyebrow, title, titleAccent, sub }: TermsHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".terms-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-terms-hero-reveal"), {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="terms-hero" aria-labelledby="terms-hero-title">
      <div aria-hidden className="terms-hero-bg" />
      <div className="terms-hero-inner">
        {eyebrow ? (
          <p className="js-terms-hero-reveal terms-eyebrow terms-hero-eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h1 id="terms-hero-title" className="js-terms-hero-reveal terms-hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-terms-hero-reveal terms-hero-sub">{sub}</p> : null}
      </div>
    </section>
  );
}
