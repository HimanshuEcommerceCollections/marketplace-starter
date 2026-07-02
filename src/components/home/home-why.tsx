"use client";

import { useEffect } from "react";
import { ShieldCheck } from "@phosphor-icons/react";
import { Container } from "@/components/layout/container";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import { useGsap, gsap, prefersReducedMotion } from "@/lib/anim/use-gsap";
import type { WhyCard } from "@/lib/brand/types";
import { cn } from "@/lib/utils";

export interface HomeWhyProps {
  eyebrow?: string;
  heading: string;
  sub?: string;
  trustBadge?: string;
  cards: WhyCard[];
}

export function HomeWhy({ eyebrow, heading, sub, trustBadge, cards }: HomeWhyProps) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-why-intro > *"), {
      scrollTrigger: { trigger: scope, start: "top bottom", once: true },
      y: 42,
      autoAlpha: 0,
      duration: 0.82,
      stagger: 0.12,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".home-why-card"), {
      scrollTrigger: { trigger: scope, start: "top bottom", once: true },
      y: 48,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.07,
      ease: "power3.out",
      clearProps: "transform",
    });
  }, []);

  // 3D tilt on pointer (motion + fine pointer only).
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const finePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion() || !finePointer) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>(".home-why-card"));
    const cleanups = els.map((card) => {
      // Hovered card lifts; its siblings recede (featured card recedes less).
      const onEnter = () => {
        els.forEach((other) => {
          if (other === card) return;
          gsap.to(other, {
            scale: other.classList.contains("is-featured") ? 0.985 : 0.97,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      };
      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateY: x * 10,
          rotateX: -y * 10,
          y: -8,
          scale: 1.02,
          transformPerspective: 900,
          duration: 0.4,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "elastic.out(1,0.6)",
        });
        els.forEach((other) => {
          if (other === card) return;
          gsap.to(other, { scale: 1, duration: 0.5, ease: "power2.out" });
        });
      };
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [cards, scope]);

  return (
    <section ref={scope} className="home-why" aria-labelledby="why-heading">
      <Container size="full" className="home-why-grid-wrap">
        <div className="js-why-intro home-why-intro">
          {eyebrow ? <p className="home-eyebrow">{eyebrow}</p> : null}
          <h2 id="why-heading" className="home-why-heading">
            {heading}
          </h2>
          {sub ? <p className="home-why-sub">{sub}</p> : null}
          {trustBadge ? (
            <p className="home-why-badge">
              <ShieldCheck className="size-4 shrink-0" weight="fill" aria-hidden />
              <span>{trustBadge}</span>
            </p>
          ) : null}
        </div>

        <ul role="list" className="home-why-grid">
          {cards.map((card) => {
            const Icon = getPhosphorIcon(card.icon);
            return (
              <li
                key={card.title}
                className={cn("home-why-card", card.featured && "is-featured")}
              >
                <span className="home-why-icon">
                  <Icon className="size-5" weight="regular" aria-hidden />
                </span>
                <h3 className="home-why-card-title">{card.title}</h3>
                <p className="home-why-card-body">{card.body}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
