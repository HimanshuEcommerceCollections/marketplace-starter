"use client";

import Image from "next/image";
import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { AboutCta as AboutCtaConfig } from "@/lib/about/page";

/** Closing dark CTA band for the About page; an optional photo sits behind a
 *  dark scrim, otherwise the band stays solid-dark. */
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

  return (
    <section ref={scope} className="ab-cta" aria-labelledby="ab-cta-heading">
      {image ? (
        <div aria-hidden className="ab-cta-bg">
          <Image src={image} alt="" fill sizes="100vw" />
        </div>
      ) : null}
      <div className="ab-cta-inner">
        {eyebrow ? (
          <p className="js-ab-cta-reveal ab-cta-eyebrow">{eyebrow}</p>
        ) : null}
        <h2 id="ab-cta-heading" className="js-ab-cta-reveal ab-cta-heading">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h2>
        {body ? <p className="js-ab-cta-reveal ab-cta-body">{body}</p> : null}
        <div className="js-ab-cta-reveal ab-cta-btns">
          <Link href={primaryCta.href} className="ab-btn-white">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="ab-btn-ghost">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
