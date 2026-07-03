"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import type { ServicesStepsSection } from "@/lib/services/page";

/** "Book in four steps" band with numbered steps and connector lines. */
export function ServicesSteps({ eyebrow, heading, sub, steps }: ServicesStepsSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-svcs-steps-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".svcs-step"), {
      scrollTrigger: { trigger: scope.querySelector(".svcs-steps-grid"), start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="svcs-steps" aria-labelledby="svcs-steps-heading">
      <div className="svcs-steps-inner">
        <div className="js-svcs-steps-intro">
          {eyebrow ? <p className="svcs-eyebrow">{eyebrow}</p> : null}
          <h2 id="svcs-steps-heading" className="svcs-steps-heading">
            {heading}
          </h2>
          {sub ? <p className="svcs-steps-sub">{sub}</p> : null}
        </div>
        <ol className="svcs-steps-grid">
          {steps.map((step, i) => (
            <li key={step.title} className="svcs-step">
              <div aria-hidden className="svcs-step-num">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="svcs-step-title">{step.title}</h3>
              <p className="svcs-step-body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
