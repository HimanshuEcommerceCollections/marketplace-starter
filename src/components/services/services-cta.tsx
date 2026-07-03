"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ServicesCtaBand } from "@/lib/services/page";

/** Closing photo CTA band for the services showcase page. */
export function ServicesCta({
  eyebrow,
  title,
  titleLine2,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
}: ServicesCtaBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-svcs-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="svcs-cta" aria-labelledby="svcs-cta-heading">
      <div className="svcs-cta-inner">
        {eyebrow ? <p className="js-svcs-cta-reveal svcs-eyebrow">{eyebrow}</p> : null}
        <h2 id="svcs-cta-heading" className="js-svcs-cta-reveal svcs-cta-heading">
          {title}
          {titleLine2 || titleAccent ? <br /> : null}
          {titleLine2 ? <>{titleLine2} </> : null}
          {titleAccent ? <em>{titleAccent}</em> : null}
        </h2>
        {body ? <p className="js-svcs-cta-reveal svcs-cta-body">{body}</p> : null}
        <div className="js-svcs-cta-reveal svcs-cta-btns">
          <Link href={primaryCta.href} className="svcs-btn-p">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="svcs-btn-o">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
