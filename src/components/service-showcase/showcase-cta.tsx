"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ShowcaseCtaBand } from "@/lib/service-showcase/page";

/** Closing photo CTA band for a showcase page. */
export function ShowcaseCta({
  eyebrow,
  title,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
}: ShowcaseCtaBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-ssp-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="ssp-cta" aria-labelledby="ssp-cta-heading">
      <div className="ssp-cta-inner">
        {eyebrow ? (
          <p className="js-ssp-cta-reveal ssp-eyebrow ssp-cta-eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h2 id="ssp-cta-heading" className="js-ssp-cta-reveal ssp-cta-heading">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-ssp-cta-reveal ssp-cta-body">{body}</p> : null}
        <div className="js-ssp-cta-reveal ssp-cta-btns">
          <Link href={primaryCta.href} className="ssp-btn-p">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="ssp-btn-o">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
