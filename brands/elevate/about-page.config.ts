import type { AboutPageConfig } from "@/lib/about/page";

/**
 * "About" page content for the Elevate brand (redesigned bespoke layout).
 * Photography currently hotlinks Unsplash like the homepage (see
 * next.config.ts remotePatterns); swap for /assets/about/* files once the
 * designer supplies final art. Stats in the dark band are illustrative
 * INTERNAL DRAFT placeholders, not real claims.
 */
export const elevateAbout: AboutPageConfig = {
  hero: {
    eyebrow: "The Elevate Story",
    title: "Care.",
    titleAccent: "Delivered.",
    sub: "We started with a simple frustration: the best wellness in Raleigh required the worst logistics. So we flipped it — the professionals come to you.",
    image:
      "https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?w=1600&q=85&fit=crop&auto=format",
  },

  story: {
    kicker: "Why we exist",
    heading: "Wellness shouldn't require a commute",
    paragraphs: [
      "Elevate began in Raleigh with one question: why does taking care of yourself mean fighting traffic, waiting rooms, and rushed appointments? The therapists, trainers, and coaches here are exceptional — the experience of reaching them wasn't.",
      "So we built the missing layer: a platform where every professional is personally vetted, every price is all-in and visible before you commit, and a real human coordinator — not an algorithm — stands behind every single booking.",
      "Today, Elevate delivers eight disciplines across all of Wake County, from a Tuesday-evening massage in Cary to a twelve-week coaching program in Wake Forest.",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1598901986949-f593ff2a31a6?w=1000&q=85&fit=crop&auto=format",
      alt: "Care in human hands",
    },
  },

  values: {
    eyebrow: "What we stand on",
    heading: "Four things we won't compromise",
    items: [
      {
        icon: "UsersThree",
        title: "Humans coordinate, always",
        body: "Every booking is reviewed by a coordinator who knows our professionals personally. Matching is done by judgment and care — availability alone is never enough.",
      },
      {
        icon: "ShieldCheck",
        title: "A vetting bar that stays high",
        body: "License verification, background check, insurance review, and an in-person interview — for every professional, every time. Most applicants don't make it. That's the point.",
      },
      {
        icon: "Receipt",
        title: "Honest, all-in pricing",
        body: "The price you see includes travel, equipment, and gratuity. You'll always see your exact price before confirming — and it never changes at the door.",
      },
      {
        icon: "MapPin",
        title: "Raleigh roots, local pride",
        body: "We're not a franchise from somewhere else. Our coordinators live here, our professionals practice here, and all of Wake County is home turf — travel included, always.",
      },
    ],
  },

  band: {
    title: "Built around one belief:",
    titleAccent: "your wellness, your terms.",
    body: "Not a marketplace. Not an app that shrugs when things go wrong. A service — with people behind it.",
    chips: [
      { value: "8", label: "Disciplines" },
      { value: "100%", label: "Vetted Pros" },
      { value: "<1hr", label: "Confirmation" },
      { value: "12", label: "Areas Served" },
    ],
    image:
      "https://images.unsplash.com/photo-1544717304-a2db4a7b16ee?w=1600&q=85&fit=crop&auto=format",
  },

  cta: {
    eyebrow: "Your turn",
    title: "Ready when",
    titleAccent: "you are.",
    body: "Pick a service, set your time, and meet the professional who comes to you.",
    primaryCta: { label: "Book a session", href: "/book" },
    secondaryCta: { label: "Browse services", href: "/services" },
    image:
      "https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?w=1600&q=85&fit=crop&auto=format",
  },
};
