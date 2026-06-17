import { getIcon } from "@/lib/icons";
import type { FaqCategory } from "@/lib/faq/page";

export interface FaqCategoryNavProps {
  label: string;
  categories: Pick<FaqCategory, "id" | "icon" | "label">[];
}

/** "Jump to Category" grid — icon cards that anchor-link to each section. */
export function FaqCategoryNav({ label, categories }: FaqCategoryNavProps) {
  if (categories.length === 0) return null;

  return (
    <nav aria-label={label}>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const Icon = getIcon(category.icon);
          return (
            <li key={category.id}>
              <a
                href={`#faq-${category.id}`}
                className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  aria-hidden
                  className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {category.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
