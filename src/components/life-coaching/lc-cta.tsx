"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { LifeCoachingCtaBand } from "@/lib/life-coaching/page";

/** Closing solid-dark CTA band for the LifeCoaching page. */
export function LifeCoachingCta({
  eyebrow,
  title,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
}: LifeCoachingCtaBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-lc-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="lc-cta" aria-labelledby="lc-cta-heading">
      <div className="lc-cta-inner">
        {eyebrow ? (
          <span className="js-lc-cta-reveal lc-eyebrow lc-cta-eyebrow">
            {eyebrow}
          </span>
        ) : null}
        <h2 id="lc-cta-heading" className="js-lc-cta-reveal lc-cta-heading">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-lc-cta-reveal lc-cta-body">{body}</p> : null}
        <div className="js-lc-cta-reveal lc-cta-btns">
          <Link href={primaryCta.href} className="lc-btn-white">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="lc-btn-ghost">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
