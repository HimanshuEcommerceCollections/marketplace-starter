"use client";

import Image from "next/image";
import { useGsap } from "@/lib/anim/use-gsap";
import type { ContactHero as ContactHeroConfig } from "@/lib/contact/page";

/** Centered full-bleed photo hero for the Contact page. */
export function ContactHero({
  eyebrow,
  title,
  titleAccent,
  sub,
  image,
}: ContactHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".ct-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-ct-hero-reveal"), {
      y: 34,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="ct-hero" aria-labelledby="ct-hero-title">
      {/* Server-rendered background photo (no JS dependency → shows on first
          paint). `priority` preloads it as the hero's LCP image. */}
      <div aria-hidden className="ct-hero-bg">
        <Image src={image} alt="" fill priority sizes="100vw" />
      </div>
      {eyebrow ? (
        <p className="js-ct-hero-reveal hero-eyebrow">{eyebrow}</p>
      ) : null}
      <h1 id="ct-hero-title" className="js-ct-hero-reveal hero-title">
        {title}
        {titleAccent ? (
          <>
            <br />
            <em>{titleAccent}</em>
          </>
        ) : null}
      </h1>
      {sub ? <p className="js-ct-hero-reveal hero-sub">{sub}</p> : null}
    </section>
  );
}
