"use client";

import { useEffect } from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ForProsHero as ForProsHeroConfig } from "@/lib/for-pros/page";

/** Full-bleed photo hero for the For Pros page (sits behind the floating nav). */
export function ForProsHero({
  eyebrow,
  title,
  titleAccent,
  sub,
  image,
  primaryCta,
  secondaryCta,
}: ForProsHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".fp-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-fp-hero-reveal"), {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  // Paint the background from config (inline style is linted out); runs even
  // under reduced motion so the photo always shows.
  useEffect(() => {
    const el = scope.current?.querySelector<HTMLElement>(".fp-hero-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="fp-hero" aria-labelledby="fp-hero-title">
      <div aria-hidden className="fp-hero-bg" />
      <div className="fp-hero-inner">
        {eyebrow ? (
          <p className="js-fp-hero-reveal fp-eyebrow fp-hero-eyebrow">{eyebrow}</p>
        ) : null}
        <h1 id="fp-hero-title" className="js-fp-hero-reveal fp-hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-fp-hero-reveal fp-hero-sub">{sub}</p> : null}
        <div className="js-fp-hero-reveal fp-hero-btns">
          <a href={primaryCta.href} className="fp-btn-p">
            {primaryCta.label} →
          </a>
          {secondaryCta ? (
            <a href={secondaryCta.href} className="fp-btn-o">
              {secondaryCta.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
