"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { YogaCtaBand } from "@/lib/yoga/page";

/** Closing solid-dark CTA band for the Yoga page. */
export function YogaCta({
  eyebrow,
  title,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
}: YogaCtaBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-yoga-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="yoga-cta" aria-labelledby="yoga-cta-heading">
      <div className="yoga-cta-inner">
        {eyebrow ? (
          <span className="js-yoga-cta-reveal yoga-eyebrow yoga-cta-eyebrow">
            {eyebrow}
          </span>
        ) : null}
        <h2 id="yoga-cta-heading" className="js-yoga-cta-reveal yoga-cta-heading">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-yoga-cta-reveal yoga-cta-body">{body}</p> : null}
        <div className="js-yoga-cta-reveal yoga-cta-btns">
          <Link href={primaryCta.href} className="yoga-btn-white">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="yoga-btn-ghost">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
