"use client";

import Image from "next/image";
import { useGsap } from "@/lib/anim/use-gsap";

/** Demo lifestyle photography served from local /assets/home/*. */
const PHOTOS = [
  {
    src: "/assets/home/strip-yoga.jpg",
    alt: "Sample image — an outdoor yoga session.",
    label: "Yoga",
  },
  {
    src: "/assets/home/strip-meditation.jpg",
    alt: "Sample image — a guided meditation.",
    label: "Meditation",
  },
  {
    src: "/assets/home/strip-training.jpg",
    alt: "Sample image — a strength training session.",
    label: "Training",
  },
];

export function HomePhotoStrip() {
  const scope = useGsap<HTMLDivElement>(({ gsap, scope }) => {
    scope.querySelectorAll<HTMLElement>(".home-photo-strip-item").forEach((item) => {
      const img = item.querySelector("img");
      if (!img) return;
      gsap.fromTo(
        img,
        { yPercent: -6, scale: 1.12 },
        {
          yPercent: 6,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  }, []);

  return (
    <div ref={scope} className="grid grid-cols-1 border-b border-border sm:grid-cols-3">
      {PHOTOS.map((photo) => (
        <div key={photo.label} className="home-photo-strip-item group">
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 40rem) 33vw, 100vw" />
          <div aria-hidden className="home-photo-strip-overlay" />
          <span className="absolute bottom-6 left-6 font-display text-xl text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {photo.label}
          </span>
        </div>
      ))}
    </div>
  );
}
