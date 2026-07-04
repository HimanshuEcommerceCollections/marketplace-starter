"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { HowItWorksCoordinator } from "@/lib/how-it-works/page";

/** Dark photo band — "a real human, not an algorithm" + illustrative stats. */
export function CoordinatorBand({
  eyebrow,
  title,
  titleAccent,
  body,
  stats,
}: HowItWorksCoordinator) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-hiw-coord-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".hiw-coord-stat"), {
      scrollTrigger: {
        trigger: scope.querySelector(".hiw-coord-stats"),
        start: "top 85%",
        once: true,
      },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="hiw-coord" aria-labelledby="hiw-coord-heading">
      <div className="hiw-coord-inner">
        {eyebrow ? (
          <p className="js-hiw-coord-reveal hiw-eyebrow">{eyebrow}</p>
        ) : null}
        <h2 id="hiw-coord-heading" className="js-hiw-coord-reveal">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-hiw-coord-reveal hiw-coord-sub">{body}</p> : null}
        <div className="hiw-coord-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="hiw-coord-stat">
              <span className="n">{stat.value}</span>
              <span className="l">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
