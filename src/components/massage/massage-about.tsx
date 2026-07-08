"use client";

import Image from "next/image";
import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { MassageAboutSection } from "@/lib/massage/page";

const CheckIcon = getPhosphorIcon("CheckCircle");

/** "What to expect" — two-column split: ruled kicker + copy + check-list, photo. */
export function MassageAbout({
  kicker,
  heading,
  paragraphs,
  points,
  image,
}: MassageAboutSection) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".msg-about-img"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 48,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
    });
    gsap.from(scope.querySelector(".msg-about-txt"), {
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
      className="msg-about"
      aria-labelledby="msg-about-heading"
    >
      <div className="msg-about-grid">
        <div className="msg-about-txt">
          {kicker ? <div className="msg-kicker">{kicker}</div> : null}
          <h2 id="msg-about-heading">{heading}</h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="msg-about-points">
            {points.map((point) => (
              <li key={point}>
                <CheckIcon weight="regular" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="msg-about-img">
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
