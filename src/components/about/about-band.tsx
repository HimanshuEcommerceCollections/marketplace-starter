"use client";

import { useEffect } from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { AboutDarkBand } from "@/lib/about/page";

/** Dark photo band with the belief statement and illustrative stat chips. */
export function AboutBand({ title, titleAccent, body, chips, image }: AboutDarkBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-ab-band-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
    // Anchor the chip stagger to the chip row itself (not the section) so
    // the choreography plays as the chips enter the viewport, per the mock.
    gsap.from(scope.querySelectorAll(".ab-chip"), {
      scrollTrigger: {
        trigger: scope.querySelector(".ab-chips"),
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

  // Paint the background from config (inline style is linted out); runs even
  // under reduced motion so the photo always shows.
  useEffect(() => {
    const el = scope.current?.querySelector<HTMLElement>(".ab-band-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="ab-band" aria-labelledby="ab-band-heading">
      <div aria-hidden className="ab-band-bg" />
      <div className="ab-band-inner">
        <h2 id="ab-band-heading" className="js-ab-band-reveal">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-ab-band-reveal ab-band-body">{body}</p> : null}
        {chips.length > 0 ? (
          <div className="ab-chips">
            {chips.map((chip) => (
              <div key={chip.label} className="ab-chip">
                <span className="ab-chip-n">{chip.value}</span>
                <span className="ab-chip-l">{chip.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
