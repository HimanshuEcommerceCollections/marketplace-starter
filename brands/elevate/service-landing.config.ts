import type { ServiceLandingRegistry } from "@/lib/services/landing";

/**
 * Elevate service landing pages, keyed by service slug. Each entry fully drives
 * a /services/<slug> landing page — adding a new service page only requires a
 * new object here (no page or component code). The slug MUST match a catalog
 * service.id and a pricing.v1.json services key.
 */
export const elevateServiceLanding: ServiceLandingRegistry = {
  /* ───────────────────────────── Massage ───────────────────────────── */
  massage: {
    slug: "massage",
    hero: {
      variant: "dark",
      eyebrow: "Massage",
      title: "In-Home Massage",
      subtitle:
        "Premium massage services delivered to your home by vetted independent professionals.",
      primaryCta: { label: "Book Massage", href: "/book?service=massage" },
      secondaryCta: { label: "How It Works", href: "#how-it-works" },
      trustIndicators: [
        "Background Checked",
        "Identity Verified",
        "Coordinator Confirmed",
      ],
      image: {
        caption: {
          title: "Lifestyle image",
          lines: [
            "Professional + client · real home",
            "Natural light · warm residential",
          ],
        },
      },
    },
    sections: [
      {
        type: "cards",
        variant: "centered",
        heading: "Designed for comfort. Built on trust.",
        columns: 4,
        items: [
          {
            icon: "BadgeCheck",
            title: "Identity Verification",
            description:
              "Every professional's identity is verified before joining the Elevate marketplace.",
          },
          {
            icon: "ShieldCheck",
            title: "Background Checks",
            description:
              "Comprehensive background screening for every independent professional on the platform.",
          },
          {
            icon: "ClipboardCheck",
            title: "Coordinator Confirmation",
            description:
              "A real coordinator confirms every booking — a named human, every time.",
          },
          {
            icon: "Handshake",
            title: "Independent Professionals",
            description:
              "All professionals are independent partners with Elevate — never employees.",
          },
        ],
      },
      {
        type: "timeline",
        heading: "Your massage experience, step by step",
        steps: [
          { title: "Book Request", description: "Submit preferences via the booking configurator." },
          { title: "Coordinator Review", description: "Your coordinator reviews and confirms availability." },
          { title: "Professional Match", description: "Matched to a vetted independent professional." },
          { title: "Arrival at Home", description: "Your professional arrives at the scheduled time." },
          { title: "Session", description: "Your massage, in your space, on your schedule." },
          { title: "Follow-Up", description: "Rebook when ready — your preferences are remembered." },
        ],
      },
      {
        type: "configurator",
        variant: "interactive",
        cta: { label: "Book Massage", href: "/book?service=massage" },
        groups: [
          {
            id: "duration",
            label: "Duration",
            type: "single",
            defaultOptionId: "60",
            options: [
              { id: "60", label: "60 min" },
              { id: "90", label: "90 min" },
              { id: "120", label: "120 min" },
            ],
          },
          {
            id: "session-type",
            label: "Session Type",
            type: "single",
            defaultOptionId: "swedish",
            options: [
              { id: "swedish", label: "Swedish" },
              { id: "deep-tissue", label: "Deep Tissue" },
              { id: "prenatal", label: "Prenatal" },
              { id: "sports", label: "Sports" },
            ],
          },
          {
            id: "add-ons",
            label: "Add-ons",
            type: "multi",
            options: [
              { id: "hot-stones", label: "Hot Stones", note: "+$20" },
              { id: "aromatherapy", label: "Aromatherapy", note: "+$10" },
              { id: "couples", label: "Couples", note: "+$60" },
              { id: "targeted-focus", label: "Targeted Focus" },
            ],
          },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        heading: "Why in-home is better",
        columns: 3,
        items: [
          { icon: "Car", title: "No commute", description: "Walk from your session directly to your couch. Recovery starts immediately without traffic or travel." },
          { icon: "Home", title: "Familiar environment", description: "Recover in your own space with your preferred setup, playlist, and comfort level." },
          { icon: "CalendarDays", title: "Flexible scheduling", description: "Morning, evening, or weekend availability — your schedule drives the experience." },
          { icon: "Sparkles", title: "Personalized experience", description: "Your preferences are remembered and communicated before every appointment." },
          { icon: "ShieldCheck", title: "Vetted professionals", description: "Background checked and identity verified professionals who meet Elevate standards." },
          { icon: "Headphones", title: "Coordinator support", description: "A real person confirms your booking and helps ensure a smooth experience." },
        ],
      },
      { type: "testimonials" },
      {
        type: "faq",
        heading: "Common questions",
        viewAll: { label: "View Full FAQ", href: "/faq" },
        items: [
          { id: "massage-prep", question: "What should I prepare before a massage? (Sample)", answer: "Just a quiet, comfortable space — your professional brings everything needed. Placeholder answer for the INTERNAL DRAFT starter." },
          { id: "massage-matching", question: "How does provider matching work? (Sample)", answer: "A coordinator matches you with a vetted independent professional based on your preferences and schedule." },
          { id: "massage-reschedule", question: "What happens if I need to reschedule? (Sample)", answer: "This demo does not process real bookings — rescheduling would be handled by your coordinator." },
          { id: "massage-vetting", question: "Are professionals vetted? (Sample)", answer: "Yes — every professional passes a [Sample] background and identity check before joining." },
        ],
      },
      {
        type: "cta",
        title: "Wellness shouldn't require a commute.",
        body: "Book your first in-home massage with a vetted independent professional.",
        primaryCta: { label: "Book Massage", href: "/book?service=massage" },
        secondaryCta: { label: "View Pricing", href: "/pricing" },
      },
    ],
  },

  /* ───────────────────────── Personal Training ─────────────────────── */
  "personal-training": {
    slug: "personal-training",
    hero: {
      variant: "light",
      eyebrow: "Personal Training",
      title: "In-Home Personal Training",
      subtitle:
        "Personalized fitness guidance delivered to your home by vetted independent professionals.",
      primaryCta: {
        label: "Book Personal Training",
        href: "/book?service=personal-training",
      },
      secondaryCta: { label: "How It Works", href: "#how-it-works" },
      image: {
        gradient: true,
        caption: {
          title: "Professional coaching client in a residential setting",
          lines: ["Natural light · Real home · One-on-one"],
        },
      },
    },
    sections: [
      {
        type: "cards",
        variant: "stacked",
        columns: 4,
        items: [
          { icon: "Activity", title: "General Fitness", description: "Build a consistent routine and improve your overall strength, endurance, and energy levels." },
          { icon: "Dumbbell", title: "Strength Building", description: "Progressive resistance training designed around your schedule and available home equipment." },
          { icon: "PersonStanding", title: "Mobility & Flexibility", description: "Targeted movement practice to reduce stiffness, improve range of motion, and support recovery." },
          { icon: "Target", title: "Accountability & Routine", description: "Regular check-ins and structured sessions to keep you consistent and moving toward your goals." },
        ],
      },
      {
        type: "processCards",
        surface: "muted",
        columns: 4,
        steps: [
          { title: "Submit Request", description: "Tell us your goals, availability, and any preferences through our simple intake form." },
          { title: "Coordinator Review", description: "Our team reviews your request to understand what type of professional will serve you best." },
          { title: "Professional Match", description: "We identify an independent professional whose background aligns with your specific needs." },
          { title: "Schedule Confirmation", description: "You confirm availability and your first session is scheduled at your convenience." },
        ],
      },
      {
        type: "configurator",
        variant: "preview",
        heading: "Configure your session.",
        subheading: "Preview options — exact configuration happens during booking.",
        groups: [
          {
            id: "duration",
            label: "Session Duration",
            icon: "Clock",
            type: "single",
            options: [
              { id: "30", label: "30 min" },
              { id: "45", label: "45 min" },
              { id: "60", label: "60 min" },
              { id: "90", label: "90 min" },
            ],
          },
          {
            id: "focus",
            label: "Session Focus",
            icon: "Target",
            type: "single",
            options: [
              { id: "strength", label: "Strength" },
              { id: "cardio", label: "Cardio" },
              { id: "mobility", label: "Mobility" },
              { id: "general", label: "General Fitness" },
            ],
          },
          {
            id: "location",
            label: "Location Setup",
            icon: "MapPin",
            type: "single",
            options: [
              { id: "indoor", label: "Indoor" },
              { id: "outdoor", label: "Outdoor" },
              { id: "home-gym", label: "Home Gym" },
              { id: "no-preference", label: "No Preference" },
            ],
          },
          {
            id: "experience",
            label: "Experience Level",
            icon: "Gauge",
            type: "single",
            options: [
              { id: "beginner", label: "Beginner" },
              { id: "intermediate", label: "Intermediate" },
              { id: "advanced", label: "Advanced" },
              { id: "adaptive", label: "Adaptive" },
            ],
          },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        surface: "muted",
        heading: "Why train at home?",
        subheading: "Your home is the most effective gym you've never fully used.",
        columns: 4,
        items: [
          { icon: "Car", title: "No Commute", description: "Skip the drive. Your session starts the moment your trainer arrives." },
          { icon: "Home", title: "Familiar Environment", description: "Train in your living room, backyard, or home gym — wherever you're most comfortable." },
          { icon: "CalendarDays", title: "Flexible Scheduling", description: "Morning, lunch, or evening — sessions fit your calendar, not a gym's operating hours." },
          { icon: "Target", title: "Personalized Attention", description: "100% focused on your goals. No distractions, no waiting for equipment, no wasted time." },
        ],
      },
      {
        type: "stepper",
        heading: "Six steps from intent to first session.",
        subheading: "Transparent and designed to respect your time.",
        activeIndex: 4,
        steps: [
          "Pick Service",
          "Configure",
          "See Price",
          "Details + Schedule",
          "Confirm + Submit",
          "Session Confirmed",
        ],
      },
      {
        type: "testimonials",
        heading: "What clients are saying.",
        subheading: "[Sample] testimonials — for demonstration purposes",
        items: [
          { id: "pt-1", quote: "The convenience alone was worth it. Having a professional come to my home changed everything.", author: "J.M.", role: "Personal Training — 60 min · Raleigh, NC", isSample: true },
          { id: "pt-2", quote: "I'd tried gym memberships for years and nothing stuck. This is what I needed.", author: "T.R.", role: "Personal Training — Strength · Cary, NC", isSample: true },
          { id: "pt-3", quote: "My trainer adapted the session around what equipment I had at home. It never felt like a limitation — it felt personalized.", author: "S.L.", role: "Personal Training — 45 min · Wake Forest, NC", isSample: true },
        ],
      },
      {
        type: "faq",
        viewAll: { label: "View Full FAQ", href: "/faq" },
      },
      {
        type: "cta",
        title: "Fitness that fits your schedule.",
        body: "Book your first in-home session with a vetted independent professional.",
        primaryCta: {
          label: "Book Personal Training",
          href: "/book?service=personal-training",
        },
        secondaryCta: { label: "View Pricing", href: "/pricing" },
      },
    ],
  },
};
