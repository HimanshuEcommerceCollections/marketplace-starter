"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { ContactDarkBand } from "@/lib/contact/page";

/** Closing solid-dark band with a location statement and reachability chips. */
export function ContactBand({ eyebrow, title, titleAccent, body, chips }: ContactDarkBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-ct-band-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 32,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
    gsap.from(scope.querySelectorAll(".ct-chip"), {
      scrollTrigger: {
        trigger: scope.querySelector(".ct-chips"),
        start: "top 88%",
        once: true,
      },
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, []);

  return (
    <section ref={scope} className="ct-band" aria-labelledby="ct-band-heading">
      <div className="ct-band-inner">
        {eyebrow ? (
          <p className="js-ct-band-reveal ct-eyebrow ct-band-eyebrow">{eyebrow}</p>
        ) : null}
        <h2 id="ct-band-heading" className="js-ct-band-reveal">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-ct-band-reveal ct-band-body">{body}</p> : null}
        {chips.length > 0 ? (
          <div className="ct-chips">
            {chips.map((chip) => (
              <div key={chip.label} className="ct-chip">
                <span className="ct-chip-n">{chip.value}</span>
                <span className="ct-chip-l">{chip.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
