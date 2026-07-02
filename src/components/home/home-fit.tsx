"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Container } from "@/components/layout/container";
import { useGsap } from "@/lib/anim/use-gsap";
import type { FitCard } from "@/lib/brand/types";
import { cn } from "@/lib/utils";

export interface HomeFitProps {
  eyebrow?: string;
  heading: string;
  sub?: string;
  cards: FitCard[];
}

export function HomeFit({ eyebrow, heading, sub, cards }: HomeFitProps) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".home-fit-card"), {
      scrollTrigger: { trigger: scope.querySelector(".home-fit-grid"), start: "top 85%" },
      y: 38,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.07,
      ease: "power2.out",
      clearProps: "transform",
    });
  }, []);

  // Split the heading so a trailing clause can be accented (mirrors the mockup).
  const words = heading.split(" ");
  const accentFrom = Math.max(1, words.length - 3);
  const headLead = words.slice(0, accentFrom).join(" ");
  const headAccent = words.slice(accentFrom).join(" ");

  return (
    <section ref={scope} className="home-fit" aria-labelledby="fit-heading">
      <Container>
        {eyebrow ? <p className="home-eyebrow">{eyebrow}</p> : null}
        <h2 id="fit-heading" className="home-fit-heading">
          {headLead} <em>{headAccent}</em>
        </h2>
        {sub ? <p className="home-fit-sub">{sub}</p> : null}

        <ul role="list" className="home-fit-grid">
          {cards.map((card) => (
            <li key={card.title}>
              <Link
                href={card.href}
                className={cn("home-fit-card", card.dark && "is-dark")}
              >
                <div>
                  <div className="home-fit-title">{card.title}</div>
                  <div className="home-fit-sub-line">
                    <span aria-hidden>→</span> {card.sub}
                  </div>
                </div>
                <ArrowUpRight className="home-fit-arrow size-5" weight="bold" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
