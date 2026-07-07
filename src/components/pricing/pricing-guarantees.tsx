"use client";

import { getPhosphorIcon } from "@/lib/icons-phosphor";
import { useGsap } from "@/lib/anim/use-gsap";
import type { PricingGuarantee } from "@/lib/pricing/page";

/** Dark full-bleed strip of price/booking guarantees. Reveals on scroll. */
export function PricingGuarantees({ items }: { items: PricingGuarantee[] }) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-pr-g"), {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: scope, start: "top 85%", once: true },
    });
  }, []);

  return (
    <section ref={scope} className="pr-guarantee" aria-label="Our guarantees">
      <div className="pr-guarantee-inner">
        {items.map((g) => {
          const Icon = getPhosphorIcon(g.icon);
          return (
            <div key={g.title} className="js-pr-g pr-g-item">
              <Icon weight="regular" aria-hidden />
              <div className="pr-g-title">{g.title}</div>
              <div className="pr-g-body">{g.body}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
