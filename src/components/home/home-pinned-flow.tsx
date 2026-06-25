"use client";

import { useEffect, useRef, useState } from "react";
import {
  HandHelping,
  Dumbbell,
  Flower2,
  Sparkles,
  Salad,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface CardState {
  step: string;
  price: string;
  note: string[];
  btn: string;
  ref: string;
}
interface Panel {
  tag: string;
  title: string;
  body: string;
  card: CardState;
}

/**
 * Presentational, demo-only walkthrough of the booking flow. The card is a
 * static visual mock — it is NOT wired to the real booking engine, pricing, or
 * any form submission. Numbers are illustrative.
 */
const PANELS: Panel[] = [
  {
    tag: "01 — Pick",
    title: "Choose your discipline",
    body: "Eight wellness services from one platform — no app-switching, no searching. One transparent door to Raleigh's best independent pros.",
    card: {
      step: "Step 1 — Select service",
      price: "$109",
      note: ["60-min Massage", "1 session"],
      btn: "Continue →",
      ref: "Reference: ELV-2026-NNNN",
    },
  },
  {
    tag: "02 — Price",
    title: "See the real number",
    body: "Configure duration, pack, or format and the price updates live. No “starting from.” What you see is exactly what you pay.",
    card: {
      step: "Step 2 — Configure",
      price: "$149",
      note: ["90-min Massage", "1 session"],
      btn: "See your price →",
      ref: "Price updates live",
    },
  },
  {
    tag: "03 — Request",
    title: "Submit in two minutes",
    body: "Enter your details, preferred Wake County location, and three time windows. Your reference number issues instantly.",
    card: {
      step: "Step 3 — Your details",
      price: "$109",
      note: ["60-min Massage", "Mon 3pm preferred"],
      btn: "Submit request →",
      ref: "Confirming in < 1 hr",
    },
  },
  {
    tag: "04 — Confirm",
    title: "A real person confirms",
    body: "A coordinator — not an algorithm — confirms within one business hour. Then your vetted pro arrives at your door.",
    card: {
      step: "Step 4 — Confirmed ✓",
      price: "$109",
      note: ["Confirmed ✓", "Wed 10am · Home"],
      btn: "View booking →",
      ref: "ELV-2026-0042 · Confirmed",
    },
  },
];

const CHIPS: { label: string; Icon: LucideIcon }[] = [
  { label: "Massage", Icon: HandHelping },
  { label: "Training", Icon: Dumbbell },
  { label: "Yoga", Icon: Flower2 },
  { label: "Beauty", Icon: Sparkles },
  { label: "Nutrition", Icon: Salad },
  { label: "Coaching", Icon: MessageCircle },
];

function BookingCardMock({ state }: { state: CardState }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex items-center gap-3 border-b border-border bg-secondary px-5 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive" />
          <span className="size-2.5 rounded-full bg-warning" />
          <span className="size-2.5 rounded-full bg-success" />
        </div>
        <span className="flex-1 text-center text-xs text-muted-foreground">
          elevate · /book
        </span>
      </div>

      <div className="p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {state.step}
        </p>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {CHIPS.map((chip) => {
            const selected = chip.label === "Massage";
            return (
              <span
                key={chip.label}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium",
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-secondary text-foreground",
                )}
              >
                <chip.Icon className="size-3.5" aria-hidden />
                {chip.label}
              </span>
            );
          })}
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-secondary px-5 py-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
              Your price
            </p>
            <p className="font-display text-4xl leading-none tracking-tight text-foreground">
              {state.price}
            </p>
          </div>
          <p className="text-right text-xs leading-relaxed text-muted-foreground">
            {state.note.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        </div>

        <span className="block rounded-full bg-foreground py-3 text-center text-sm font-medium text-background">
          {state.btn}
        </span>
        <p className="mt-2.5 text-center text-xs text-muted-foreground">{state.ref}</p>
      </div>
    </div>
  );
}

export function HomePinnedFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Scroll-spy: activate the panel crossing the viewport's vertical center.
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const panels = Array.from(root.querySelectorAll<HTMLElement>(".home-panel"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0% -45% 0%", threshold: 0 },
    );
    panels.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-b border-border">
      <Container>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="py-16 md:py-24">
            {PANELS.map((panel, i) => (
              <div
                key={panel.tag}
                data-index={i}
                data-active={i === active}
                className="home-panel border-t border-border py-12 first:border-t-0 first:pt-0"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
                  {panel.tag}
                </p>
                <h3 className="font-display text-2xl font-normal tracking-tight text-foreground md:text-4xl">
                  {panel.title}
                </h3>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
                  {panel.body}
                </p>
              </div>
            ))}
          </div>

          <div className="pb-16 lg:py-24">
            <div className="lg:sticky lg:top-28">
              <BookingCardMock state={PANELS[active].card} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
