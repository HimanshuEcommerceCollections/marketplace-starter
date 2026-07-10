"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { AboutCta as AboutCtaConfig } from "@/lib/about/page";

/** Closing full-bleed photo CTA band for the About page. */
export function AboutCta({
  eyebrow,
  title,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
  image,
}: AboutCtaConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-ab-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  // Paint the background from config (inline style is linted out); runs even
  // under reduced motion so the photo always shows.
  useEffect(() => {
    const el = scope.current?.querySelector<HTMLElement>(".ab-cta-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="ab-cta" aria-labelledby="ab-cta-heading">
      <div aria-hidden className="ab-cta-bg" />
      <div className="ab-cta-inner">
        {eyebrow ? (
          <p className="js-ab-cta-reveal ab-eyebrow ab-cta-eyebrow">{eyebrow}</p>
        ) : null}
        <h2 id="ab-cta-heading" className="js-ab-cta-reveal ab-cta-heading">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-ab-cta-reveal ab-cta-body">{body}</p> : null}
        <div className="js-ab-cta-reveal ab-cta-btns">
          <Link href={primaryCta.href} className="ab-btn-p">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="ab-btn-glass">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
