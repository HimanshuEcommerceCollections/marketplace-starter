"use client";

import Image from "next/image";
import { useGsap } from "@/lib/anim/use-gsap";
import type { AboutHero as AboutHeroConfig } from "@/lib/about/page";

/** Centered full-bleed photo hero for the About page. */
export function AboutHero({ eyebrow, title, titleAccent, sub, image }: AboutHeroConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".ab-hero-bg"), {
      scale: 1.07,
      duration: 1.8,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".js-ab-hero-reveal"), {
      y: 34,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="ab-hero" aria-labelledby="ab-hero-title">
      {/* Server-rendered background photo (no JS dependency → shows on first
          paint). `priority` preloads it as the hero's LCP image. */}
      <div aria-hidden className="ab-hero-bg">
        <Image src={image} alt="" fill priority sizes="100vw" />
      </div>
      {eyebrow ? (
        <p className="js-ab-hero-reveal hero-eyebrow">{eyebrow}</p>
      ) : null}
      <h1 id="ab-hero-title" className="js-ab-hero-reveal hero-title">
        {title}
        {titleAccent ? (
          <>
            <br />
            <em>{titleAccent}</em>
          </>
        ) : null}
      </h1>
      {sub ? <p className="js-ab-hero-reveal hero-sub">{sub}</p> : null}
    </section>
  );
}
