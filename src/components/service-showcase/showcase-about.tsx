"use client";

import Image from "next/image";
import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { ShowcaseAboutSection } from "@/lib/service-showcase/page";

const CheckIcon = getPhosphorIcon("CheckCircle");

/** "What to expect" — two-column split: ruled kicker + copy + check-list, photo. */
export function ShowcaseAbout({
  kicker,
  heading,
  paragraphs,
  points,
  image,
}: ShowcaseAboutSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".ssp-about-img"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 48,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
    });
    gsap.from(scope.querySelector(".ssp-about-txt"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 32,
      autoAlpha: 0,
      duration: 0.8,
      delay: 0.15,
      ease: "power3.out",
    });
  }, []);

  return (
    <section
      ref={scope}
      className="ssp-about"
      aria-labelledby="ssp-about-heading"
    >
      <div className="ssp-about-grid">
        <div className="ssp-about-txt">
          {kicker ? <div className="ssp-kicker">{kicker}</div> : null}
          <h2 id="ssp-about-heading">{heading}</h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="ssp-about-points">
            {points.map((point) => (
              <li key={point}>
                <CheckIcon weight="regular" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="ssp-about-img">
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
