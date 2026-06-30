"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { getIcon } from "@/lib/icons";
import { useGsap, gsap, prefersReducedMotion } from "@/lib/anim/use-gsap";
import type { GridCard } from "@/lib/catalog/cards";

export interface HomeServicesProps {
  heading: string;
  subheading?: string;
  draftNote?: string;
  cards: GridCard[];
}

/** Presentational hover/preview imagery keyed by service slug (demo photography). */
const ROW_IMAGES: Record<string, string> = {
  massage:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80",
  "personal-training":
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  yoga: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
  beauty:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
  "nutrition-coaching":
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
  "life-coaching":
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=900&q=80",
  "physical-therapy":
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=900&q=80",
  "speech-therapy":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80",
};
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=900&q=80";

function rowImage(card: GridCard): string {
  const slug = card.href.split("/").filter(Boolean).pop() ?? "";
  return (
    card.coverImages?.[0] ?? ROW_IMAGES[card.id] ?? ROW_IMAGES[slug] ?? FALLBACK_IMAGE
  );
}

export function HomeServices({
  heading,
  subheading,
  draftNote,
  cards,
}: HomeServicesProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLDivElement>(null);
  const previewLabelRef = useRef<HTMLSpanElement>(null);

  // Scroll-reveal stagger (skipped under reduced motion by the hook).
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".home-svc-row"), {
      scrollTrigger: { trigger: scope.querySelector(".home-svc-list"), start: "top 82%" },
      x: -36,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.07,
      ease: "power2.out",
    });
  }, []);

  // Row hover background images (always on) + cursor-follow preview (motion only).
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".home-svc-row"));

    // Paint each row's hover background from its data-bg attribute.
    for (const row of rows) {
      const bg = row.querySelector<HTMLElement>(".home-svc-row-bg");
      const url = row.dataset.bg;
      if (bg && url) bg.style.backgroundImage = `url(${url})`;
    }

    const finePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion() || !finePointer) return;

    const preview = previewRef.current;
    const previewImg = previewImgRef.current;
    const previewLabel = previewLabelRef.current;
    if (!preview || !previewImg || !previewLabel) return;

    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    let raf = 0;
    const tick = () => {
      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;
      gsap.set(preview, { x: px - 130, y: py - 94 });
      raf = requestAnimationFrame(tick);
    };

    const onEnter = (row: HTMLElement) => () => {
      const url = row.dataset.bg;
      if (url) previewImg.style.backgroundImage = `url(${url})`;
      previewLabel.textContent = row.dataset.label ?? "";
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out" });
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onLeave = () => {
      gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: "power2.in" });
      cancelAnimationFrame(raf);
      raf = 0;
    };

    gsap.set(preview, { scale: 0.85, autoAlpha: 0 });
    const cleanups = rows.map((row) => {
      const enter = onEnter(row);
      row.addEventListener("pointerenter", enter);
      row.addEventListener("pointermove", onMove);
      row.addEventListener("pointerleave", onLeave);
      return () => {
        row.removeEventListener("pointerenter", enter);
        row.removeEventListener("pointermove", onMove);
        row.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [cards, scope]);

  return (
    <section ref={scope} id="services" aria-labelledby="services-heading" className="py-20 md:py-28">
      <Container size="full">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              All services
            </p>
            <h2
              id="services-heading"
              className="font-display text-3xl font-normal tracking-tight text-foreground md:text-5xl"
            >
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-3 max-w-xl text-base text-muted-foreground">{subheading}</p>
            ) : null}
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View full pricing →
          </Link>
        </div>

        {draftNote ? (
          <p className="mb-8 w-full rounded-lg bg-notice/10 px-4 py-2.5 text-center font-sans text-xs font-semibold uppercase leading-none tracking-label text-notice">
            {draftNote}
          </p>
        ) : null}

        <ul role="list" className="home-svc-list border-t border-border">
          {cards.map((card, i) => {
            const Icon = getIcon(card.icon);
            const num = String(i + 1).padStart(2, "0");
            return (
              <li key={card.id} className="border-b border-border">
                <Link
                  href={card.href}
                  aria-label={`View ${card.title}`}
                  data-bg={rowImage(card)}
                  data-label={card.title}
                  className="home-svc-row group focus-visible:outline-none"
                >
                  <span aria-hidden className="home-svc-row-bg" />
                  <span aria-hidden className="home-svc-row-overlay" />

                  <span className="home-svc-num home-svc-ink-muted text-xs font-medium tracking-wide text-muted-foreground">
                    {num}
                  </span>

                  <div className="flex min-w-0 items-center gap-3 md:gap-4">
                    <span className="home-svc-icon home-svc-ink flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                      {card.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- token-sized inline SVG icon
                        <img src={card.iconUrl} alt="" aria-hidden className="size-5" loading="lazy" />
                      ) : (
                        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                      )}
                    </span>
                    <span className="home-svc-name home-svc-ink truncate text-foreground">
                      {card.title}
                    </span>
                  </div>

                  {card.summary ? (
                    <span className="home-svc-ink-muted hidden max-w-64 text-right text-sm leading-snug text-muted-foreground md:block">
                      {card.summary}
                    </span>
                  ) : (
                    <span className="hidden md:block" />
                  )}

                  <span className="home-svc-price home-svc-ink whitespace-nowrap text-right text-sm font-medium text-foreground">
                    {card.comingSoon ? "Coming soon" : <>from {card.priceLabel}</>}
                  </span>

                  <span className="home-svc-arrow home-svc-ink-muted flex items-center justify-end text-muted-foreground">
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>

      {/* Cursor-following preview (desktop pointer, motion only). */}
      <div ref={previewRef} aria-hidden className="home-cursor-preview">
        <div ref={previewImgRef} className="home-cursor-preview-img" />
        <span
          ref={previewLabelRef}
          className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground"
        />
      </div>
    </section>
  );
}
