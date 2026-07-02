"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/anim/use-gsap";

export interface HomeLoaderProps {
  /** Wordmark shown mid-split (usually the brand short name). */
  brandName: string;
  /** Small uppercase tag in the bottom-left corner. */
  tag?: string;
}

/**
 * Split-panel intro preloader (homepage only). An animated 0→100% counter and
 * a growing baseline run while a centered wordmark fades in, then the two
 * panels split away to reveal the page. Locks body scroll while active.
 *
 * Motion-safety: under prefers-reduced-motion it removes itself before paint
 * (no scroll lock, no animation), so the homepage renders immediately.
 */
export function HomeLoader({ brandName, tag = "RALEIGH · WAKE COUNTY" }: HomeLoaderProps) {
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setHidden(true);
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    const q = gsap.utils.selector(root);
    const counter = { v: 0 };
    const countEl = root.querySelector<HTMLElement>(".home-loader-count");

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setHidden(true);
      },
    });

    tl.to(q(".home-loader-line"), { width: "100%", duration: 1.7, ease: "power2.inOut" }, 0)
      .to(
        counter,
        {
          v: 100,
          duration: 1.7,
          ease: "power2.inOut",
          onUpdate() {
            if (countEl) {
              countEl.textContent = String(Math.round(counter.v)).padStart(2, "0") + "%";
            }
          },
        },
        0,
      )
      .to(q(".home-loader-logo"), { opacity: 1, duration: 0.65, ease: "power2.out" }, 0.18)
      .to(q(".home-loader-scan"), { opacity: 0.5, duration: 0.08, repeat: 2, yoyo: true }, 0.6)
      .to(q(".home-loader-panel-t"), { scaleY: 0, duration: 0.95, ease: "power4.inOut" }, 1.75)
      .to(q(".home-loader-panel-b"), { scaleY: 0, duration: 0.95, ease: "power4.inOut" }, 1.75)
      .to(q(".home-loader-logo"), { opacity: 0, y: -20, duration: 0.4 }, 1.78)
      .to(root, { opacity: 0, duration: 0.3 }, 2.62);

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="home-loader" aria-hidden>
      <div className="home-loader-scan" />
      <div className="home-loader-panel home-loader-panel-t" />
      <div className="home-loader-panel home-loader-panel-b" />
      <div className="home-loader-logo">
        {brandName}
        <span className="home-loader-echo">{brandName}</span>
      </div>
      <div className="home-loader-count">00%</div>
      <div className="home-loader-tag">{tag}</div>
      <div className="home-loader-line" />
    </div>
  );
}
