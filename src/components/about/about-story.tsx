"use client";

import Image from "next/image";
import { useGsap } from "@/lib/anim/use-gsap";
import type { AboutStory as AboutStoryConfig } from "@/lib/about/page";

/** Two-column origin story: kicker + narrative on the left, photo right. */
export function AboutStory({
  kicker,
  heading,
  headingAccent,
  paragraphs,
  image,
}: AboutStoryConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".ab-story-txt"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 32,
      autoAlpha: 0,
      duration: 0.8,
      delay: 0.15,
      ease: "power3.out",
    });
    gsap.from(scope.querySelector(".ab-story-img"), {
      scrollTrigger: { trigger: scope, start: "top 80%", once: true },
      y: 48,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} className="ab-story" aria-labelledby="ab-story-heading">
      <div className="ab-story-grid">
        <div className="ab-story-txt">
          {kicker ? <p className="ab-kicker">{kicker}</p> : null}
          <h2 id="ab-story-heading">
            {heading}
            {headingAccent ? (
              <>
                {" "}
                <em>{headingAccent}</em>
              </>
            ) : null}
          </h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="ab-story-body">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="ab-story-img">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 60rem) 45vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
