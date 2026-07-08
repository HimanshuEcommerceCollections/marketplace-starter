"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { MassageCtaBand } from "@/lib/massage/page";

/** Closing photo CTA band for the Massage page. */
export function MassageCta({
  eyebrow,
  title,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
}: MassageCtaBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-msg-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="msg-cta" aria-labelledby="msg-cta-heading">
      <div className="msg-cta-inner">
        {eyebrow ? (
          <p className="js-msg-cta-reveal msg-eyebrow msg-cta-eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h2 id="msg-cta-heading" className="js-msg-cta-reveal msg-cta-heading">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-msg-cta-reveal msg-cta-body">{body}</p> : null}
        <div className="js-msg-cta-reveal msg-cta-btns">
          <Link href={primaryCta.href} className="msg-btn-p">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="msg-btn-o">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
