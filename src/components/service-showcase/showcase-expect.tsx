"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { ShowcaseExpectSection } from "@/lib/service-showcase/page";

/** Dark photo band — numbered before/during/after cards with a staggered reveal. */
export function ShowcaseExpect({ eyebrow, heading, items }: ShowcaseExpectSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-ssp-expect-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".ssp-expect-card"), {
      scrollTrigger: {
        trigger: scope.querySelector(".ssp-expect-grid"),
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
    <section
      ref={scope}
      className="ssp-expect"
      aria-labelledby="ssp-expect-heading"
    >
      <div className="ssp-expect-inner">
        <div className="ssp-section-head js-ssp-expect-intro">
          {eyebrow ? <p className="ssp-eyebrow">{eyebrow}</p> : null}
          <h2 id="ssp-expect-heading">{heading}</h2>
        </div>
        <div className="ssp-expect-grid">
          {items.map((item) => (
            <article key={item.num} className="ssp-expect-card">
              <div aria-hidden className="ssp-expect-num">
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
