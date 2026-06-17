"use client";

import * as React from "react";
import { Container } from "@/components/layout/container";
import { FaqSearch } from "./faq-search";
import { FaqCategoryNav } from "./faq-category-nav";
import { FaqCategorySection } from "./faq-category-section";
import type { FaqPageConfig } from "@/lib/faq/page";

export interface FaqExplorerProps {
  search: FaqPageConfig["search"];
  categories: FaqPageConfig["categories"];
}

/**
 * Interactive FAQ browser: a search field that live-filters questions, the
 * "Jump to Category" nav, and the per-category accordions. Categories with no
 * matching questions drop out of both the nav and the list while searching.
 */
export function FaqExplorer({ search, categories }: FaqExplorerProps) {
  const [query, setQuery] = React.useState("");
  const normalized = query.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    if (!normalized) return categories;
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(normalized) ||
            item.answer.toLowerCase().includes(normalized),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, normalized]);

  const hasResults = filtered.length > 0;

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <Container size="lg">
        <FaqSearch
          value={query}
          onChange={setQuery}
          placeholder={search.placeholder}
          clearLabel={search.clearLabel}
        />

        {hasResults ? (
          <>
            <div className="mt-8">
              <FaqCategoryNav
                label={search.categoryNavLabel}
                categories={filtered}
              />
            </div>
            <div className="mt-12 space-y-12 md:space-y-16">
              {filtered.map((category) => (
                <FaqCategorySection key={category.id} category={category} />
              ))}
            </div>
          </>
        ) : (
          <p className="mt-8 rounded-xl border border-border bg-muted p-6 text-center text-muted-foreground">
            {search.noResults}
          </p>
        )}
      </Container>
    </section>
  );
}
