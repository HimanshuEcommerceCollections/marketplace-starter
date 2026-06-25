"use client";

import { useEffect, useLayoutEffect, useRef, type DependencyList } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the scroll plugin once, on the client only.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// useLayoutEffect on the client (no FOUC for pre-paint hide/reveal), useEffect
// on the server (avoids React's SSR warning — effects never run there anyway).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** True when the user has asked the OS to minimize motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type GsapSetup<T extends HTMLElement> = (api: {
  gsap: typeof gsap;
  scope: T;
}) => void;

/**
 * Run a GSAP setup callback scoped to a container element, with automatic
 * cleanup (gsap.context().revert()) on unmount / dep change.
 *
 * Motion-safety contract: components must render in their FINAL, visible state
 * by default (no opacity:0 in CSS). The setup callback may `gsap.set(...)` an
 * element to its hidden start state and then animate it in — because this runs
 * inside useLayoutEffect (before paint) there is no flash. When the user
 * prefers reduced motion the callback is skipped, so elements simply stay
 * visible. Returns the ref to attach to the scope element.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: GsapSetup<T>,
  deps: DependencyList = [],
) {
  const scopeRef = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope || prefersReducedMotion()) return;
    const ctx = gsap.context(() => setup({ gsap, scope }), scope);
    return () => ctx.revert();
  }, deps);

  return scopeRef;
}

export { gsap, ScrollTrigger };
