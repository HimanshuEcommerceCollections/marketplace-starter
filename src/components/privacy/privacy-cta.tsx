"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { PrivacyCta as PrivacyCtaConfig } from "@/lib/privacy/page";

/** Closing solid-dark CTA band for the Privacy page. */
export function PrivacyCta({
  eyebrow,
  title,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
  chips,
}: PrivacyCtaConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-pv-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
    gsap.from(scope.querySelectorAll(".pv-cta-chip"), {
      scrollTrigger: {
        trigger: scope.querySelector(".pv-cta-chips"),
        start: "top 88%",
        once: true,
      },
      y: 20,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, []);

  return (
    <section ref={scope} className="pv-cta" aria-labelledby="pv-cta-heading">
      <div className="pv-cta-inner">
        {eyebrow ? (
          <p className="js-pv-cta-reveal pv-cta-eyebrow">{eyebrow}</p>
        ) : null}
        <h2 id="pv-cta-heading" className="js-pv-cta-reveal pv-cta-heading">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-pv-cta-reveal pv-cta-body">{body}</p> : null}
        <div className="js-pv-cta-reveal pv-cta-btns">
          <Link href={primaryCta.href} className="pv-btn-white">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="pv-btn-ghost">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
        {chips.length > 0 ? (
          <div className="pv-cta-chips">
            {chips.map((chip) => (
              <span key={chip} className="pv-cta-chip">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
