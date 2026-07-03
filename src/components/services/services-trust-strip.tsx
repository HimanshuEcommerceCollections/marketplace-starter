"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { ServicesTrustStrip as ServicesTrustStripConfig } from "@/lib/services/page";

/** Dark vetting band: heading + icon pills (services showcase page). */
export function ServicesTrustStrip({ heading, pills }: ServicesTrustStripConfig) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".svcs-trust-heading"), {
      scrollTrigger: { trigger: scope, start: "top 85%", once: true },
      y: 24,
      autoAlpha: 0,
      duration: 0.7,
      ease: "power2.out",
    });
    gsap.from(scope.querySelectorAll(".svcs-trust-pill"), {
      scrollTrigger: { trigger: scope.querySelector(".svcs-trust-pills"), start: "top 85%", once: true },
      y: 16,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power2.out",
    });
  }, []);

  return (
    <section ref={scope} className="svcs-trust" aria-labelledby="svcs-trust-heading">
      <div className="svcs-trust-inner">
        <h2 id="svcs-trust-heading" className="svcs-trust-heading">
          {heading}
        </h2>
        <ul role="list" className="svcs-trust-pills">
          {pills.map((pill) => {
            const Icon = getPhosphorIcon(pill.icon);
            return (
              <li key={pill.label} className="svcs-trust-pill">
                <Icon weight="regular" aria-hidden />
                {pill.label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
