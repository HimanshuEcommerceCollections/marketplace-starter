"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { PricingPageConfig } from "@/lib/pricing/page";

/** Closing photo CTA band for the Pricing page. */
export function PricingCta({
  eyebrow,
  title,
  titleAccent,
  body,
  primaryCta,
}: PricingPageConfig["cta"]) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-pr-cta"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="pr-cta" aria-labelledby="pr-cta-heading">
      <div className="pr-cta-inner">
        {eyebrow ? <p className="js-pr-cta pr-eyebrow">{eyebrow}</p> : null}
        <h2 id="pr-cta-heading" className="js-pr-cta pr-cta-heading">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-pr-cta pr-cta-body">{body}</p> : null}
        <div className="js-pr-cta">
          <Link href={primaryCta.href} className="pr-btn-p">
            {primaryCta.label} →
          </Link>
        </div>
      </div>
    </section>
  );
}
