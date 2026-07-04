"use client";

import { useEffect } from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ForProsStepsSection } from "@/lib/for-pros/page";

/** "From application to first booking" — four numbered steps with connectors. */
export function ForProsSteps({
  eyebrow,
  heading,
  sub,
  image,
  steps,
}: ForProsStepsSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-fp-steps-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".fp-step"), {
      scrollTrigger: {
        trigger: scope.querySelector(".fp-steps-grid"),
        start: "top 82%",
        once: true,
      },
      y: 28,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const el = scope.current?.querySelector<HTMLElement>(".fp-steps-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="fp-steps" aria-labelledby="fp-steps-heading">
      <div aria-hidden className="fp-steps-bg" />
      <div className="fp-steps-inner">
        <div className="fp-section-head js-fp-steps-intro">
          {eyebrow ? <p className="fp-eyebrow">{eyebrow}</p> : null}
          <h2 id="fp-steps-heading">{heading}</h2>
          {sub ? <p>{sub}</p> : null}
        </div>
        <div className="fp-steps-grid">
          {steps.map((step) => (
            <div key={step.num} className="fp-step">
              <div className="fp-step-num">{step.num}</div>
              <h3 className="fp-step-title">{step.title}</h3>
              <p className="fp-step-body">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
