"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { Container } from "@/components/layout/container";
import { useGsap, gsap, prefersReducedMotion } from "@/lib/anim/use-gsap";
import type { NavItem } from "@/lib/brand/types";

export interface HomeCtaProps {
  eyebrow?: string;
  title: string;
  body?: string;
  primaryCta: NavItem;
}

export function HomeCta({ eyebrow, title, body, primaryCta }: HomeCtaProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Split "... require a commute." -> accent the closing phrase if present.
  const splitAt = title.indexOf("require ");
  const lead = splitAt >= 0 ? title.slice(0, splitAt + "require ".length) : title;
  const emphasis = splitAt >= 0 ? title.slice(splitAt + "require ".length) : "";

  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".js-cta-reveal"), {
      scrollTrigger: { trigger: scope, start: "top 78%" },
      y: 36,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  // Three.js drifting particle field behind the CTA (motion only).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const H = 600;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, window.innerWidth / H, 0.1, 1000);
    camera.position.z = 380;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, H);

    const N = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1300;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 750;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 450;
      const t = Math.random();
      colors[i * 3] = 0.31 + t * 0.25;
      colors[i * 3 + 1] = 0.48 + t * 0.26;
      colors[i * 3 + 2] = 0.38 + t * 0.24;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const onResize = () => {
      camera.aspect = window.innerWidth / H;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, H);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let ct = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ct += 0.004;
      points.rotation.y += 0.0008;
      points.rotation.x = Math.sin(ct * 0.28) * 0.06;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Magnetic button (motion + fine pointer only).
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const finePointer =
      typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion() || !finePointer) return;

    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () =>
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      btn.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={scope}
      aria-labelledby="cta-heading"
      className="home-cta bg-foreground py-24 text-center md:py-32"
    >
      <canvas ref={canvasRef} aria-hidden className="home-cta-canvas" />
      <div aria-hidden className="home-cta-glow" />
      <Container className="relative z-10 flex flex-col items-center">
        {eyebrow ? (
          <p className="js-cta-reveal mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id="cta-heading"
          className="js-cta-reveal max-w-3xl font-display text-4xl font-normal leading-tight tracking-tight text-background md:text-6xl"
        >
          {lead}
          {emphasis ? <em className="italic text-primary">{emphasis}</em> : null}
        </h2>
        {body ? (
          <p className="js-cta-reveal mt-5 max-w-xl text-sm text-background/55">{body}</p>
        ) : null}
        <Link
          ref={btnRef}
          href={primaryCta.href}
          className="js-cta-reveal mt-10 inline-flex items-center gap-2 rounded-full bg-background px-9 py-3.5 text-sm font-medium text-foreground transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background"
        >
          {primaryCta.label} →
        </Link>
      </Container>
    </section>
  );
}
