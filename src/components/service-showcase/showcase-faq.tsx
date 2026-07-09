"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "@phosphor-icons/react";
import type { ShowcaseFaqSection } from "@/lib/service-showcase/page";

/**
 * FAQ accordion (single-open, collapsible) styled to the mock. Built directly
 * on the Radix primitives so the page keeps full keyboard/ARIA support without
 * modifying the shared ui/accordion component (mirrors the Massage FAQ).
 */
export function ShowcaseFaq({ eyebrow, heading, items }: ShowcaseFaqSection) {
  return (
    <section className="ssp-faq" aria-labelledby="ssp-faq-heading">
      <div className="ssp-section-head">
        {eyebrow ? <p className="ssp-eyebrow">{eyebrow}</p> : null}
        <h2 id="ssp-faq-heading">{heading}</h2>
      </div>

      <Accordion.Root type="single" collapsible>
        {items.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="ssp-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="ssp-faq-trigger">
                {item.question}
                <Plus className="ssp-faq-icon" aria-hidden />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="ssp-faq-content">
              <p>{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
