"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { ServicesPageHero } from "@/lib/services/page";

/** Full-bleed photo hero for the services showcase page. */
export function ServicesHero({ eyebrow, title, titleAccent, sub }: ServicesPageHero) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-svcs-hero-reveal"), {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="svcs-hero" aria-labelledby="svcs-hero-title">
      <div aria-hidden className="svcs-hero-bg" />
      <div className="svcs-hero-inner">
        {eyebrow ? <p className="js-svcs-hero-reveal svcs-eyebrow">{eyebrow}</p> : null}
        <h1 id="svcs-hero-title" className="js-svcs-hero-reveal svcs-hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-svcs-hero-reveal svcs-hero-sub">{sub}</p> : null}
      </div>
    </section>
  );
}
