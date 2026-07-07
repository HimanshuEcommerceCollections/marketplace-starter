"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { TermsDarkBand as TermsDarkBandConfig } from "@/lib/terms/page";

/** Closing dark CTA band for the Terms page. */
export function TermsDarkBand({
  eyebrow,
  title,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
  chips,
}: TermsDarkBandConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-terms-band-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="terms-band" aria-labelledby="terms-band-heading">
      <div className="terms-band-inner">
        {eyebrow ? (
          <p className="js-terms-band-reveal terms-eyebrow">{eyebrow}</p>
        ) : null}
        <h2 id="terms-band-heading" className="js-terms-band-reveal">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-terms-band-reveal terms-band-body">{body}</p> : null}
        <div className="js-terms-band-reveal terms-band-btns">
          <Link href={primaryCta.href} className="terms-btn-p">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="terms-btn-glass">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
        {chips.length > 0 ? (
          <div className="js-terms-band-reveal terms-band-meta">
            {chips.map((chip) => (
              <span key={chip} className="terms-chip">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
