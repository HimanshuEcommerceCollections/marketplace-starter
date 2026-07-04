"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { HowItWorksCoverage } from "@/lib/how-it-works/page";

const PinIcon = getPhosphorIcon("MapPin");

/** Coverage band — centered head + map-pin area pills over a soft photo wash. */
export function CoverageBand({
  eyebrow,
  heading,
  sub,
  areas,
  note,
}: HowItWorksCoverage) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-hiw-coverage-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 84%", once: true },
      y: 24,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".hiw-area-pill"), {
      scrollTrigger: {
        trigger: scope.querySelector(".hiw-area-pills"),
        start: "top 88%",
        once: true,
      },
      y: 14,
      autoAlpha: 0,
      duration: 0.45,
      stagger: 0.04,
      ease: "power2.out",
    });
  }, []);

  return (
    <section
      ref={scope}
      className="hiw-coverage"
      aria-labelledby="hiw-coverage-heading"
    >
      <div className="hiw-coverage-inner">
        <div className="hiw-section-head">
          {eyebrow ? (
            <p className="js-hiw-coverage-reveal hiw-eyebrow">{eyebrow}</p>
          ) : null}
          <h2 id="hiw-coverage-heading" className="js-hiw-coverage-reveal">
            {heading}
          </h2>
          {sub ? <p className="js-hiw-coverage-reveal">{sub}</p> : null}
        </div>
        <ul className="hiw-area-pills">
          {areas.map((area) => (
            <li key={area} className="hiw-area-pill">
              <PinIcon weight="regular" aria-hidden />
              {area}
            </li>
          ))}
        </ul>
        {note ? (
          <p className="js-hiw-coverage-reveal hiw-coverage-note">{note}</p>
        ) : null}
      </div>
    </section>
  );
}
