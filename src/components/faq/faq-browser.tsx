"use client";

import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useGsap } from "@/lib/anim/use-gsap";
import type { FaqBrowserSection } from "@/lib/faq/page";

/**
 * Sticky category filter bar over a single-open FAQ accordion (Radix, so
 * keyboard/ARIA come for free). Filtering hides non-matching items with CSS
 * instead of unmounting them, matching the mock and preserving the open
 * panel when the visitor switches categories.
 */
export function FaqBrowser({ filter, items }: FaqBrowserSection) {
  const [active, setActive] = React.useState("all");

  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    // Gate the entrance stagger on the list scrolling into view — the list
    // sits below the photo hero, so a load-timed tween would finish unseen.
    gsap.from(scope.querySelectorAll(".faqp-item"), {
      scrollTrigger: {
        trigger: scope.querySelector(".faqp-list"),
        start: "top 85%",
        once: true,
      },
      y: 22,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.035,
      ease: "power3.out",
    });
  }, []);

  return (
    <section ref={scope} aria-labelledby="faqp-browser-heading">
      <h2 id="faqp-browser-heading" className="sr-only">
        Frequently asked questions
      </h2>
      <div className="faqp-filter">
        <div className="faqp-filter-inner" role="group" aria-label="Filter by topic">
          <button
            type="button"
            className={cn("faqp-f-btn", active === "all" && "is-active")}
            aria-pressed={active === "all"}
            onClick={() => setActive("all")}
          >
            {filter.allLabel}
          </button>
          {filter.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={cn("faqp-f-btn", active === category.id && "is-active")}
              aria-pressed={active === category.id}
              onClick={() => setActive(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="faqp-list">
        <Accordion.Root type="single" collapsible>
          {items.map((item) => {
            const hidden = active !== "all" && item.category !== active;
            return (
              <Accordion.Item
                key={item.id}
                value={item.id}
                // disabled removes the CSS-hidden trigger from Radix's roving
                // keyboard collection so Arrow/Home/End skip filtered items.
                disabled={hidden}
                className={cn("faqp-item", hidden && "faqp-item-hidden")}
              >
                <Accordion.Header>
                  <Accordion.Trigger className="faqp-trigger">
                    {item.question}
                    <Plus className="faqp-trigger-icon" aria-hidden />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="faqp-content">
                  <p>{item.answer}</p>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </div>
    </section>
  );
}
