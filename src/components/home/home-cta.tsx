"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { useGsap, gsap, prefersReducedMotion } from "@/lib/anim/use-gsap";
import type { NavItem } from "@/lib/brand/types";

export interface HomeCtaProps {
  eyebrow?: string;
  title: string;
  body?: string;
  primaryCta: NavItem;
}

export function HomeCta({ eyebrow, title, body, primaryCta }: HomeCtaProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  // Split "... require a commute." -> accent the closing phrase if present.
  const splitAt = title.indexOf("require ");
  const lead = splitAt >= 0 ? title.slice(0, splitAt + "require ".length) : title;
  const emphasis = splitAt >= 0 ? title.slice(splitAt + "require ".length) : "";

  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 78%" },
      y: 36,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  // Magnetic button (motion + fine pointer only).
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const finePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion() || !finePointer) return;

    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () =>
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      btn.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={scope}
      aria-labelledby="cta-heading"
      className="bg-foreground py-24 text-center md:py-32"
    >
      <Container className="flex flex-col items-center">
        {eyebrow ? (
          <p className="js-cta-reveal mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id="cta-heading"
          className="js-cta-reveal max-w-3xl font-display text-4xl font-normal leading-tight tracking-tight text-background md:text-6xl"
        >
          {lead}
          {emphasis ? <em className="italic text-primary">{emphasis}</em> : null}
        </h2>
        {body ? (
          <p className="js-cta-reveal mt-5 max-w-xl text-sm text-background/55">{body}</p>
        ) : null}
        <Link
          ref={btnRef}
          href={primaryCta.href}
          className="js-cta-reveal mt-10 inline-flex items-center gap-2 rounded-full bg-background px-9 py-3.5 text-sm font-medium text-foreground transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
        >
          {primaryCta.label} →
        </Link>
      </Container>
    </section>
  );
}
