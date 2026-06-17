import { Container } from "@/components/layout/container";
import type { LegalSection } from "@/lib/legal/page";

export interface LegalContentsSectionProps {
  heading: string;
  subtitle?: string;
  items: Pick<LegalSection, "id" | "title">[];
}

/**
 * "Contents" table of contents — numbered cards that anchor-link to each policy
 * section. Server component, token-only. Numbers derive from list order, so they
 * stay in sync with LegalSectionsSection (same `items` array).
 */
export function LegalContentsSection({
  heading,
  subtitle,
  items,
}: LegalContentsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="legal-contents-heading" className="py-16 md:py-20">
      <Container>
        <h2
          id="legal-contents-heading"
          className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        >
          {heading}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        ) : null}

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex h-full items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  aria-hidden
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {i + 1}. {item.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
