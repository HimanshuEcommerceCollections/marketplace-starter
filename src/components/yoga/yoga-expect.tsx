"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { YogaExpectSection } from "@/lib/yoga/page";

/** Solid dark band — numbered before/during/after cards with a staggered reveal. */
export function YogaExpect({ eyebrow, heading, items }: YogaExpectSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-yoga-expect-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".yoga-expect-card"), {
      scrollTrigger: {
        trigger: scope.querySelector(".yoga-expect-grid"),
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
    <section ref={scope} className="yoga-expect" aria-labelledby="yoga-expect-heading">
      <div className="yoga-expect-inner">
        <div className="yoga-section-head js-yoga-expect-intro">
          {eyebrow ? <span className="yoga-eyebrow">{eyebrow}</span> : null}
          <h2 id="yoga-expect-heading">
            {heading.lead}{" "}
            {heading.accent ? <em>{heading.accent}</em> : null}
            {heading.trail ? <> {heading.trail}</> : null}
          </h2>
        </div>
        <div className="yoga-expect-grid">
          {items.map((item) => (
            <article key={item.num} className="yoga-expect-card">
              <div aria-hidden className="yoga-expect-num">
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
