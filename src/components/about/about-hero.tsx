"use client";

import { useEffect } from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { AboutHero as AboutHeroConfig } from "@/lib/about/page";

/** Full-bleed photo hero for the About page (sits behind the floating nav). */
export function AboutHero({
  eyebrow,
  title,
  titleAccent,
  sub,
  image,
}: AboutHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".ab-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-ab-hero-reveal"), {
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
    const el = scope.current?.querySelector<HTMLElement>(".ab-hero-bg");
    if (el) el.style.backgroundImage = `url(${image})`;
  }, [scope, image]);

  return (
    <section ref={scope} className="ab-hero" aria-labelledby="ab-hero-title">
      <div aria-hidden className="ab-hero-bg" />
      <div className="ab-hero-inner">
        {eyebrow ? (
          <p className="js-ab-hero-reveal ab-eyebrow ab-hero-eyebrow">{eyebrow}</p>
        ) : null}
        <h1 id="ab-hero-title" className="js-ab-hero-reveal ab-hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-ab-hero-reveal ab-hero-sub">{sub}</p> : null}
      </div>
    </section>
  );
}
