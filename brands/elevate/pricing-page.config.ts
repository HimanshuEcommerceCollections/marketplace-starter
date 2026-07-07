import type { PricingPageConfig } from "@/lib/pricing/page";

/**
 * "Pricing" page content for the Elevate brand (redesigned).
 *
 * Service base data (title, icon, from-price, coming-soon) comes from
 * services.json; the per-service `extras` below add the marketing highlights.
 * Session Packs, guarantees, factors and FAQ are STATIC illustrative content —
 * there is no purchase/credit backend yet (INTERNAL DRAFT).
 */
export const elevatePricingPage: PricingPageConfig = {
  hero: {
    eyebrow: "No hidden fees · No negotiations",
    title: "One price.",
    titleAccent: "Total clarity.",
    sub: "Every session, every service — the price you see is the price you pay. Tips included. No surprises.",
  },

  services: {
    eyebrow: "Starting Prices",
    heading: "Your session, your price",
    subheading:
      "Every service starts from the prices below. Configure your duration, add-ons, and preferences at booking — you'll see your exact price before you confirm, and it never changes after.",
    ctaActive: "Configure & see your price",
    ctaComingSoon: "Join the waitlist",
    extras: {
      massage: {
        duration: "60 or 90 min sessions",
        points: [
          "Style: Swedish, deep tissue, sports, prenatal",
          "Pressure & focus areas",
          "Add-ons like hot stones",
        ],
      },
      "personal-training": {
        title: "Personal Training",
        duration: "45, 60 or 90 min",
        points: [
          "Solo or partner session",
          "Goals & program focus",
          "4, 8 & 12-session packs",
        ],
      },
      yoga: {
        duration: "60 or 90 min",
        points: [
          "Style: Hatha, Vinyasa, Yin & more",
          "Solo or semi-private up to 4",
          "Your space, indoors or out",
        ],
      },
      beauty: {
        duration: "$75 booking minimum",
        points: [
          "Hair, makeup or nails",
          "Number of guests",
          "Event & bridal packages",
        ],
      },
      "nutrition-coaching": {
        title: "Nutrition",
        duration: "60 or 90 min consults",
        points: [
          "Single consult or program",
          "4-week & 12-week options",
          "Dietary needs & goals",
        ],
      },
      "life-coaching": {
        title: "Life Coaching",
        duration: "60 or 90 min",
        points: [
          "Single sessions or 12-week program",
          "In-person or virtual",
          "Focus: direction, habits, career",
        ],
      },
      "physical-therapy": {
        duration: "Evaluation first",
        coordinator: true,
        priceMinor: 13500,
        points: [
          "Licensed NC physical therapists",
          "Treatment plan after evaluation",
          "Post-surgery, injury, mobility",
        ],
      },
      "speech-therapy": {
        duration: "Evaluation first",
        coordinator: true,
        points: [
          "Licensed SLPs, adults & kids",
          "Program shaped at evaluation",
          "In-home or teletherapy",
        ],
      },
    },
    factors: {
      title: "What shapes your price",
      items: [
        {
          icon: "Clock",
          title: "Duration",
          text: "Choose 45, 60, or 90 minutes where available — longer sessions cost more, minute for minute less.",
        },
        {
          icon: "PlusCircle",
          title: "Add-ons & options",
          text: "Hot stones, extra guests, specialty requests — each add-on shows its price before you select it.",
        },
        {
          icon: "UserCheck",
          title: "Coordinator review",
          text: "Physical & speech therapy quotes are confirmed by your coordinator after a short evaluation.",
        },
        {
          icon: "MapPin",
          title: "Never affects price",
          text: "Travel anywhere in Wake County, equipment, and gratuity — always included, never extra.",
        },
      ],
    },
  },

  packs: {
    eyebrow: "Session Packs",
    heading: "Save with packs",
    subheading:
      "Commit to your wellness routine and save on every session. Packs never expire and work across all services.",
    tiers: [
      {
        slug: "starter",
        name: "Starter",
        tagline: "Perfect for trying us out",
        priceMinor: 9900,
        cadence: "/mo",
        per: "1 session credit per month",
        save: "Save 10% per session",
        features: [
          "1 credit monthly, any service",
          "Credits roll over, never expire",
          "Priority booking window",
          "Cancel anytime",
        ],
        cta: { label: "Choose Starter", href: "/book" },
      },
      {
        slug: "routine",
        name: "Routine",
        tagline: "For a consistent practice",
        priceMinor: 33900,
        cadence: "/mo",
        per: "4 session credits per month",
        save: "Save $40 every month",
        featured: true,
        features: [
          "4 credits monthly, any service",
          "Credits roll over, never expire",
          "Same-day booking priority",
          "Dedicated coordinator",
          "Share credits with family",
        ],
        cta: { label: "Choose Routine", href: "/book" },
      },
      {
        slug: "total-wellness",
        name: "Total Wellness",
        tagline: "The full experience",
        priceMinor: 64900,
        cadence: "/mo",
        per: "8 session credits per month",
        save: "Save $110 every month",
        features: [
          "8 credits monthly, any service",
          "Credits roll over, never expire",
          "Instant confirmation",
          "Preferred pro matching",
          "Quarterly wellness review",
        ],
        cta: { label: "Choose Total", href: "/book" },
      },
    ],
  },

  guarantees: [
    {
      icon: "SealCheck",
      title: "Price-lock guarantee",
      body: "The price at booking is the price you pay. Always. No surge, no add-ons at the door.",
    },
    {
      icon: "ArrowsCounterClockwise",
      title: "Free rescheduling",
      body: "Life happens. Reschedule up to 4 hours before your session at no charge.",
    },
    {
      icon: "Heart",
      title: "Satisfaction promise",
      body: "Not happy with your session? We'll make it right — credit or full refund.",
    },
    {
      icon: "HandCoins",
      title: "Tips included",
      body: "Gratuity is built into every price. Your pro is paid fairly, and you never do awkward math.",
    },
  ],

  faq: {
    eyebrow: "Questions",
    heading: "Pricing FAQ",
    items: [
      {
        id: "fees",
        question: "Are there any hidden fees?",
        answer:
          "None. The price you see covers everything — the professional's time, travel anywhere in Wake County, all equipment, and gratuity. What you see at checkout is exactly what you pay.",
      },
      {
        id: "credits",
        question: "Do pack credits expire?",
        answer:
          "Never. Unused credits roll over month to month for as long as your pack is active, and remain usable for 12 months if you cancel.",
      },
      {
        id: "family",
        question: "Can I share my pack with family?",
        answer:
          "Routine and Total Wellness packs include family sharing — anyone in your household can book sessions using your credits.",
      },
      {
        id: "cancel",
        question: "What's your cancellation policy?",
        answer:
          "Cancel or reschedule free up to 4 hours before your session. Inside 4 hours, a 50% fee applies to cover your professional's committed time.",
      },
      {
        id: "corporate",
        question: "Do you offer corporate rates?",
        answer:
          "Yes — we build custom wellness programs for teams of 5 to 500. Visit our Corporate Wellness page or contact us for a tailored quote.",
      },
    ],
  },

  cta: {
    eyebrow: "Ready?",
    title: "Start your routine",
    titleAccent: "today.",
    body: "Transparent pricing. Vetted professionals. Delivered across Wake County.",
    primaryCta: { label: "Book a session", href: "/book" },
  },
};
