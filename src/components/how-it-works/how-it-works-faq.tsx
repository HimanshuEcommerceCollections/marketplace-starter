"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { HowItWorksFaqSection } from "@/lib/how-it-works/page";

const PlusIcon = getPhosphorIcon("Plus");

/**
 * FAQ accordion (single-open, collapsible) styled to the mock. Built directly
 * on the Radix primitives so the page keeps full keyboard/ARIA support without
 * modifying the shared ui/accordion component.
 */
export function HowItWorksFaq({ eyebrow, heading, items }: HowItWorksFaqSection) {
  return (
    <section className="hiw-faq" aria-labelledby="hiw-faq-heading">
      <div className="hiw-section-head">
        {eyebrow ? <p className="hiw-eyebrow">{eyebrow}</p> : null}
        <h2 id="hiw-faq-heading">{heading}</h2>
      </div>

      <Accordion.Root type="single" collapsible>
        {items.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="hiw-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="hiw-faq-trigger">
                {item.question}
                <PlusIcon className="hiw-faq-icon" aria-hidden />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="hiw-faq-content">
              <p>{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
