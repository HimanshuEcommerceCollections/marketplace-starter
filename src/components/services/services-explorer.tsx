"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGsap } from "@/lib/anim/use-gsap";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { GridCard } from "@/lib/catalog/cards";
import { cn } from "@/lib/utils";

export interface ServicesExplorerProps {
  categories: Array<{ id: string; title: string }>;
  cards: GridCard[];
  draftNote?: string;
}

/**
 * Sticky category filter bar + photo-card showcase grid. Filtering dims
 * non-matching cards in place (mock behavior) rather than unmounting them,
 * so the grid never reflows; dimmed cards are `inert` for keyboard/AT users.
 */
export function ServicesExplorer({ categories, cards, draftNote }: ServicesExplorerProps) {
  const [active, setActive] = useState<string>("all");

  const scope = useGsap<HTMLDivElement>(({ gsap, scope }) => {
    scope.querySelectorAll<HTMLElement>(".svcs-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
        y: 56,
        autoAlpha: 0,
        duration: 0.75,
        delay: i * 0.07,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      });
    });
  }, []);

  // Paint each card's photo from its data-bg attribute (home-services pattern).
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".svcs-card").forEach((card) => {
      const bg = card.querySelector<HTMLElement>(".svcs-card-bg");
      const url = card.dataset.bg;
      if (bg && url) bg.style.backgroundImage = `url(${url})`;
    });
  }, [cards, scope]);

  const filters = [{ id: "all", title: "All Services" }, ...categories];

  return (
    <div ref={scope}>
      <div className="svcs-filter-bar">
        <div
          className="svcs-filter-inner"
          role="group"
          aria-label="Filter services by category"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={active === f.id}
              className={cn("svcs-filter-btn", active === f.id && "is-active")}
              onClick={() => setActive(f.id)}
            >
              {f.title}
            </button>
          ))}
        </div>
      </div>

      <div className="svcs-section">
        {draftNote ? (
          <p className="mb-8 w-full rounded-lg bg-notice/10 px-4 py-2.5 text-center font-sans text-xs font-semibold uppercase leading-none tracking-label text-notice">
            {draftNote}
          </p>
        ) : null}

        <ul role="list" className="svcs-grid">
          {cards.map((card) => {
            const dimmed = active !== "all" && card.category !== active;
            const bookSlug = card.slug ?? card.id;
            const Icon = getPhosphorIcon(card.icon);
            return (
              <li
                key={card.id}
                data-bg={card.coverImages?.[1] ?? card.coverImages?.[0] ?? ""}
                inert={dimmed || undefined}
                className={cn(
                  "svcs-card",
                  card.featured && "is-featured",
                  card.comingSoon && "is-coming",
                  dimmed && "is-dimmed",
                )}
              >
                <div aria-hidden className="svcs-card-bg" />
                <div aria-hidden className="svcs-card-overlay" />

                {card.tagLabel ? (
                  <span className="svcs-card-tag">{card.tagLabel}</span>
                ) : null}

                <span className="svcs-card-price">
                  {card.comingSoon ? (
                    "Coming soon"
                  ) : card.priceUnit ? (
                    <>
                      {card.priceLabel}
                      <small> / {card.priceUnit}</small>
                    </>
                  ) : (
                    <>
                      <small>from </small>
                      {card.priceLabel}
                    </>
                  )}
                </span>

                <div className="svcs-card-content">
                  <div className="svcs-card-titlebar">
                    <span aria-hidden className="svcs-card-icon">
                      {card.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- token-sized inline SVG icon
                        <img src={card.iconUrl} alt="" loading="lazy" />
                      ) : (
                        <Icon weight="regular" />
                      )}
                    </span>
                    <h3 className="svcs-card-name">
                      {/* Stretched link — covers the whole card via CSS ::after. */}
                      <Link href={card.href} className="svcs-card-link">
                        {card.title}
                      </Link>
                    </h3>
                  </div>

                  {card.summary ? <p className="svcs-card-desc">{card.summary}</p> : null}

                  {card.tags?.length ? (
                    <div className="svcs-card-pills">
                      {card.tags.map((tag) => (
                        <span key={tag} className="svcs-card-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <Link
                    href={
                      card.comingSoon
                        ? `/waitlist?service=${bookSlug}`
                        : `/book?service=${bookSlug}`
                    }
                    className="svcs-card-book"
                    aria-label={
                      card.comingSoon
                        ? `Join the waitlist for ${card.title}`
                        : `Book ${card.title}`
                    }
                  >
                    {card.comingSoon ? "Join Waitlist" : "Book Now"} →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
