"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/brand/types";

export interface FaqAccordionProps {
  heading?: string;
  items: FaqItem[];
}

export function FaqAccordion({ heading, items }: FaqAccordionProps) {
  return (
    <div>
      {heading ? (
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">{heading}</h2>
      ) : null}
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>
              <h3 className="text-base font-medium">{item.question}</h3>
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
