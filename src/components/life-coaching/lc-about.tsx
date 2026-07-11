"use client";

import Image from "next/image";
import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { LifeCoachingAboutSection } from "@/lib/life-coaching/page";

const CheckIcon = getPhosphorIcon("CheckCircle");

/** "What to expect" — two-column split: ruled kicker + copy + check-list, photo. */
export function LifeCoachingAbout({
  kicker,
  heading,
  paragraphs,
  points,
  image,
}: LifeCoachingAboutSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".lc-about-img"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 48,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
    });
    gsap.from(scope.querySelector(".lc-about-txt"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 32,
      autoAlpha: 0,
      duration: 0.8,
      delay: 0.15,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="lc-about" aria-labelledby="lc-about-heading">
      <div className="lc-about-grid">
        <div className="lc-about-txt">
          {kicker ? <div className="lc-kicker">{kicker}</div> : null}
          <h2 id="lc-about-heading">
            {heading.lead}{" "}
            {heading.accent ? <em>{heading.accent}</em> : null}
            {heading.trail ? <> {heading.trail}</> : null}
          </h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="lc-about-points">
            {points.map((point) => (
              <li key={point}>
                <CheckIcon weight="regular" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="lc-about-img">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 60rem) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
