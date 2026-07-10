"use client";

import { useEffect } from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { FaqHero as FaqHeroConfig } from "@/lib/faq/page";

/** Centered full-bleed photo hero for the FAQ page (sits behind the nav). */
export function FaqHero({ eyebrow, title, titleAccent, sub, image }: FaqHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".faqp-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-faqp-hero-reveal"), {
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
    const el = scope.current?.querySelector<HTMLElement>(".faqp-hero-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="faqp-hero" aria-labelledby="faqp-hero-title">
      <div aria-hidden className="faqp-hero-bg" />
      {eyebrow ? (
        <p className="js-faqp-hero-reveal faqp-eyebrow faqp-hero-eyebrow">{eyebrow}</p>
      ) : null}
      <h1 id="faqp-hero-title" className="js-faqp-hero-reveal faqp-hero-title">
        {title}
        {titleAccent ? (
          <>
            <br />
            <em>{titleAccent}</em>
          </>
        ) : null}
      </h1>
      {sub ? <p className="js-faqp-hero-reveal faqp-hero-sub">{sub}</p> : null}
    </section>
  );
}
