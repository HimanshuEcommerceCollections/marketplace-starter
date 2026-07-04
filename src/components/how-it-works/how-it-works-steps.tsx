"use client";

import Image from "next/image";
import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { HowItWorksStepsSection } from "@/lib/how-it-works/page";

const CheckIcon = getPhosphorIcon("CheckCircle");

/** Four alternating image/text step rows with stroked ghost numerals. */
export function HowItWorksSteps({
  eyebrow,
  heading,
  sub,
  steps,
}: HowItWorksStepsSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-hiw-steps-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top 82%", once: true },
      y: 28,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
    scope.querySelectorAll(".hiw-step-row").forEach((row) => {
      gsap.from(row.querySelector(".hiw-step-img"), {
        scrollTrigger: { trigger: row, start: "top 82%", once: true },
        y: 48,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(row.querySelector(".hiw-step-txt"), {
        scrollTrigger: { trigger: row, start: "top 82%", once: true },
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.15,
        ease: "power3.out",
      });
    });
  }, []);

  return (
    <section ref={scope} className="hiw-steps" aria-labelledby="hiw-steps-heading">
      <div className="hiw-section-head js-hiw-steps-intro">
        {eyebrow ? <p className="hiw-eyebrow">{eyebrow}</p> : null}
        <h2 id="hiw-steps-heading">{heading}</h2>
        {sub ? <p>{sub}</p> : null}
      </div>

      {steps.map((step, index) => {
        const number = String(index + 1).padStart(2, "0");
        return (
          <div
            key={step.title}
            className={`hiw-step-row${index % 2 === 1 ? " is-rev" : ""}`}
          >
            <div className="hiw-step-img">
              <Image
                src={step.image.src}
                alt={step.image.alt}
                fill
                sizes="(min-width: 60rem) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="hiw-step-txt">
              <div aria-hidden className="hiw-step-ghost">
                {number}
              </div>
              <div className="hiw-step-kicker">{step.kicker}</div>
              <h3>
                <span className="sr-only">{`Step ${index + 1}: `}</span>
                {step.title}
              </h3>
              <p>{step.body}</p>
              <ul className="hiw-step-points">
                {step.points.map((point) => (
                  <li key={point}>
                    <CheckIcon weight="regular" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </section>
  );
}
