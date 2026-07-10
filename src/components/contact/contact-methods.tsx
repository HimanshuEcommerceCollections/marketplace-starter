"use client";

import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { ContactMethod } from "@/lib/contact/page";

/** Left column: a stack of contact-method cards (email/phone). */
export function ContactMethods({ methods }: { methods: ContactMethod[] }) {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".ct-card"), {
      scrollTrigger: { trigger: scope, start: "top 85%", once: true },
      x: -32,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power2.out",
      // Clear the inline transform so it can't override the :hover lift.
      clearProps: "transform",
    });
  }, []);

  return (
    <div ref={scope} className="ct-cards">
      {methods.map((method) => {
        const IconGlyph = getPhosphorIcon(method.icon);
        return (
          <article key={method.title} className="ct-card">
            <span className="ct-card-icon" aria-hidden>
              <IconGlyph weight="regular" />
            </span>
            <div>
              <h3>{method.title}</h3>
              <p>{method.body}</p>
              <a href={method.href}>{method.linkLabel}</a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
