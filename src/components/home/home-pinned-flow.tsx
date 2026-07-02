"use client";

import { useEffect, useRef, useState } from "react";
import {
  HandWaving,
  Barbell,
  PersonSimple,
  Sparkle,
  Leaf,
  ChatCircle,
  type Icon,
} from "@phosphor-icons/react";
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
 * any form submission. Numbers are illustrative. A background image stack
 * swaps with the active step.
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

const STEP_BG = [
  "/assets/image-8.jpg",
  "/assets/image-9.jpg",
  "/assets/image-10.jpg",
  "/assets/image-11.jpg",
];

const CHIPS: { label: string; Icon: Icon }[] = [
  { label: "Massage", Icon: HandWaving },
  { label: "Training", Icon: Barbell },
  { label: "Yoga", Icon: PersonSimple },
  { label: "Beauty", Icon: Sparkle },
  { label: "Nutrition", Icon: Leaf },
  { label: "Coaching", Icon: ChatCircle },
];

function BookingCardMock({ state }: { state: CardState }) {
  return (
    <div className="home-bc">
      <div className="home-bc-topbar">
        <div className="home-bc-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="home-bc-url">elevate.app / book</span>
      </div>

      <div className="home-bc-body">
        <p className="home-bc-step">{state.step}</p>

        <div className="home-bc-grid">
          {CHIPS.map((chip) => (
            <span
              key={chip.label}
              className={cn("home-bc-chip", chip.label === "Massage" && "is-selected")}
            >
              <chip.Icon className="size-4" weight="regular" aria-hidden />
              {chip.label}
            </span>
          ))}
        </div>

        <div className="home-bc-price">
          <div>
            <p className="home-bc-price-label">Your price</p>
            <p className="home-bc-price-big">{state.price}</p>
          </div>
          <p className="home-bc-price-note">
            {state.note.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        </div>

        <span className="home-bc-btn">{state.btn}</span>
        <p className="home-bc-ref">{state.ref}</p>
      </div>
    </div>
  );
}

export function HomePinnedFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Paint the step background images from data attributes (inline style is
  // linted out).
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    for (const el of root.querySelectorAll<HTMLElement>(".home-pinned-bg")) {
      const src = el.dataset.bg;
      if (src) el.style.backgroundImage = `url(${src})`;
    }
  }, []);

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
    <section ref={sectionRef} className="home-pinned">
      <div aria-hidden className="home-pinned-bg-stack">
        {STEP_BG.map((src, i) => (
          <div
            key={src}
            data-bg={src}
            className={cn("home-pinned-bg", i === active && "is-active")}
          />
        ))}
      </div>
      <div aria-hidden className="home-pinned-overlay" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="py-16 md:py-24">
            {PANELS.map((panel, i) => (
              <div
                key={panel.tag}
                data-index={i}
                data-active={i === active}
                className="home-panel border-t border-white/12 py-12 first:border-t-0 first:pt-0"
              >
                <p className="home-panel-num">{panel.tag}</p>
                <h3 className="home-panel-title">{panel.title}</h3>
                <p className="home-panel-body">{panel.body}</p>
              </div>
            ))}
          </div>

          <div className="pb-16 lg:py-24">
            <div className="home-pinned-sticky lg:sticky lg:top-28">
              <BookingCardMock state={PANELS[active].card} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
