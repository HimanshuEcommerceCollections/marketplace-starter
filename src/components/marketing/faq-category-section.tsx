import { getIcon } from "@/lib/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { FaqCategory } from "@/lib/faq/page";

export interface FaqCategorySectionProps {
  category: FaqCategory;
}

/** One FAQ category — anchor target, pill, heading, and an accordion of Q&A. */
export function FaqCategorySection({ category }: FaqCategorySectionProps) {
  const Icon = getIcon(category.icon);

  return (
    <section
      id={`faq-${category.id}`}
      aria-labelledby={`faq-${category.id}-heading`}
      className="scroll-mt-24"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        <Icon aria-hidden className="size-3.5" strokeWidth={2} />
        {category.label}
      </span>
      <h2
        id={`faq-${category.id}-heading`}
        className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
      >
        {category.heading}
      </h2>
      <Accordion type="single" collapsible className="mt-4 w-full">
        {category.items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>
              <span className="text-base font-medium text-foreground">
                {item.question}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="leading-relaxed">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
