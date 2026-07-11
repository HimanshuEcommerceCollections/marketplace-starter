"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "@phosphor-icons/react";
import type { YogaFaqSection } from "@/lib/yoga/page";

/**
 * FAQ accordion (single-open, collapsible) styled to the mock. Built directly
 * on the Radix primitives so the page keeps full keyboard/ARIA support (mirrors
 * the Massage FAQ).
 */
export function YogaFaq({ eyebrow, heading, items }: YogaFaqSection) {
  return (
    <section className="yoga-faq" aria-labelledby="yoga-faq-heading">
      <div className="yoga-section-head">
        {eyebrow ? <span className="yoga-eyebrow">{eyebrow}</span> : null}
        <h2 id="yoga-faq-heading">
          {heading.lead}{" "}
          {heading.accent ? <em>{heading.accent}</em> : null}
          {heading.trail ? <> {heading.trail}</> : null}
        </h2>
      </div>

      <Accordion.Root type="single" collapsible>
        {items.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="yoga-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="yoga-faq-trigger">
                {item.question}
                <Plus className="yoga-faq-icon" aria-hidden />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="yoga-faq-content">
              <p>{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
