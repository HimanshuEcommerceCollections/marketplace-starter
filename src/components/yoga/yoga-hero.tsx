"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { YogaHero as YogaHeroConfig } from "@/lib/yoga/page";

/** Centered, full-bleed photo hero for the Yoga page (sits behind the nav). */
export function YogaHero({
  eyebrow,
  title,
  titleAccent,
  sub,
  primaryCta,
  secondaryCta,
}: YogaHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".yoga-hero-bg"), {
      scale: 1.06,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-yoga-hero-reveal"), {
      y: 26,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.15,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="yoga-hero" aria-labelledby="yoga-hero-title">
      <div aria-hidden className="yoga-hero-bg" />
      <div className="yoga-hero-inner">
        {eyebrow ? (
          <p className="js-yoga-hero-reveal yoga-eyebrow yoga-hero-eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h1 id="yoga-hero-title" className="js-yoga-hero-reveal yoga-hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-yoga-hero-reveal yoga-hero-sub">{sub}</p> : null}
        <div className="js-yoga-hero-reveal yoga-hero-btns">
          <Link href={primaryCta.href} className="yoga-btn-white">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="yoga-btn-ghost">
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
