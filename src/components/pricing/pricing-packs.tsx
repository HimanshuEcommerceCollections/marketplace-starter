"use client";

import Link from "next/link";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import { useGsap } from "@/lib/anim/use-gsap";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { PricingPageConfig } from "@/lib/pricing/page";

const CheckIcon = getPhosphorIcon("CheckCircle");

/** Whole-dollar price for a pack, e.g. 33900 -> "$339". */
function dollars(minor: number): string {
  return formatMoney({ amount: minor, currency: "USD" }).replace(/\.00$/, "");
}

/**
 * Session Packs. STATIC illustrative content — there is no purchase/credit
 * backend yet; the note under the grid says so. Cards reveal on scroll.
 */
export function PricingPacks({
  eyebrow,
  heading,
  subheading,
  tiers,
  note,
}: PricingPageConfig["packs"]) {
  const scope = useGsap<HTMLElement>(({ gsap }) => {
    gsap.utils.toArray<HTMLElement>(".js-pr-pack").forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 48,
        duration: 0.7,
        ease: "power3.out",
        delay: i * 0.12,
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
      });
    });
  }, []);

  return (
    <section ref={scope} className="pr-packs" aria-labelledby="pr-packs-heading">
      <div className="pr-packs-inner">
        <div className="pr-section-head">
          {eyebrow ? <p className="pr-eyebrow">{eyebrow}</p> : null}
          <h2 id="pr-packs-heading">{heading}</h2>
          {subheading ? <p>{subheading}</p> : null}
        </div>

        <div className="pr-packs-grid">
          {tiers.map((t) => (
            <div
              key={t.slug}
              className={cn("js-pr-pack pr-pack-card", t.featured && "is-popular")}
            >
              {t.featured ? <span className="pr-pack-badge">Most Popular</span> : null}
              <h3 className="pr-pack-name">{t.name}</h3>
              <p className="pr-pack-tagline">{t.tagline}</p>
              <p className="pr-pack-price">
                {dollars(t.priceMinor)}
                <span className="pr-pack-mo">{t.cadence}</span>
              </p>
              <p className="pr-pack-per">{t.per}</p>
              {t.save ? <span className="pr-pack-save">{t.save}</span> : null}
              <ul className="pr-pack-features">
                {t.features.map((f) => (
                  <li key={f}>
                    <CheckIcon weight="fill" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={t.cta.href} className="pr-pack-btn">
                {t.cta.label}
              </Link>
            </div>
          ))}
        </div>

        {note ? <p className="pr-packs-note">{note}</p> : null}
      </div>
    </section>
  );
}
