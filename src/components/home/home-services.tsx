"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Container } from "@/components/layout/container";
import { useGsap, gsap, prefersReducedMotion } from "@/lib/anim/use-gsap";
import type { GridCard } from "@/lib/catalog/cards";

export interface HomeServicesProps {
  heading: string;
  headingAccent?: string;
  subheading?: string;
  draftNote?: string;
  cards: GridCard[];
}

export function HomeServices({
  heading,
  headingAccent,
  subheading,
  draftNote,
  cards,
}: HomeServicesProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLDivElement>(null);
  const previewLabelRef = useRef<HTMLSpanElement>(null);

  // Scroll-reveal (skipped under reduced motion by the hook). Each row animates
  // on its own trigger as it enters view — mirrors the mockup and avoids the
  // batch-stagger that leaves lower rows shifted while the top ones settle.
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    scope.querySelectorAll<HTMLElement>(".home-svc-row").forEach((row) => {
      gsap.from(row, {
        scrollTrigger: { trigger: row, start: "top 92%", toggleActions: "play none none none" },
        x: -40,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      });
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
              {headingAccent ? (
                <>
                  <br />
                  <em className="italic text-highlight">{headingAccent}</em>
                </>
              ) : null}
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

        <ul role="list" className="home-svc-list">
          {cards.map((card, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <li key={card.id} className="home-svc-item">
                <Link
                  href={card.href}
                  aria-label={`View ${card.title}`}
                  data-bg={card.coverImages?.[0] ?? ""}
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
                      ) : null}
                    </span>
                    <span className="home-svc-name home-svc-ink truncate text-foreground">
                      {card.title}
                    </span>
                  </div>

                  {card.summary ? (
                    <span className="home-svc-ink-muted hidden max-w-64 text-right text-sm leading-snug text-muted-foreground md:line-clamp-2">
                      {card.summary}
                    </span>
                  ) : (
                    <span className="hidden md:block" />
                  )}

                  <span className="home-svc-price home-svc-ink whitespace-nowrap text-right text-sm font-medium text-foreground">
                    {card.comingSoon ? "Coming soon" : <>from {card.priceLabel}</>}
                  </span>

                  <span className="home-svc-arrow home-svc-ink-muted flex items-center justify-end text-muted-foreground">
                    <ArrowUpRight className="size-5" weight="bold" aria-hidden />
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
