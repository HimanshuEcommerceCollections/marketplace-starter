"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGsap, prefersReducedMotion } from "@/lib/anim/use-gsap";
import type { NavItem } from "@/lib/brand/types";

export interface HomeHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
  imageSrc?: string;
  imageAlt?: string;
  photos?: { src: string; alt: string; label: string }[];
  videoSrc?: string;
  videoPoster?: string;
  photoSequence?: string[];
}

export function HomeHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  videoSrc,
  videoPoster,
  photoSequence = [],
}: HomeHeroProps) {
  // "Move. Heal. Thrive." -> three uppercase lines, last one accented.
  const lines = title.split(/(?<=\.)\s+/).filter(Boolean);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    const q = gsap.utils.selector(scope);

    // Entrance timeline.
    gsap.set(q(".home-hero-line-inner"), { yPercent: 110 });
    gsap.set([q(".js-hero-eyebrow"), q(".js-hero-sub"), q(".js-hero-btns"), q(".js-hero-scroll")], {
      autoAlpha: 0,
      y: 14,
    });
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .to(q(".js-hero-eyebrow"), { autoAlpha: 1, y: 0, duration: 0.7 }, 0.15)
      .to(q(".home-hero-line-inner"), { yPercent: 0, duration: 1.05, stagger: 0.13 }, 0.3)
      .to(q(".js-hero-sub"), { autoAlpha: 1, y: 0, duration: 0.8 }, 0.85)
      .to(q(".js-hero-btns"), { autoAlpha: 1, y: 0, duration: 0.7 }, 1.05)
      .to(q(".js-hero-scroll"), { autoAlpha: 1, y: 0, duration: 0.7 }, 1.4);

    // Scroll-scrubbed media: video fades, photos crossfade through, ambient
    // layers dissolve into the next section.
    const imgs = q(".home-hero-image");
    if (imgs.length) {
      const media = gsap.timeline({
        scrollTrigger: { trigger: scope, start: "top top", end: "+=220%", scrub: 1.1 },
      });
      media.to(q(".home-hero-video"), { opacity: 0, duration: 1 }, 0);
      media.to(imgs[0], { opacity: 1, duration: 1 }, 0.15);
      imgs.forEach((img, i) => {
        if (i === 0) return;
        media.to(imgs[i - 1], { opacity: 0, duration: 1 }, i * 2);
        media.to(img, { opacity: 1, duration: 1 }, i * 2);
      });
      const last = imgs.length * 2;
      media.to(imgs[imgs.length - 1], { opacity: 0, duration: 1 }, last);
      media.to(
        q(".home-hero-atmosphere, .home-hero-breath, .home-hero-overlay, .home-hero-scrim"),
        { opacity: 0, duration: 1 },
        last,
      );
    }

    // Parallax the copy out as the hero pins away.
    gsap.to(q(".js-hero-eyebrow, .home-hero-line-inner"), {
      scrollTrigger: { trigger: scope, start: "top top", end: "+=50%", scrub: 1.2 },
      y: -80,
      opacity: 0,
    });
    gsap.to(q(".js-hero-sub, .js-hero-btns"), {
      scrollTrigger: { trigger: scope, start: "top top", end: "+=45%", scrub: 1.2 },
      y: -50,
      opacity: 0,
    });
  }, [photoSequence.length]);

  // Paint the crossfade backgrounds from data attributes (inline style is
  // linted out). Under reduced motion, freeze the video and show frame one.
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const imgs = Array.from(root.querySelectorAll<HTMLElement>(".home-hero-image"));
    for (const el of imgs) {
      const src = el.dataset.bg;
      if (src) el.style.backgroundImage = `url(${src})`;
    }
    if (prefersReducedMotion()) {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.style.opacity = "0";
      }
      if (imgs[0]) imgs[0].style.opacity = "1";
    }
  }, [scope, photoSequence]);

  return (
    <section ref={scope} aria-labelledby="hero-heading" className="home-hero">
      <div aria-hidden className="home-hero-media">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="home-hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster={videoPoster}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : null}
        {photoSequence.map((src) => (
          <div key={src} className="home-hero-image" data-bg={src} />
        ))}
      </div>
      <div aria-hidden className="home-hero-overlay" />
      <div aria-hidden className="home-hero-atmosphere" />
      <div aria-hidden className="home-hero-breath" />
      <div aria-hidden className="home-hero-scrim" />

      <div className="home-hero-content">
        {eyebrow ? (
          <p className="js-hero-eyebrow home-hero-eyebrow">{eyebrow}</p>
        ) : null}

        <h1 id="hero-heading" className="home-hero-title">
          {lines.map((line, i) => (
            <span key={line} className="home-hero-line">
              <span
                className={
                  i === lines.length - 1
                    ? "home-hero-line-inner home-hero-line-accent"
                    : "home-hero-line-inner"
                }
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        {subtitle ? <p className="js-hero-sub home-hero-sub">{subtitle}</p> : null}

        <div className="js-hero-btns home-hero-btns">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90 focus-visible:ring-offset-transparent"
          >
            <Link href={primaryCta.href}>{primaryCta.label} →</Link>
          </Button>
          {secondaryCta ? (
            <Link href={secondaryCta.href} className="home-hero-btn-ghost">
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>
      </div>

      <div aria-hidden className="js-hero-scroll home-hero-scroll">
        <span className="home-hero-scroll-line" />
        <span className="home-hero-scroll-label">Scroll</span>
      </div>
    </section>
  );
}
