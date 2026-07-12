"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { LifeCoachingHero as LifeCoachingHeroConfig } from "@/lib/life-coaching/page";

/** Centered, full-bleed photo hero for the LifeCoaching page (sits behind the nav). */
export function LifeCoachingHero({
  eyebrow,
  title,
  titleAccent,
  sub,
  primaryCta,
  secondaryCta,
}: LifeCoachingHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".lc-hero-bg"), {
      scale: 1.06,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-lc-hero-reveal"), {
      y: 26,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.15,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="lc-hero" aria-labelledby="lc-hero-title">
      <div aria-hidden className="lc-hero-bg" />
      <div className="lc-hero-inner">
        {eyebrow ? (
          <p className="js-lc-hero-reveal hero-eyebrow">{eyebrow}</p>
        ) : null}
        <h1 id="lc-hero-title" className="js-lc-hero-reveal hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-lc-hero-reveal hero-sub">{sub}</p> : null}
        <div className="js-lc-hero-reveal lc-hero-btns">
          <Link href={primaryCta.href} className="lc-btn-white">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="lc-btn-ghost">
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
