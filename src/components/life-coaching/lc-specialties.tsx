"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { LifeCoachingSpecialtiesSection } from "@/lib/life-coaching/page";

/** Solid dark band — "Choose your focus". Static lc-style cards from config. */
export function LifeCoachingSpecialties({
  eyebrow,
  heading,
  sub,
  items,
}: LifeCoachingSpecialtiesSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-lc-specialties-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".lc-style-card"), {
      scrollTrigger: {
        trigger: scope.querySelector(".lc-styles-grid"),
        start: "top 88%",
        once: true,
      },
      y: 28,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.06,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="lc-styles" aria-labelledby="lc-styles-heading">
      <div className="lc-styles-inner">
        <div className="lc-section-head js-lc-specialties-intro">
          {eyebrow ? <span className="lc-eyebrow">{eyebrow}</span> : null}
          <h2 id="lc-styles-heading">
            {heading.lead}{" "}
            {heading.accent ? <em>{heading.accent}</em> : null}
            {heading.trail ? <> {heading.trail}</> : null}
          </h2>
          {sub ? <p>{sub}</p> : null}
        </div>

        <div className="lc-styles-grid">
          {items.map((item) => (
            <article key={item.title} className="lc-style-card">
              <h3>{item.title}</h3>
              {item.body ? <p>{item.body}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
