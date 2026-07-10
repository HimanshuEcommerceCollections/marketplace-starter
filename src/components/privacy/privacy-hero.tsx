"use client";

import { useEffect } from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { PrivacyHero as PrivacyHeroConfig } from "@/lib/privacy/page";

/** Centered full-bleed photo hero for the Privacy page. */
export function PrivacyHero({
  eyebrow,
  title,
  titleAccent,
  sub,
  image,
}: PrivacyHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".pv-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-pv-hero-reveal"), {
      y: 34,
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
    const el = scope.current?.querySelector<HTMLElement>(".pv-hero-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="pv-hero" aria-labelledby="pv-hero-title">
      <div aria-hidden className="pv-hero-bg" />
      {eyebrow ? (
        <p className="js-pv-hero-reveal pv-hero-eyebrow">{eyebrow}</p>
      ) : null}
      <h1 id="pv-hero-title" className="js-pv-hero-reveal pv-hero-title">
        {title}
        {titleAccent ? (
          <>
            <br />
            <em>{titleAccent}</em>
          </>
        ) : null}
      </h1>
      {sub ? <p className="js-pv-hero-reveal pv-hero-sub">{sub}</p> : null}
    </section>
  );
}
