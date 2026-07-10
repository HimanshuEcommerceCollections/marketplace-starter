"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { FaqDarkBand } from "@/lib/faq/page";

/** Closing dark photo band pointing unanswered visitors at a human. */
export function FaqBand({
  title,
  titleAccent,
  body,
  primaryCta,
  secondaryCta,
  image,
}: FaqDarkBand) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-faqp-band-reveal"), {
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
    const el = scope.current?.querySelector<HTMLElement>(".faqp-band-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="faqp-band" aria-labelledby="faqp-band-heading">
      <div aria-hidden className="faqp-band-bg" />
      <div className="faqp-band-inner">
        <h2 id="faqp-band-heading" className="js-faqp-band-reveal">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-faqp-band-reveal faqp-band-body">{body}</p> : null}
        <div className="js-faqp-band-reveal faqp-band-btns">
          <Link href={primaryCta.href} className="faqp-btn-p">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="faqp-btn-glass">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
