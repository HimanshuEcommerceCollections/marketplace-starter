"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { LifeCoachingExpectSection } from "@/lib/life-coaching/page";

/** Solid dark band — numbered before/during/after cards with a staggered reveal. */
export function LifeCoachingExpect({ eyebrow, heading, items }: LifeCoachingExpectSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-lc-expect-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".lc-expect-card"), {
      scrollTrigger: {
        trigger: scope.querySelector(".lc-expect-grid"),
        start: "top 84%",
        once: true,
      },
      y: 28,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="lc-expect" aria-labelledby="lc-expect-heading">
      <div className="lc-expect-inner">
        <div className="lc-section-head js-lc-expect-intro">
          {eyebrow ? <span className="lc-eyebrow">{eyebrow}</span> : null}
          <h2 id="lc-expect-heading">
            {heading.lead}{" "}
            {heading.accent ? <em>{heading.accent}</em> : null}
            {heading.trail ? <> {heading.trail}</> : null}
          </h2>
        </div>
        <div className="lc-expect-grid">
          {items.map((item) => (
            <article key={item.num} className="lc-expect-card">
              <div aria-hidden className="lc-expect-num">
                {item.num}
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
