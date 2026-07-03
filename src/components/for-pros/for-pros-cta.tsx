"use client";

import { useEffect } from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ForProsCtaBand } from "@/lib/for-pros/page";

/** Closing photo CTA band for the For Pros page. */
export function ForProsCta({
  eyebrow,
  title,
  titleAccent,
  body,
  image,
  primaryCta,
  secondaryCta,
}: ForProsCtaBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-fp-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const el = scope.current?.querySelector<HTMLElement>(".fp-cta-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="fp-cta" aria-labelledby="fp-cta-heading">
      <div aria-hidden className="fp-cta-bg" />
      <div className="fp-cta-inner">
        {eyebrow ? (
          <p className="js-fp-cta-reveal fp-eyebrow fp-cta-eyebrow">{eyebrow}</p>
        ) : null}
        <h2 id="fp-cta-heading" className="js-fp-cta-reveal fp-cta-heading">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-fp-cta-reveal fp-cta-body">{body}</p> : null}
        <div className="js-fp-cta-reveal fp-cta-btns">
          <a href={primaryCta.href} className="fp-btn-p">
            {primaryCta.label} →
          </a>
          {secondaryCta ? (
            <a href={secondaryCta.href} className="fp-btn-o">
              {secondaryCta.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
