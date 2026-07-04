"use client";

import { useEffect } from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ForProsEarnings as ForProsEarningsConfig } from "@/lib/for-pros/page";

/** Dark photo band — "get paid what you're worth" + illustrative earnings stats. */
export function ForProsEarnings({
  eyebrow,
  title,
  titleLine2,
  titleAccent,
  body,
  image,
  stats,
}: ForProsEarningsConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-fp-earn-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".fp-earn-stat"), {
      scrollTrigger: {
        trigger: scope.querySelector(".fp-earn-stats"),
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

  useEffect(() => {
    const el = scope.current?.querySelector<HTMLElement>(".fp-earn-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="fp-earn" aria-labelledby="fp-earn-heading">
      <div aria-hidden className="fp-earn-bg" />
      <div className="fp-earn-inner">
        {eyebrow ? (
          <p className="js-fp-earn-reveal fp-eyebrow">{eyebrow}</p>
        ) : null}
        <h2 id="fp-earn-heading" className="js-fp-earn-reveal">
          {title}
          {titleLine2 || titleAccent ? <br /> : null}
          {titleLine2 ? <>{titleLine2} </> : null}
          {titleAccent ? <em>{titleAccent}</em> : null}
        </h2>
        {body ? <p className="js-fp-earn-reveal fp-earn-sub">{body}</p> : null}
        <div className="fp-earn-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="fp-earn-stat">
              <span className="n">{stat.value}</span>
              <span className="l">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
