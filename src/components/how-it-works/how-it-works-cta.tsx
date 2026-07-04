"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { HowItWorksCtaBand } from "@/lib/how-it-works/page";

/** Closing photo CTA band for the How It Works page. */
export function HowItWorksCta({
  eyebrow,
  title,
  titleLine2,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
}: HowItWorksCtaBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-hiw-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="hiw-cta" aria-labelledby="hiw-cta-heading">
      <div className="hiw-cta-inner">
        {eyebrow ? (
          <p className="js-hiw-cta-reveal hiw-eyebrow hiw-cta-eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h2 id="hiw-cta-heading" className="js-hiw-cta-reveal hiw-cta-heading">
          {title}
          {titleLine2 || titleAccent ? <br /> : null}
          {titleLine2 ? <>{titleLine2} </> : null}
          {titleAccent ? <em>{titleAccent}</em> : null}
        </h2>
        {body ? <p className="js-hiw-cta-reveal hiw-cta-body">{body}</p> : null}
        <div className="js-hiw-cta-reveal hiw-cta-btns">
          <Link href={primaryCta.href} className="hiw-btn-p">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="hiw-btn-o">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
