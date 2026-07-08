"use client";

import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import type { MassageHero as MassageHeroConfig } from "@/lib/massage/page";

/** Full-bleed photo hero for the Massage page (sits behind the floating nav). */
export function MassageHero({
  eyebrow,
  title,
  titleAccent,
  sub,
  primaryCta,
  secondaryCta,
}: MassageHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".msg-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-msg-hero-reveal"), {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="msg-hero" aria-labelledby="msg-hero-title">
      <div aria-hidden className="msg-hero-bg" />
      <div className="msg-hero-inner">
        {eyebrow ? (
          <p className="js-msg-hero-reveal msg-eyebrow msg-hero-eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <h1 id="msg-hero-title" className="js-msg-hero-reveal msg-hero-title">
          {title}
          {titleAccent ? (
            <>
              <br />
              <em>{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {sub ? <p className="js-msg-hero-reveal msg-hero-sub">{sub}</p> : null}
        <div className="js-msg-hero-reveal msg-hero-btns">
          <Link href={primaryCta.href} className="msg-btn-p">
            {primaryCta.label} →
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="msg-btn-o">
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
