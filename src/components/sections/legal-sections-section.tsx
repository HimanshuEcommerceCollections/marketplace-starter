import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import type { LegalSection } from "@/lib/legal/page";

export interface LegalSectionsSectionProps {
  heading?: string;
  subtitle?: string;
  items: LegalSection[];
}

/**
 * Numbered policy sections, each an anchor target (`id`) for the contents nav.
 * A section renders its `questions` as a chevron list when present, otherwise
 * its `body` paragraphs. Server component, token-only. `scroll-mt` offsets the
 * sticky navbar when jumping to an anchor.
 */
export function LegalSectionsSection({
  heading,
  subtitle,
  items,
}: LegalSectionsSectionProps) {
  return (
    <section
      aria-labelledby="legal-sections-heading"
      className="bg-secondary/30 py-16 md:py-20 lg:py-28"
    >
      <Container>
        {heading ? (
          <h2
            id="legal-sections-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            {heading}
          </h2>
        ) : (
          <h2 id="legal-sections-heading" className="sr-only">
            Sections
          </h2>
        )}
        {subtitle ? (
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        ) : null}

        <div className="mt-8 space-y-5">
          {items.map((item, i) => (
            <article
              key={item.id}
              id={item.id}
              className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <h3 className="flex items-baseline gap-2 border-b border-border pb-4 font-heading text-xl font-semibold text-foreground">
                <span className="text-base font-semibold text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.title}
              </h3>

              {item.questions && item.questions.length > 0 ? (
                <ul className="mt-2 divide-y divide-border">
                  {item.questions.map((question, j) => (
                    <li
                      key={j}
                      className="flex items-center justify-between gap-4 py-3.5"
                    >
                      <span className="text-sm leading-snug text-muted-foreground md:text-base">
                        {question}
                      </span>
                      <ChevronRight
                        aria-hidden
                        className="size-4 shrink-0 text-muted-foreground/50"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 space-y-4">
                  {item.body?.map((paragraph, j) => (
                    <p key={j} className="leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
