"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { PricingPageConfig } from "@/lib/pricing/page";

const PlusIcon = getPhosphorIcon("Plus");

/**
 * Pricing FAQ accordion (single-open, collapsible). Built on the Radix
 * primitives so it keeps full keyboard/ARIA support; styled to the mock.
 */
export function PricingFaq({ eyebrow, heading, items }: PricingPageConfig["faq"]) {
  return (
    <section className="pr-faq" aria-labelledby="pr-faq-heading">
      <div className="pr-section-head">
        {eyebrow ? <p className="pr-eyebrow">{eyebrow}</p> : null}
        <h2 id="pr-faq-heading">{heading}</h2>
      </div>

      <Accordion.Root type="single" collapsible>
        {items.map((item) => (
          <Accordion.Item key={item.id} value={item.id} className="pr-faq-item">
            <Accordion.Header>
              <Accordion.Trigger className="pr-faq-trigger">
                {item.question}
                <PlusIcon className="pr-faq-icon" aria-hidden />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pr-faq-content">
              <p>{item.answer}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
