"use client";

import Image from "next/image";
import { useGsap } from "@/lib/anim/use-gsap";
import type { AboutDarkBand } from "@/lib/about/page";

/** Dark belief band with the statement and illustrative stat chips; an optional
 *  photo sits behind a dark scrim, otherwise the band stays solid-dark. */
export function AboutBand({ title, titleAccent, body, chips, image }: AboutDarkBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-ab-band-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 36,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
    });
    gsap.from(scope.querySelectorAll(".ab-chip"), {
      scrollTrigger: {
        trigger: scope.querySelector(".ab-chips"),
        start: "top 88%",
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
    <section ref={scope} className="ab-band" aria-labelledby="ab-band-heading">
      {image ? (
        <div aria-hidden className="ab-band-bg">
          <Image src={image} alt="" fill sizes="100vw" />
        </div>
      ) : null}
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
