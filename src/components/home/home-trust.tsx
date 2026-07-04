"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { useGsap, gsap, prefersReducedMotion } from "@/lib/anim/use-gsap";
import type { TestimonialItem } from "@/lib/brand/types";

export interface HomeTrustProps {
  heading?: string;
  headingAccent?: string;
  subheading?: string;
  items: TestimonialItem[];
}

export function HomeTrust({ heading, headingAccent, subheading, items }: HomeTrustProps) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-trust-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top bottom", once: true },
      y: 30,
      autoAlpha: 0,
      duration: 0.72,
      stagger: 0.12,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".home-trust-card"), {
      scrollTrigger: { trigger: scope, start: "top bottom", once: true },
      y: 40,
      autoAlpha: 0,
      scale: 0.97,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
    });
  }, []);

  // 3D tilt on pointer (motion + fine pointer only).
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const finePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion() || !finePointer) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".home-trust-card"));
    const cleanups = cards.map((card) => {
      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateY: x * 17,
          rotateX: -y * 17,
          transformPerspective: 900,
          duration: 0.4,
          ease: "power2.out",
        });
      };
      const onLeave = () =>
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.85, ease: "elastic.out(1,0.6)" });
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [items, scope]);

  return (
    <section ref={scope} className="home-trust" aria-labelledby="trust-heading">
      <Container>
        <div className="js-trust-intro">
          <p className="home-eyebrow">What people say</p>
          {heading ? (
            <h2 id="trust-heading" className="home-trust-heading">
              {heading}
              {headingAccent ? (
                <>
                  <br />
                  <em>{headingAccent}</em>
                </>
              ) : null}
            </h2>
          ) : null}
          {subheading ? (
            <p className="mt-3 max-w-xl text-base text-muted-foreground">{subheading}</p>
          ) : null}
        </div>

        <ul role="list" className="home-trust-grid mt-11 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="home-trust-card">
              <figure className="flex h-full flex-col">
                <div aria-hidden className="home-trust-stars mb-3.5">
                  ★★★★★
                </div>
                <blockquote className="home-trust-quote">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="home-trust-meta mt-5 flex flex-wrap items-center gap-2">
                  {item.author}
                  {item.role ? <span>· {item.role}</span> : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
