"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ShowcaseHero as ShowcaseHeroConfig } from "@/lib/service-showcase/page";

/** Full-bleed photo hero for a showcase page (sits behind the floating nav). */
export function ShowcaseHero({
  eyebrow,
  title,
  titleAccent,
  sub,
  primaryCta,
  secondaryCta,
}: ShowcaseHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".ssp-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-ssp-hero-reveal"), {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="ssp-hero" aria-labelledby="ssp-hero-title">
      <div aria-hidden className="ssp-hero-bg" />
      <div className="ssp-hero-inner">
        {eyebrow ? (
          <p className="js-ssp-hero-reveal ssp-eyebrow ssp-hero-eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h1 id="ssp-hero-title" className="js-ssp-hero-reveal ssp-hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-ssp-hero-reveal ssp-hero-sub">{sub}</p> : null}
        <div className="js-ssp-hero-reveal ssp-hero-btns">
          <Link href={primaryCta.href} className="ssp-btn-p">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="ssp-btn-o">
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
