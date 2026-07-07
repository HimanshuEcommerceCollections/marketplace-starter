"use client";

import Link from "next/link";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import { useGsap } from "@/lib/anim/use-gsap";
import type { PricingFactor } from "@/lib/pricing/page";

/** A ready-to-render service pricing card (assembled server-side from the catalog). */
export interface PricingServiceCardVM {
  slug: string;
  title: string;
  /** Lucide icon name from the catalog; resolved to a Phosphor glyph. */
  icon?: string;
  /** Pre-formatted whole-dollar "starting from" amount, e.g. "$109". */
  price: string;
  duration: string;
  points: string[];
  coordinator: boolean;
  ctaLabel: string;
  href: string;
}

export interface PricingServiceGridProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  cards: PricingServiceCardVM[];
  factors: { title: string; items: PricingFactor[] };
}

const SlidersIcon = getPhosphorIcon("SlidersHorizontal");
const CoordIcon = getPhosphorIcon("UserCheck");

/**
 * Service pricing grid + the "What shapes your price" factors panel. Cards
 * reveal on scroll (skipped under reduced motion by the hook). Coming-soon
 * services show a coordinator pill and route to the waitlist.
 */
export function PricingServiceGrid({
  eyebrow,
  heading,
  subheading,
  cards,
  factors,
}: PricingServiceGridProps) {
  const scope = useGsap<HTMLElement>(({ gsap }) => {
    gsap.utils.toArray<HTMLElement>(".js-pr-card").forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 36,
        duration: 0.6,
        ease: "power3.out",
        delay: (i % 4) * 0.07,
        scrollTrigger: { trigger: card, start: "top 90%", once: true },
      });
    });
    gsap.from(".pr-factors", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: ".pr-factors", start: "top 88%", once: true },
    });
  }, []);

  return (
    <section
      ref={scope}
      className="pr-grid-section"
      aria-labelledby="pr-grid-heading"
    >
      <div className="pr-section-head">
        {eyebrow ? <p className="pr-eyebrow">{eyebrow}</p> : null}
        <h2 id="pr-grid-heading">{heading}</h2>
        {subheading ? <p>{subheading}</p> : null}
      </div>

      <ul role="list" className="pr-svc-grid">
        {cards.map((c) => {
          const Icon = getPhosphorIcon(c.icon);
          return (
            <li key={c.slug} className="js-pr-card pr-svc-card">
              <div className="pr-svc-top">
                <span aria-hidden className="pr-svc-icon">
                  <Icon weight="regular" />
                </span>
                <span className="pr-svc-name">{c.title}</span>
              </div>

              <p className="pr-svc-price">
                <span className="f">Starting from</span>
                <span className="p">{c.price}</span>
              </p>
              <p className="pr-svc-dur">{c.duration}</p>

              {c.coordinator ? (
                <span className="pr-svc-coord">
                  <CoordIcon weight="fill" aria-hidden />
                  Coordinator-confirmed quote
                </span>
              ) : null}

              <ul className="pr-svc-conf">
                {c.points.map((p) => (
                  <li key={p}>
                    <SlidersIcon weight="regular" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>

              <Link href={c.href} className="pr-svc-btn">
                {c.ctaLabel} →
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="pr-factors">
        <p className="pr-factors-title">{factors.title}</p>
        <div className="pr-factors-grid">
          {factors.items.map((f) => {
            const FactorIcon = getPhosphorIcon(f.icon);
            return (
              <div key={f.title} className="pr-factor">
                <FactorIcon weight="regular" aria-hidden />
                <div>
                  <b>{f.title}</b>
                  <span>{f.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
