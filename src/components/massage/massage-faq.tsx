"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "@phosphor-icons/react";
import type { MassageFaqSection } from "@/lib/massage/page";

/**
 * FAQ accordion (single-open, collapsible) styled to the mock. Built directly
 * on the Radix primitives so the page keeps full keyboard/ARIA support without
 * modifying the shared ui/accordion component (mirrors the For Pros FAQ).
 */
export function MassageFaq({ eyebrow, heading, items }: MassageFaqSection) {
  return (
    <section className="msg-faq" aria-labelledby="msg-faq-heading">
      <div className="msg-section-head">
        {eyebrow ? <p className="msg-eyebrow">{eyebrow}</p> : null}
        <h2 id="msg-faq-heading">{heading}</h2>
      </div>

      <Accordion.Root type="single" collapsible>
        {items.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="msg-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="msg-faq-trigger">
                {item.question}
                <Plus className="msg-faq-icon" aria-hidden />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="msg-faq-content">
              <p>{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
