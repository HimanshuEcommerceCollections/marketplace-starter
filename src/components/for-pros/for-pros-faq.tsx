"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "@phosphor-icons/react";
import type { ForProsFaqSection } from "@/lib/for-pros/page";

/**
 * FAQ accordion (single-open, collapsible) styled to the mock. Built directly
 * on the Radix primitives so the page keeps full keyboard/ARIA support without
 * modifying the shared ui/accordion component.
 */
export function ForProsFaq({ eyebrow, heading, items }: ForProsFaqSection) {
  return (
    <section className="fp-faq" aria-labelledby="fp-faq-heading">
      <div className="fp-section-head">
        {eyebrow ? <p className="fp-eyebrow">{eyebrow}</p> : null}
        <h2 id="fp-faq-heading">{heading}</h2>
      </div>

      <Accordion.Root type="single" collapsible>
        {items.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="fp-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="fp-faq-trigger">
                {item.question}
                <Plus className="fp-faq-icon" aria-hidden />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="fp-faq-content">
              <p>{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
