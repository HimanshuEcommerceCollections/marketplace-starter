"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useGsap } from "@/lib/anim/use-gsap";
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
}

export function HomeHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt = "",
  photos = [],
}: HomeHeroProps) {
  // "Your hour. Your home. Your pro." -> three serif lines, last one accented.
  const lines = title.split(/(?<=\.)\s+/).filter(Boolean);

  const scope = useGsap(({ gsap, scope }) => {
    const q = gsap.utils.selector(scope);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(q(".home-hero-line-inner"), { yPercent: 110 });
    gsap.set([q(".js-hero-eyebrow"), q(".js-hero-sub"), q(".js-hero-btns")], {
      autoAlpha: 0,
      y: 14,
    });
    gsap.set(q(".home-hero-photo"), { autoAlpha: 0, y: 36 });

    tl.to(q(".js-hero-eyebrow"), { autoAlpha: 1, y: 0, duration: 0.7 }, 0.1)
      .to(q(".home-hero-line-inner"), { yPercent: 0, duration: 1.05, stagger: 0.12 }, 0.2)
      .to(q(".js-hero-sub"), { autoAlpha: 1, y: 0, duration: 0.8 }, 0.6)
      .to(q(".js-hero-btns"), { autoAlpha: 1, y: 0, duration: 0.7 }, 0.78)
      .to(
        q(".home-hero-photo"),
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" },
        0.95,
      );
  }, []);

  return (
    <section ref={scope} aria-labelledby="hero-heading" className="home-hero bg-foreground">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      <div aria-hidden className="home-hero-overlay" />

      <Container className="home-hero-content flex flex-col items-center gap-7">
        {eyebrow ? (
          <p className="js-hero-eyebrow text-xs font-semibold uppercase tracking-widest text-white/55">
            {eyebrow}
          </p>
        ) : null}

        <h1 id="hero-heading" className="home-hero-title text-white">
          {lines.map((line, i) => (
            <span key={line} className="home-hero-line">
              <span
                className={
                  i === lines.length - 1
                    ? "home-hero-line-inner italic text-primary"
                    : "home-hero-line-inner"
                }
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        {subtitle ? (
          <p className="js-hero-sub max-w-md text-base leading-relaxed text-white/60">
            {subtitle}
          </p>
        ) : null}

        <div className="js-hero-btns flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-card px-7 text-foreground hover:bg-card/90 focus-visible:ring-offset-foreground"
          >
            <Link href={primaryCta.href}>
              {primaryCta.label}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="rounded-full px-4 py-2 text-sm text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {secondaryCta.label} →
            </Link>
          ) : null}
        </div>

        {photos.length > 0 ? (
          <ul role="list" className="mt-10 grid w-full max-w-4xl grid-cols-3 gap-3">
            {photos.map((photo) => (
              <li key={photo.label} className="home-hero-photo">
                <Image src={photo.src} alt={photo.alt} fill sizes="33vw" />
                <span className="absolute bottom-3 left-3 rounded-full bg-card/85 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                  {photo.label}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
