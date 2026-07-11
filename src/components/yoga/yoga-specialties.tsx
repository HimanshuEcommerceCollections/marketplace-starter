"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { YogaSpecialtiesSection } from "@/lib/yoga/page";

/** Solid dark band — "Choose your focus". Static yoga-style cards from config. */
export function YogaSpecialties({
  eyebrow,
  heading,
  sub,
  items,
}: YogaSpecialtiesSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-yoga-specialties-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".yoga-style-card"), {
      scrollTrigger: {
        trigger: scope.querySelector(".yoga-styles-grid"),
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
    <section ref={scope} className="yoga-styles" aria-labelledby="yoga-styles-heading">
      <div className="yoga-styles-inner">
        <div className="yoga-section-head js-yoga-specialties-intro">
          {eyebrow ? <span className="yoga-eyebrow">{eyebrow}</span> : null}
          <h2 id="yoga-styles-heading">
            {heading.lead}{" "}
            {heading.accent ? <em>{heading.accent}</em> : null}
            {heading.trail ? <> {heading.trail}</> : null}
          </h2>
          {sub ? <p>{sub}</p> : null}
        </div>

        <div className="yoga-styles-grid">
          {items.map((item) => (
            <article key={item.title} className="yoga-style-card">
              <h3>{item.title}</h3>
              {item.body ? <p>{item.body}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
