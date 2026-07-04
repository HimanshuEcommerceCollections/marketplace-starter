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
import { useGsap, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/anim/use-gsap";
import { cn } from "@/lib/utils";

// Focus-slot height per step, as a fraction of the viewport. MUST stay in sync
// with --home-slot in home.css (62vh) so the JS emphasis math and the CSS
// layout agree.
const SLOT_VH = 0.62;

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
  "/assets/home/image-8.jpg",
  "/assets/home/image-9.jpg",
  "/assets/home/image-10.jpg",
  "/assets/home/image-11.jpg",
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
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const firstStepTween = useRef(true);
  const prevPrice = useRef(PANELS[0].card.price);

  // Card entrance reveal (scroll-triggered; skipped under reduced motion by the
  // hook, which leaves the card in its final, visible state).
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    const card = scope.querySelector(".home-bc");
    if (!card) return;
    gsap.set(card, { autoAlpha: 0, y: 36 });
    ScrollTrigger.create({
      trigger: scope,
      start: "top 70%",
      onEnter: () =>
        gsap.to(card, { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out" }),
      onLeaveBack: () => gsap.to(card, { autoAlpha: 0, y: 36, duration: 0.4 }),
    });
  }, []);

  // Paint the step background images from data attributes (inline style is
  // linted out).
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    for (const el of root.querySelectorAll<HTMLElement>(".home-pinned-bg")) {
      const src = el.dataset.bg;
      if (src) el.style.backgroundImage = `url(${src})`;
    }
  }, [scope]);

  // Pinned scrub: the section owns the scroll for its full (multi-viewport)
  // height while the stage stays fixed, so the user can't reach the next
  // section until every step is traversed. Scroll progress translates the step
  // column continuously (no discrete swap), and each step's opacity + scale is
  // set per-frame from its distance to the focus line, so the highlight travels
  // smoothly with the scroll. The translate IS the scroll, so it runs under
  // reduced motion too; only the scale emphasis is dropped in that case.
  useEffect(() => {
    const root = scope.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const reduce = prefersReducedMotion();
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rect = root.getBoundingClientRect();
      const scrollable = rect.height - vh;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const travel = track.scrollHeight - vh;
      track.style.transform = `translate3d(0, ${-(progress * travel)}px, 0)`;

      const centerY = vh / 2;
      const slotPx = SLOT_VH * vh;
      let best = 0;
      let bestDist = Infinity;
      const panels = panelRefs.current;
      for (let i = 0; i < panels.length; i++) {
        const el = panels[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const centre = r.top + r.height / 2;
        const dist = Math.abs(centre - centerY);
        // 1 at the focus line, easing to 0 one slot away.
        const t = Math.min(1, Math.max(0, 1 - dist / slotPx));
        el.style.opacity = String(0.3 + 0.7 * t);
        el.style.transform = reduce ? "none" : `scale(${0.94 + 0.06 * t})`;
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      if (activeRef.current !== best) {
        activeRef.current = best;
        setActive(best);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scope]);

  // Card micro-interactions on focus change: a small settle nudge on every step
  // so the swapped card content reads as motion (not a hard cut), plus a price
  // pop only when the number actually changes. First activation and reduced
  // motion are skipped.
  useEffect(() => {
    const nextPrice = PANELS[active].card.price;
    const priceChanged = nextPrice !== prevPrice.current;
    prevPrice.current = nextPrice;
    if (firstStepTween.current) {
      firstStepTween.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    const root = scope.current;
    if (!root) return;
    const card = root.querySelector(".home-bc");
    if (card) {
      gsap.fromTo(card, { y: -7 }, { y: 0, duration: 0.35, ease: "power2.out" });
    }
    if (priceChanged) {
      const price = root.querySelector(".home-bc-price-big");
      if (price) {
        gsap.fromTo(
          price,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.38, ease: "power2.out" },
        );
      }
    }
  }, [active, scope]);

  return (
    <section ref={scope} className="home-pinned">
      <div className="home-pinned-stage">
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

        <Container className="home-pinned-inner">
          {/* One continuously scrolling column: the track is translated with
              scroll, all steps stay visible, and emphasis is set per-frame. */}
          <div className="home-panel-viewport">
            <div ref={trackRef} className="home-panel-track">
              {PANELS.map((panel, i) => (
                <div
                  key={panel.tag}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className="home-panel"
                >
                  <p className="home-panel-num">{panel.tag}</p>
                  <h3 className="home-panel-title">{panel.title}</h3>
                  <p className="home-panel-body">{panel.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking card is desktop-only for now; mobile placement is a
              follow-up per the agreed "implement, then evaluate" plan. */}
          <div className="home-pinned-sticky hidden lg:block">
            <BookingCardMock state={PANELS[active].card} />
          </div>
        </Container>
      </div>
    </section>
  );
}
