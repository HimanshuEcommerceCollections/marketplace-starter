"use client";

import { useEffect } from "react";
import { Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SampleBadge } from "@/components/shared/sample-badge";
import { useGsap, gsap, prefersReducedMotion } from "@/lib/anim/use-gsap";
import type { TestimonialItem } from "@/lib/brand/types";

export interface HomeTrustProps {
  heading?: string;
  subheading?: string;
  items: TestimonialItem[];
}

export function HomeTrust({ heading, subheading, items }: HomeTrustProps) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".home-trust-card"), {
      scrollTrigger: { trigger: scope.querySelector(".home-trust-grid"), start: "top 82%" },
      y: 32,
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.7,
      stagger: 0.12,
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
          rotateY: x * 12,
          rotateX: -y * 12,
          transformPerspective: 800,
          duration: 0.4,
          ease: "power2.out",
        });
      };
      const onLeave = () =>
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1,0.6)" });
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
    <section ref={scope} className="bg-muted py-20 md:py-28" aria-labelledby="trust-heading">
      <Container>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
          What people say
        </p>
        {heading ? (
          <h2
            id="trust-heading"
            className="font-display text-3xl font-normal tracking-tight text-foreground md:text-5xl"
          >
            {heading}
          </h2>
        ) : null}
        {subheading ? (
          <p className="mt-3 max-w-xl text-base text-muted-foreground">{subheading}</p>
        ) : null}

        <ul role="list" className="home-trust-grid mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="home-trust-card rounded-2xl border border-border bg-card p-7 shadow-sm"
            >
              <figure className="flex h-full flex-col">
                <SampleBadge className="mb-3 self-start" />
                <div aria-hidden className="mb-3 flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                  {item.author}
                  {item.role ? <span>· {item.role}</span> : null}
                  <SampleBadge />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
