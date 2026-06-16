"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ServiceSelectCard,
  type ServiceSelectItem,
} from "./service-select-card";

export interface ServiceSelectionProps {
  items: ServiceSelectItem[];
}

/**
 * Step 1 of the booking flow — "Pick a Service". Client component: tracks the
 * selected service and advances to the configurator. Only one active service
 * can be selected; coming-soon services are not selectable.
 */
export function ServiceSelection({ items }: ServiceSelectionProps) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<string | null>(null);
  const selectedItem = items.find((i) => i.slug === selected) ?? null;

  return (
    <div>
      <div className="mb-8 max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Pick a Service
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {
            "Select the wellness service you'd like to book for your home session. Prices shown are draft estimates."
          }
        </p>
      </div>

      <ul
        role="list"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {items.map((item) => (
          <li key={item.slug}>
            <ServiceSelectCard
              item={item}
              selected={selected === item.slug}
              onSelect={() => setSelected(item.slug)}
            />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center sm:justify-end">
        <Button
          type="button"
          size="lg"
          disabled={!selectedItem}
          onClick={() =>
            selectedItem && router.push(`/book?service=${selectedItem.slug}`)
          }
          className="w-full bg-highlight text-highlight-foreground hover:bg-highlight/90 sm:w-auto"
        >
          {selectedItem ? `Continue with ${selectedItem.title}` : "Continue"}
          <ArrowRight aria-hidden />
        </Button>
      </div>
    </div>
  );
}
