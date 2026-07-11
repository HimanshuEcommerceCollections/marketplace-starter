"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "@phosphor-icons/react";
import type { LifeCoachingFaqSection } from "@/lib/life-coaching/page";

/**
 * FAQ accordion (single-open, collapsible) styled to the mock. Built directly
 * on the Radix primitives so the page keeps full keyboard/ARIA support (mirrors
 * the Massage FAQ).
 */
export function LifeCoachingFaq({ eyebrow, heading, items }: LifeCoachingFaqSection) {
  return (
    <section className="lc-faq" aria-labelledby="lc-faq-heading">
      <div className="lc-section-head">
        {eyebrow ? <span className="lc-eyebrow">{eyebrow}</span> : null}
        <h2 id="lc-faq-heading">
          {heading.lead}{" "}
          {heading.accent ? <em>{heading.accent}</em> : null}
          {heading.trail ? <> {heading.trail}</> : null}
        </h2>
      </div>

      <Accordion.Root type="single" collapsible>
        {items.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="lc-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="lc-faq-trigger">
                {item.question}
                <Plus className="lc-faq-icon" aria-hidden />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="lc-faq-content">
              <p>{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
