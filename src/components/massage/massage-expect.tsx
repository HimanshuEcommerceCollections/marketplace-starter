"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { MassageExpectSection } from "@/lib/massage/page";

/** Dark photo band — numbered before/during/after cards with a staggered reveal. */
export function MassageExpect({ eyebrow, heading, items }: MassageExpectSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-msg-expect-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".msg-expect-card"), {
      scrollTrigger: {
        trigger: scope.querySelector(".msg-expect-grid"),
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
      className="msg-expect"
      aria-labelledby="msg-expect-heading"
    >
      <div className="msg-expect-inner">
        <div className="msg-section-head js-msg-expect-intro">
          {eyebrow ? <p className="msg-eyebrow">{eyebrow}</p> : null}
          <h2 id="msg-expect-heading">{heading}</h2>
        </div>
        <div className="msg-expect-grid">
          {items.map((item) => (
            <article key={item.num} className="msg-expect-card">
              <div aria-hidden className="msg-expect-num">
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
