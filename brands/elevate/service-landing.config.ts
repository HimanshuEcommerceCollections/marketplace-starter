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
        variant: "interactive",
        cta: { label: "Book Personal Training", href: "/book?service=personal-training" },
        groups: [
          {
            id: "session-format",
            label: "Session Format",
            type: "single",
            defaultOptionId: "individual",
            options: [
              { id: "individual", label: "Individual" },
              { id: "partner-training", label: "Partner Training" },
              { id: "small-group", label: "Small Group (3–5)" },
            ],
          },
          {
            id: "duration",
            label: "Duration",
            type: "single",
            defaultOptionId: "60",
            options: [
              { id: "45", label: "45 Minutes" },
              { id: "60", label: "60 Minutes" },
              { id: "90", label: "90 Minutes" },
            ],
          },
          {
            id: "goal-focus",
            label: "Goal Focus",
            type: "single",
            defaultOptionId: "general-fitness",
            options: [
              { id: "weight-loss", label: "Weight Loss" },
              { id: "strength-training", label: "Strength Training" },
              { id: "mobility-flexibility", label: "Mobility & Flexibility" },
              { id: "general-fitness", label: "General Fitness" },
            ],
          },
          {
            id: "package",
            label: "Package",
            type: "single",
            defaultOptionId: "single",
            options: [
              { id: "single", label: "Single Session" },
              { id: "pack-4", label: "4 Session Pack" },
              { id: "pack-8", label: "8 Session Pack" },
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

  /* ───────────────────────────────── Yoga ──────────────────────────── */
  yoga: {
    slug: "yoga",
    hero: {
      variant: "light",
      eyebrow: "In-Home Yoga",
      title: "Yoga That Fits Your Schedule, Space, and Goals",
      subtitle:
        "Personalized yoga sessions delivered to your home by vetted independent professionals — tailored to your goals, flexible around your schedule.",
      primaryCta: { label: "Book Yoga", href: "/book?service=yoga" },
      image: {
        gradient: true,
        caption: {
          title: "Instructor guiding a session inside a real residential home",
          lines: ["Calm · Natural light · One-on-one"],
        },
      },
    },
    sections: [
      {
        type: "cards",
        variant: "stacked",
        heading: "Why Choose In-Home Yoga?",
        columns: 4,
        items: [
          { icon: "Target", title: "Personalized Attention", description: "Your instructor focuses entirely on you — adjusting form, breath, and pace to match your body and goals." },
          { icon: "CalendarDays", title: "Flexible Scheduling", description: "Morning flows or evening wind-downs — book sessions that fit your calendar, not the other way around." },
          { icon: "Home", title: "Comfort of Home", description: "Practice in your own space with your own rhythm. No commute, no crowds, no self-consciousness." },
          { icon: "TrendingUp", title: "Support for Every Level", description: "Beginner or advanced, our professionals meet you where you are and guide you forward with care." },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        surface: "muted",
        heading: "Find the practice that fits you",
        subheading: "Your sessions adapt to your goals — the exact focus is configured during booking.",
        columns: 4,
        items: [
          { icon: "Flower2", title: "Gentle Flow", description: "Slow, connected movement sequences designed to build warmth and ease in the body." },
          { icon: "Activity", title: "Mobility Focus", description: "Targeted work on specific areas — hips, shoulders, spine — to restore function and freedom of movement." },
          { icon: "Star", title: "Beginner Sessions", description: "A welcoming introduction to yoga fundamentals, terminology, and foundational postures." },
          { icon: "Compass", title: "General Wellness", description: "A balanced mix of movement, breath, and rest tailored to how you feel on a given day." },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        heading: "Why practice at home?",
        subheading: "Your home is the calmest studio you'll ever roll out a mat in.",
        columns: 4,
        items: [
          { icon: "Car", title: "No Travel Required", description: "Your session starts the moment your instructor arrives. No commute, no parking, no rushing." },
          { icon: "Home", title: "Comfortable Environment", description: "Practice in your own space where you feel most at ease — floor, mat, or however you prefer." },
          { icon: "CalendarDays", title: "Flexible Scheduling", description: "Early morning, midday, or evening — sessions adapt to your calendar, not the other way around." },
          { icon: "Target", title: "Personalized Attention", description: "Every session is entirely yours. Your instructor watches only you and adjusts in real time." },
        ],
      },
      {
        type: "processCards",
        surface: "muted",
        columns: 4,
        steps: [
          { title: "Submit Request", description: "Tell us about your experience level, goals, and when you'd like to practice through our quick intake form." },
          { title: "Coordinator Review", description: "Our team reviews your request to understand what kind of instructor will serve you best." },
          { title: "Professional Match", description: "We identify an independent instructor whose background and style aligns with your specific needs." },
          { title: "Schedule Confirmation", description: "You confirm availability and your first session is scheduled at your home, on your terms." },
        ],
      },
      {
        type: "sessionSteps",
        heading: "What Happens During a Session?",
        imagePosition: "left",
        image: {
          caption: {
            title: "Lifestyle photography placeholder",
            lines: ["Home yoga session in progress"],
          },
        },
        items: [
          { icon: "MessageCircle", title: "Initial Discussion", description: "Your professional begins by understanding your goals, any physical considerations, and what you'd like to work on." },
          { icon: "Target", title: "Goal Setting", description: "Together you'll set clear intentions for the session — whether strength, flexibility, relaxation, or breath work." },
          { icon: "Activity", title: "Guided Practice", description: "A fully tailored sequence designed around your body, pace, and environment — guided and adjusted in real time." },
          { icon: "ClipboardCheck", title: "Recommendations", description: "Your professional shares simple guidance to carry between sessions, so your practice keeps progressing." },
        ],
      },
      {
        type: "stepper",
        heading: "Six steps from intent to first session.",
        subheading: "Transparent and designed to respect your time.",
        activeIndex: 2,
        steps: [
          "Pick Service",
          "Configure",
          "See the Price",
          "Details + Schedule",
          "Confirm + Submit",
          "Success",
        ],
      },
      {
        type: "configurator",
        variant: "interactive",
        cta: { label: "Book Yoga", href: "/book?service=yoga" },
        groups: [
          {
            id: "session-format",
            label: "Session Format",
            type: "single",
            defaultOptionId: "individual",
            options: [
              { id: "individual", label: "Individual" },
              { id: "couple", label: "Couple" },
              { id: "small-group", label: "Small Group" },
            ],
          },
          {
            id: "duration",
            label: "Duration",
            type: "single",
            defaultOptionId: "60",
            options: [
              { id: "60", label: "60 Minutes" },
              { id: "90", label: "90 Minutes" },
            ],
          },
          {
            id: "yoga-style",
            label: "Yoga Style",
            type: "single",
            defaultOptionId: "gentle-flow",
            options: [
              { id: "gentle-flow", label: "Gentle Flow" },
              { id: "hatha", label: "Hatha" },
              { id: "vinyasa", label: "Vinyasa" },
              { id: "restorative", label: "Restorative" },
            ],
          },
          {
            id: "package",
            label: "Package",
            type: "single",
            defaultOptionId: "single",
            options: [
              { id: "single", label: "Single Session" },
              { id: "pack-4", label: "4 Session Pack" },
              { id: "pack-8", label: "8 Session Pack" },
            ],
          },
        ],
      },
      {
        type: "testimonials",
        surface: "muted",
        heading: "What clients are saying.",
        subheading: "[Sample] testimonials — for demonstration purposes",
        items: [
          { id: "yoga-1", quote: "Having an instructor come to my apartment completely changed how I approach mornings. It's the one habit that's actually stuck.", author: "A.R.", role: "In-Home Yoga · Raleigh, NC", isSample: true },
          { id: "yoga-2", quote: "I'd been intimidated by yoga for years. Working with someone in my own living room made it feel approachable from day one.", author: "M.C.", role: "In-Home Yoga · Cary, NC", isSample: true },
          { id: "yoga-3", quote: "The matching process was easy and the instructor clearly understood what I was looking for — gentle but real.", author: "K.W.", role: "In-Home Yoga · Wake County, NC", isSample: true },
        ],
      },
      {
        type: "faq",
        heading: "Common Questions",
        items: [
          { id: "yoga-process", question: "How does the booking and coordinator process work?", answer: "You submit a request detailing your goals, preferred times, and home setup. Our coordination team reviews it personally and matches you with the most suitable independent professional available — then confirms the details directly with you before the session." },
          { id: "yoga-employment", question: "Are the yoga professionals employees of Elevate?", answer: "No. All professionals on the Elevate marketplace are independent, vetted practitioners. Elevate provides coordination, matching, and support — the professional delivers the session." },
          { id: "yoga-same-pro", question: "Can I request the same professional for future sessions?", answer: "Yes. If you'd like to continue with the same professional, let your coordinator know and they'll do their best to match their availability for your future sessions." },
          { id: "yoga-prep", question: "What should I have ready at home for a yoga session?", answer: "Just a clear, comfortable space about the size of a yoga mat, plus any props you already own. Your professional brings the expertise — you bring the space." },
        ],
        viewAll: { label: "View Full FAQ", href: "/faq" },
      },
      {
        type: "cta",
        title: "Wellness shouldn't require a commute.",
        body: "Book your first in-home yoga session with a vetted independent professional.",
        primaryCta: { label: "Book Yoga", href: "/book?service=yoga" },
        secondaryCta: { label: "View Pricing", href: "/pricing" },
      },
    ],
  },

  /* ─────────────────────────── Nutrition Coaching ──────────────────────── */
  "nutrition-coaching": {
    slug: "nutrition-coaching",
    hero: {
      variant: "light",
      eyebrow: "Nutrition Coaching",
      title: "In-Home Nutrition Coaching",
      subtitle:
        "Personalized nutrition guidance delivered by vetted independent professionals.",
      primaryCta: {
        label: "Book Nutrition Coaching",
        href: "/book?service=nutrition-coaching",
      },
      secondaryCta: { label: "How It Works", href: "#how-it-works" },
      image: {
        gradient: true,
        caption: {
          title: "Nutrition coach working with a client in a real home kitchen",
          lines: ["Natural light · Residential setting"],
        },
      },
    },
    sections: [
      {
        type: "cards",
        variant: "stacked",
        heading: "Coaching built around your goals.",
        subheading:
          "Whether you're starting from scratch or refining what's already working, sessions are built around you.",
        columns: 4,
        items: [
          { icon: "HeartPulse", title: "Healthy Habits", description: "Build sustainable day-to-day habits that support your energy, focus, and overall wellbeing." },
          { icon: "Salad", title: "Meal Planning", description: "Practical, realistic guidance on structuring meals that fit your schedule and preferences." },
          { icon: "RefreshCw", title: "Lifestyle Support", description: "Coaching that works around your existing routine rather than asking you to overhaul it." },
          { icon: "TrendingUp", title: "Long-Term Wellness", description: "An ongoing relationship with a professional who helps you stay consistent over time." },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        surface: "muted",
        heading: "What coaching can include.",
        subheading:
          "Informational preview — actual session content is tailored to your needs and discussed at booking.",
        columns: 4,
        items: [
          { icon: "Target", title: "Goal Setting", description: "A structured conversation about where you are, where you want to be, and how to get there practically. Not medical or clinical treatment." },
          { icon: "Activity", title: "Habit Building", description: "Identifying small, consistent changes that are realistic for your life and build over time. Not medical or clinical treatment." },
          { icon: "ClipboardCheck", title: "Meal Planning Guidance", description: "Practical frameworks for planning and preparing meals that align with your goals and schedule. Not medical or clinical treatment." },
          { icon: "CalendarCheck", title: "Accountability Support", description: "Regular check-ins that keep you on track without pressure or judgment. Not medical or clinical treatment." },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        heading: "Why at-home coaching works.",
        columns: 4,
        items: [
          { icon: "Compass", title: "Practical Guidance", description: "Coaching in context. Discussing real meals, real kitchens, and real schedules makes guidance actionable." },
          { icon: "Home", title: "Familiar Environment", description: "Meeting in your own space helps your professional understand your actual day-to-day reality." },
          { icon: "PersonStanding", title: "Personalized Support", description: "Every session is entirely focused on your goals, not a general curriculum or group format." },
          { icon: "Clock", title: "Flexible Scheduling", description: "Morning, midday, or evening — sessions happen when they work for you, not around a clinic's hours." },
        ],
      },
      {
        type: "processCards",
        surface: "muted",
        heading: "A better fit than searching alone.",
        subheading:
          "Every request receives human review before a professional is matched to you.",
        columns: 4,
        steps: [
          { title: "Submit Request", description: "Share your goals, current habits, and preferences through our brief intake form." },
          { title: "Coordinator Review", description: "Our team reviews your request to ensure we match you with the right kind of professional." },
          { title: "Professional Match", description: "We identify an independent nutrition professional whose background fits your specific needs." },
          { title: "Schedule Confirmation", description: "You confirm your availability and your first session is scheduled at your convenience." },
        ],
      },
      {
        type: "stepper",
        heading: "Six steps from intent to first session.",
        subheading: "The booking flow is clear and designed around your time.",
        activeIndex: 0,
        steps: [
          "Pick Service",
          "Configure",
          "See Price",
          "Details + Schedule",
          "Confirm + Submit",
          "Success",
        ],
      },
      {
        type: "configurator",
        variant: "interactive",
        cta: { label: "Book Nutrition Coaching", href: "/book?service=nutrition-coaching" },
        groups: [
          {
            id: "consultation-type",
            label: "Consultation Type",
            type: "single",
            defaultOptionId: "initial",
            options: [
              { id: "initial", label: "Initial Consultation" },
              { id: "follow-up", label: "Follow-Up Session" },
            ],
          },
          {
            id: "format",
            label: "Format",
            type: "single",
            defaultOptionId: "in-home",
            options: [
              { id: "in-home", label: "In Home" },
              { id: "virtual", label: "Virtual" },
            ],
          },
          {
            id: "goal",
            label: "Goal",
            type: "single",
            defaultOptionId: "weight-management",
            options: [
              { id: "weight-management", label: "Weight Management" },
              { id: "sports-nutrition", label: "Sports Nutrition" },
              { id: "healthy-lifestyle", label: "Healthy Lifestyle" },
              { id: "medical-support", label: "Medical Nutrition Support" },
            ],
          },
          {
            id: "package",
            label: "Package",
            type: "single",
            defaultOptionId: "single",
            options: [
              { id: "single", label: "Single Session" },
              { id: "monthly", label: "Monthly Coaching" },
            ],
          },
        ],
      },
      {
        type: "testimonials",
        surface: "muted",
        heading: "What clients are saying.",
        subheading: "[Sample] testimonials shown for demonstration purposes",
        items: [
          { id: "nutrition-1", quote: "Having someone talk through my habits in my own kitchen made the guidance feel completely realistic, not like a plan from a magazine.", author: "Raleigh, NC", isSample: true },
          { id: "nutrition-2", quote: "I appreciated that the focus was on what I could actually do, not some ideal version of my life. It felt practical from the first session.", author: "Cary, NC", isSample: true },
          { id: "nutrition-3", quote: "The scheduling flexibility was what made this work for me. I'd tried this before and consistency was always the problem.", author: "Wake County, NC", isSample: true },
        ],
      },
      {
        type: "faq",
        heading: "Common questions.",
        viewAll: { label: "View Full FAQ", href: "/faq" },
      },
      {
        type: "cta",
        title: "Support that fits into your life.",
        body: "Book your first nutrition coaching session with a vetted independent professional.",
        primaryCta: {
          label: "Book Nutrition Coaching",
          href: "/book?service=nutrition-coaching",
        },
        secondaryCta: { label: "View Pricing", href: "/pricing" },
      },
    ],
  },

  /* ───────────────────────────── Life Coaching ─────────────────────── */
  "life-coaching": {
    slug: "life-coaching",
    hero: {
      variant: "light",
      eyebrow: "Life Coaching",
      title: "In-Home Life Coaching",
      subtitle:
        "Professional life coaching delivered by vetted independent professionals in a setting that feels comfortable and familiar.",
      primaryCta: {
        label: "Book Life Coaching",
        href: "/book?service=life-coaching",
      },
      secondaryCta: { label: "How It Works", href: "#how-it-works" },
      image: {
        gradient: true,
        caption: {
          title: "Professional coaching conversation in a real home environment",
          lines: ["Natural light · Comfortable setting"],
        },
      },
    },
    sections: [
      {
        type: "cards",
        variant: "stacked",
        heading: "Support for the goals that matter most.",
        subheading:
          "Examples only — focus areas are discussed and agreed upon at the start of your engagement.",
        columns: 4,
        items: [
          { icon: "TrendingUp", title: "Personal Growth", description: "Explore where you are, where you want to go, and what might be getting in the way. Example focus area — not a guarantee of outcome." },
          { icon: "Building2", title: "Career Development", description: "Clarify professional direction, priorities, and the steps that move you toward meaningful work. Example focus area — not a guarantee of outcome." },
          { icon: "Gauge", title: "Work-Life Balance", description: "Examine how your time and energy are distributed, and identify adjustments that feel sustainable. Example focus area — not a guarantee of outcome." },
          { icon: "CalendarCheck", title: "Accountability & Planning", description: "Build structure around your goals with regular check-ins and a professional who keeps you on track. Example focus area — not a guarantee of outcome." },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        surface: "muted",
        heading: "What a session may include.",
        subheading:
          "Informational preview — actual session content is guided by your goals and evolves over time.",
        columns: 4,
        items: [
          { icon: "Target", title: "Goal Clarification", description: "A structured conversation to articulate what you're working toward and why it matters to you. Not therapy or clinical treatment." },
          { icon: "Compass", title: "Action Planning", description: "Breaking larger goals into smaller, realistic steps you can act on between sessions. Not therapy or clinical treatment." },
          { icon: "Search", title: "Reflection & Review", description: "Looking back at recent weeks to understand what's working, what isn't, and what to adjust. Not therapy or clinical treatment." },
          { icon: "ClipboardCheck", title: "Accountability Support", description: "Checking in on commitments made in prior sessions and identifying what needs attention next. Not therapy or clinical treatment." },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        heading: "Why coaching at home works.",
        columns: 4,
        items: [
          { icon: "Home", title: "Comfortable Environment", description: "Sessions happen where you feel most at ease — no unfamiliar waiting rooms or formal offices." },
          { icon: "Clock", title: "Flexible Scheduling", description: "Morning, evening, or weekend — your schedule determines when sessions happen, not ours." },
          { icon: "PersonStanding", title: "Personalized Support", description: "Every session is entirely focused on your situation. No group format, no generic curriculum." },
          { icon: "Car", title: "No Commute", description: "Your professional comes to you. The session starts when they arrive, not when you find parking." },
        ],
      },
      {
        type: "processCards",
        surface: "muted",
        heading: "A thoughtful match, not a random one.",
        subheading:
          "Every request is reviewed by our coordination team before a professional is assigned.",
        columns: 4,
        steps: [
          { title: "Submit Request", description: "Share your goals and what you're looking for in a professional through our brief intake form." },
          { title: "Coordinator Review", description: "Our team reviews your request to ensure we understand your needs before making any match." },
          { title: "Professional Match", description: "We identify an independent professional whose background and approach fits your specific situation." },
          { title: "Schedule Confirmation", description: "You confirm your preferred times and your first session is scheduled at your convenience." },
        ],
      },
      {
        type: "stepper",
        heading: "Six steps from intent to first session.",
        subheading: "The booking flow is clear and respects your time.",
        activeIndex: 0,
        steps: [
          "Pick Service",
          "Configure",
          "See Price",
          "Details + Schedule",
          "Confirm + Submit",
          "Success",
        ],
      },
      {
        type: "configurator",
        variant: "interactive",
        cta: { label: "Book Life Coaching", href: "/book?service=life-coaching" },
        groups: [
          {
            id: "session-format",
            label: "Session Format",
            type: "single",
            defaultOptionId: "in-home",
            options: [
              { id: "in-home", label: "In Home" },
              { id: "virtual", label: "Virtual" },
            ],
          },
          {
            id: "focus-area",
            label: "Focus Area",
            type: "single",
            defaultOptionId: "career-growth",
            options: [
              { id: "career-growth", label: "Career Growth" },
              { id: "work-life-balance", label: "Work-Life Balance" },
              { id: "personal-development", label: "Personal Development" },
              { id: "goal-setting", label: "Goal Setting" },
            ],
          },
          {
            id: "duration",
            label: "Duration",
            type: "single",
            defaultOptionId: "60",
            options: [
              { id: "60", label: "60 Minutes" },
              { id: "90", label: "90 Minutes" },
            ],
          },
          {
            id: "package",
            label: "Package",
            type: "single",
            defaultOptionId: "single",
            options: [
              { id: "single", label: "Single Session" },
              { id: "pack-4", label: "4 Session Pack" },
              { id: "pack-8", label: "8 Session Pack" },
            ],
          },
        ],
      },
      {
        type: "testimonials",
        surface: "muted",
        heading: "What clients are saying.",
        subheading: "[Sample] testimonials shown for demonstration purposes",
        items: [
          { id: "life-coaching-1", quote: "I was surprised by how natural it felt to have someone come to my home for this. It was a much easier environment to be honest in.", author: "Raleigh, NC", isSample: true },
          { id: "life-coaching-2", quote: "Having the flexibility to book sessions around my actual schedule made this something I could actually stick to.", author: "Cary, NC", isSample: true },
          { id: "life-coaching-3", quote: "The professional I was matched with genuinely understood what I was trying to work on. The matching process clearly wasn't random.", author: "Wake County, NC", isSample: true },
        ],
      },
      {
        type: "faq",
        viewAll: { label: "View Full FAQ", href: "/faq" },
      },
      {
        type: "cta",
        title: "Guidance designed around your goals.",
        body: "Book your first life coaching session with a vetted independent professional.",
        primaryCta: {
          label: "Book Life Coaching",
          href: "/book?service=life-coaching",
        },
        secondaryCta: { label: "View Pricing", href: "/pricing" },
      },
    ],
  },

  /* ───────────────────────────── Beauty ────────────────────────────── */
  beauty: {
    slug: "beauty",
    hero: {
      variant: "light",
      eyebrow: "In-Home Beauty Services",
      title: "Beauty Services Designed Around Your Schedule",
      subtitle:
        "Professional beauty services delivered to your home by vetted independent professionals — tailored to your style, occasion, and schedule.",
      primaryCta: { label: "Book Now", href: "/book?service=beauty" },
      secondaryCta: { label: "How It Works", href: "#how-it-works" },
      trustIndicators: [
        "Vetted Professionals",
        "Coordinator Supported",
        "$75 Minimum",
      ],
      image: {
        gradient: true,
        caption: {
          title: "Lifestyle image",
          lines: [
            "In-home beauty session · natural light",
            "Professional + client · real home",
          ],
        },
      },
    },
    sections: [
      {
        type: "cards",
        variant: "stacked",
        heading: "Choose Your Beauty Experience",
        subheading:
          "Six premium service categories — mix and match to meet the $75 minimum or create a full luxury session.",
        columns: 3,
        items: [
          {
            icon: "Scissors",
            badge: "Trending",
            title: "Hair Styling",
            description:
              "Expert styling for any occasion — blowouts, braids, updos, and color touch-ups. Customized to your hair type and preference.",
            href: "/book?service=beauty",
          },
          {
            icon: "Brush",
            badge: "Premium",
            title: "Makeup Application",
            description:
              "Full-face artistry for your skin tone and occasion. From natural everyday looks to full event glamour and bridal artistry.",
            href: "/book?service=beauty",
          },
          {
            icon: "Sparkles",
            badge: "Popular",
            title: "Event Preparation",
            description:
              "Comprehensive styling for special events. Hair and makeup coordinated for a seamless, polished, confidence-building result.",
            href: "/book?service=beauty",
          },
          {
            icon: "Users",
            badge: "Group",
            title: "Group Sessions",
            description:
              "Coordinated beauty sessions for groups. Perfect for bridal parties, milestone celebrations, and pre-event gatherings.",
            href: "/book?service=beauty",
          },
          {
            icon: "RefreshCw",
            badge: "Quick",
            title: "Touch-Up Services",
            description:
              "Focused refresh sessions to maintain a look or prepare for back-to-back events. Quick, precise, and expertly executed.",
            href: "/book?service=beauty",
          },
          {
            icon: "Crown",
            badge: "Exclusive",
            title: "Special Occasions",
            description:
              "Milestone events deserve exceptional care. Wedding day, anniversary, graduation — our coordinators handle every detail.",
            href: "/book?service=beauty",
          },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        surface: "muted",
        heading: "Professional Beauty Without the Commute",
        columns: 4,
        items: [
          {
            icon: "Home",
            title: "Comfort of Home",
            description:
              "Professional-grade beauty services in your space. No salon noise, no waiting rooms — just personalized care.",
          },
          {
            icon: "CalendarDays",
            title: "Flexible Scheduling",
            description:
              "Book around your life. Evenings before events, mornings for photoshoots, weekends for self-care — all available.",
          },
          {
            icon: "Target",
            title: "Personalized Attention",
            description:
              "Every session focuses entirely on you. No rushing between clients — thoughtful service tailored to you.",
          },
          {
            icon: "Gift",
            title: "Event Convenience",
            description:
              "Get ready for your occasion without the stress of travel. Everything arrives at your door, exactly when you need it.",
          },
        ],
      },
      {
        type: "timeline",
        heading: "Simple Booking Process",
        activeIndex: 2,
        steps: [
          {
            title: "Submit Your Request",
            description: "Describe your service needs and preferred timing.",
          },
          {
            title: "Select Services",
            description:
              "Choose specific beauty services to reach the $75 minimum.",
          },
          {
            title: "Coordinator Review",
            description: "Our team reviews and validates your request.",
          },
          {
            title: "Pro Confirmation",
            description: "Your matched professional confirms availability.",
          },
          {
            title: "Service Delivered",
            description:
              "Your professional arrives ready for a premium session.",
          },
        ],
      },
      {
        type: "configurator",
        variant: "interactive",
        cta: { label: "Book Beauty", href: "/book?service=beauty" },
        groups: [
          {
            id: "services",
            label: "Select Services",
            type: "multi",
            options: [
              { id: "hair-styling", label: "Hair Styling" },
              { id: "makeup-application", label: "Makeup Application" },
              { id: "blowout", label: "Blowout" },
              { id: "event-styling", label: "Event Styling" },
            ],
          },
          {
            id: "people",
            label: "Number of People",
            type: "single",
            defaultOptionId: "1",
            options: [
              { id: "1", label: "1" },
              { id: "2", label: "2" },
              { id: "3-plus", label: "3+" },
            ],
          },
          {
            id: "occasion",
            label: "Occasion",
            type: "single",
            defaultOptionId: "everyday",
            options: [
              { id: "everyday", label: "Everyday" },
              { id: "photoshoot", label: "Photoshoot" },
              { id: "wedding-event", label: "Wedding/Event" },
              { id: "other", label: "Other" },
            ],
          },
        ],
      },
      {
        type: "testimonials",
        surface: "muted",
        heading: "What Clients Are Looking For",
        subheading: "[Sample] testimonials — not real client reviews",
        items: [
          {
            id: "beauty-1",
            quote:
              "I had my makeup and hair done at home the morning of my sister's wedding. No rushing to a salon — just calm, beautiful results.",
            author: "Raleigh, NC",
            role: "In-Home Beauty · Event Preparation",
            isSample: true,
          },
          {
            id: "beauty-2",
            quote:
              "The coordinator made everything so easy. I described what I wanted and the professional arrived with exactly the right products and setup.",
            author: "Wake County, NC",
            role: "In-Home Beauty · Makeup Application",
            isSample: true,
          },
          {
            id: "beauty-3",
            quote:
              "I never realized how much more relaxed I feel getting ready at home — honestly better — than any salon I've visited.",
            author: "Cary, NC",
            role: "In-Home Beauty · Hair Styling",
            isSample: true,
          },
        ],
      },
      {
        type: "sessionSteps",
        heading: "What Happens Before Your Appointment?",
        imagePosition: "left",
        image: {
          caption: {
            title: "Lifestyle image",
            lines: [
              "Pre-appointment consultation at home",
              "Natural light · warm residential",
            ],
          },
        },
        items: [
          {
            icon: "MessageSquare",
            title: "Consultation",
            description:
              "Your professional begins with a brief intake — discussing your style goals, skin type, occasion, and any preferences before any service begins.",
          },
          {
            icon: "ClipboardCheck",
            title: "Service Selection",
            description:
              "Together you'll finalize which services will be performed, in what order, and how much time each requires to hit your look.",
          },
          {
            icon: "CalendarDays",
            title: "Scheduling",
            description:
              "Sessions are booked at a time that works for your event, your morning routine, or your self-care calendar — never rushed.",
          },
          {
            icon: "Sparkles",
            title: "Preparation Guidance",
            description:
              "Your professional shares tips on space setup and hair or skin preparation so you're ready when they arrive.",
          },
        ],
      },
      {
        type: "notice",
        icon: "DollarSign",
        heading: "Minimum Booking Requirement — $75",
        body: "Beauty services on the Elevate platform carry a minimum booking value of $75. This ensures our independent professionals are fairly compensated for their time and travel. You can meet this minimum by combining services or selecting premium options within a single session.",
        tag: "Helpful Info",
      },
      {
        type: "cards",
        variant: "centered",
        surface: "inverse",
        heading: "Designed Around Trust",
        columns: 4,
        items: [
          {
            icon: "Handshake",
            title: "Independent Professionals",
            description:
              "All beauty professionals operate independently, bringing their own expertise and curated kits to every session.",
          },
          {
            icon: "Headphones",
            title: "Coordinator Support",
            description:
              "Every request is reviewed by our team before matching — ensuring the right professional for your specific service type.",
          },
          {
            icon: "CalendarCheck",
            title: "Scheduling Transparency",
            description:
              "Your coordinator confirms all details before the appointment, so you always know exactly what to expect and when.",
          },
          {
            icon: "Home",
            title: "In-Home Convenience",
            description:
              "Our professionals are trained to work respectfully, efficiently, and cleanly in home and residential settings.",
          },
        ],
      },
      {
        type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            id: "beauty-minimum",
            question: "What is the $75 minimum booking requirement?",
            answer:
              "The $75 minimum ensures our independent beauty professionals are fairly compensated for their time, preparation, and travel. You can meet it by combining services — for example, pairing a blowout with makeup — or by choosing premium options within a single service.",
          },
          {
            id: "beauty-multiple",
            question: "Can I book multiple beauty services in one session?",
            answer:
              "Yes. Many clients combine services — such as hair styling with makeup application — in a single visit. Your coordinator helps sequence everything so the full session flows smoothly.",
          },
          {
            id: "beauty-prepare",
            question: "What should I prepare before my beauty appointment?",
            answer:
              "Just a clean, well-lit space with access to an outlet and a chair. Your professional brings the products, tools, and setup — you bring the space and your preferences.",
          },
          {
            id: "beauty-vetted",
            question: "How are beauty professionals vetted?",
            answer:
              "Every professional passes a [Sample] identity verification and background check before joining the Elevate marketplace, and each booking is reviewed by a coordinator.",
          },
        ],
        viewAll: { label: "View Full FAQ", href: "/faq" },
      },
      {
        type: "cta",
        eyebrow: "Elevate Health & Wellness",
        title: "Bring Personal Care Home",
        body: "Book a beauty session with a vetted independent professional — coordinator-supported from first request to finished look.",
        primaryCta: { label: "Book Now", href: "/book?service=beauty" },
        secondaryCta: { label: "Explore Services", href: "/services" },
      },
    ],
  },

  /* ─────────────────────── Physical Therapy (Coming Soon) ───────────────────
   * Coming-soon service: no booking flow. The hero + every CTA route to the
   * interest list; "Session Pricing" shows DRAFT tiers; an interest-list form
   * stands in for the configurator. Mirrors the coming-soon treatment used by
   * the services grid and booking service-select card.
   */
  "physical-therapy": {
    slug: "physical-therapy",
    hero: {
      variant: "dark",
      eyebrow: "Coming Soon",
      title: "Physical Therapy, In Your Home",
      subtitle:
        "Expert rehabilitation and movement therapy delivered by licensed physical therapists — no commute, no waiting room.",
      primaryCta: {
        label: "Join Interest List",
        href: "/waitlist?service=physical-therapy",
      },
      secondaryCta: { label: "Learn How It Works", href: "#how-it-works" },
      trustIndicators: [
        "Licensed Therapists",
        "Coordinator Supported",
        "Raleigh & Wake County",
      ],
      image: {
        caption: {
          title: "PT Session Photo Placeholder",
          lines: ["Therapist + client · real home", "Natural light · functional space"],
        },
      },
    },
    sections: [
      {
        type: "processCards",
        heading: "What to Expect",
        subheading:
          "From first contact to your final session — here's the journey.",
        columns: 2,
        steps: [
          {
            icon: "MessageCircle",
            title: "Initial Consultation",
            description:
              "A licensed PT reviews your history, goals, and any physician referrals before your first session.",
          },
          {
            icon: "Home",
            title: "Home Assessment",
            description:
              "Your therapist evaluates your space and sets up a safe, effective treatment environment.",
          },
          {
            icon: "ClipboardCheck",
            title: "Personalized Treatment Plan",
            description:
              "Evidence-based exercises, manual therapy, and mobility work — tailored to your recovery.",
          },
          {
            icon: "TrendingUp",
            title: "Progress Tracking",
            description:
              "Each session builds on the last. Your PT documents progress and adjusts your plan as you improve.",
          },
        ],
      },
      {
        type: "cards",
        variant: "centered",
        surface: "inverse",
        heading: "Why At-Home Physical Therapy?",
        columns: 3,
        items: [
          {
            icon: "Car",
            title: "No Travel, No Waiting",
            description:
              "Your therapist comes to you — fully equipped, on time. No waiting room, no commute after a hard session.",
          },
          {
            icon: "Home",
            title: "Functional Environment",
            description:
              "Treatment in the space where you live and move leads to better, more durable real-world outcomes.",
          },
          {
            icon: "Target",
            title: "1-on-1 Attention",
            description:
              "Every session is dedicated to you — no shared gym time, no divided attention.",
          },
          {
            icon: "CalendarDays",
            title: "Flexible Scheduling",
            description:
              "Early mornings, evenings, weekends — sessions fit your life, not clinic hours.",
          },
          {
            icon: "Shield",
            title: "Private & Comfortable",
            description:
              "Recover in a familiar, low-stress setting designed for your healing.",
          },
          {
            icon: "Headphones",
            title: "Care Coordination",
            description:
              "Your PT can communicate directly with your physician or specialist if needed.",
          },
        ],
      },
      {
        type: "pricingTiers",
        eyebrow: "Service Tiers",
        heading: "Session Pricing",
        subheading:
          "All pricing is draft and shown for planning purposes only. Final rates will be confirmed when service availability opens in your area.",
        draftNote:
          "DRAFT PRICING — Do not use for financial decisions. Availability not yet confirmed for your area.",
        tiers: [
          {
            featured: true,
            badge: "Initial Visit",
            name: "Evaluation Visit",
            price: { amount: 16500, currency: "USD" },
            duration: "60–90 minutes",
            included: [
              "Comprehensive movement & pain assessment",
              "Medical history & goals review",
              "Personalized treatment plan creation",
              "Initial therapeutic exercises",
            ],
            footnote: "Evaluation required before follow-up sessions.",
            cta: {
              label: "Join the Interest List",
              href: "/waitlist?service=physical-therapy",
            },
          },
          {
            badge: "Ongoing Care",
            name: "Follow-Up Visit",
            price: { amount: 13500, currency: "USD" },
            duration: "45–60 minutes",
            included: [
              "Progression of treatment plan",
              "Manual therapy & mobility work",
              "Exercise prescription & coaching",
              "Progress documentation",
            ],
            footnote: "Follow-up sessions are scheduled based on your plan.",
            cta: {
              label: "Join the Interest List",
              href: "/waitlist?service=physical-therapy",
            },
          },
        ],
      },
      {
        type: "comingSoonConfigurator",
        surface: "muted",
        eyebrow: "Plan Your Visit",
        heading: "Build your visit (preview)",
        subheading:
          "Explore the options below — this is an illustrative preview only. Nothing is submitted, and a coordinator confirms final pricing.",
        groups: [
          {
            id: "visit-type",
            label: "Visit Type",
            icon: "ClipboardCheck",
            control: "radio",
            options: [
              { id: "evaluation", label: "Evaluation" },
              { id: "follow-up", label: "Follow-Up" },
            ],
          },
          {
            id: "concern",
            label: "Primary Concern",
            icon: "Activity",
            control: "dropdown",
            options: [
              { id: "back-pain", label: "Back Pain" },
              { id: "neck-pain", label: "Neck Pain" },
              { id: "sports-injury", label: "Sports Injury" },
              { id: "post-surgery", label: "Post-Surgery" },
              { id: "other", label: "Other" },
            ],
          },
        ],
        notes: {
          label: "Notes",
          placeholder: "Anything your therapist should know (optional)",
        },
        tiers: [
          { id: "evaluation", name: "Evaluation", price: { amount: 16500, currency: "USD" } },
          { id: "follow-up", name: "Follow-Up", price: { amount: 13500, currency: "USD" } },
        ],
        footnote: "Coordinator will confirm final pricing.",
      },
      {
        type: "interestList",
        eyebrow: "Interest List",
        heading: "Be First to Know When PT Comes to Raleigh",
        subheading:
          "A coordinator will contact you when service availability opens in Wake County.",
        serviceId: "physical-therapy",
        bullets: [
          { icon: "MapPin", text: "Serving Raleigh & Wake County" },
          { icon: "Handshake", text: "No commitment — interest list only" },
          { icon: "ShieldCheck", text: "Your info is never shared or sold" },
        ],
        submitLabel: "Join the Interest List",
        footnote:
          "By submitting, you agree to be contacted about Physical Therapy availability. This is an INTERNAL DRAFT stub — nothing is sent or stored.",
      },
      {
        type: "testimonials",
        heading: "What Clients Are Saying",
        subheading:
          "Illustrative samples for demonstration purposes — names and stories do not represent real customers.",
        items: [
          {
            id: "pt-1",
            quote:
              "After my ACL surgery, I couldn't imagine getting to a clinic three times a week. Having a PT come to my home made recovery manageable and honestly more effective.",
            author: "M.L.",
            role: "Physical Therapy · ACL Rehabilitation",
            isSample: true,
          },
          {
            id: "pt-2",
            quote:
              "My PT knew exactly how to work around the space I had. She used my stairs, my furniture — real functional training. Nothing like a generic gym routine.",
            author: "G.P.",
            role: "Physical Therapy · Mobility Recovery",
            isSample: true,
          },
          {
            id: "pt-3",
            quote:
              "No waiting rooms, no rushing to park. I'd show up in my own home, focused. That mental shift alone helped me show up better for every session.",
            author: "T.R.",
            role: "Physical Therapy · Chronic Pain",
            isSample: true,
          },
        ],
      },
      {
        type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            id: "pt-referral",
            question: "Do I need a physician referral?",
            answer:
              "Many states allow direct access to physical therapy without a referral. However, some insurance plans may require one. We recommend checking with your provider. A coordinator can assist you when service availability opens.",
          },
          {
            id: "pt-conditions",
            question: "What conditions do at-home PTs treat?",
            answer:
              "Post-surgical rehabilitation, sports injuries, chronic pain, and balance or mobility issues are common examples. The exact scope is confirmed during your evaluation visit.",
          },
          {
            id: "pt-home-prep",
            question: "How is my home prepared for sessions?",
            answer:
              "Very little is needed — just a small, clear space. Your therapist brings the necessary equipment and adapts exercises to what you already have at home.",
          },
          {
            id: "pt-availability",
            question: "When will Physical Therapy be available?",
            answer:
              "We're confirming licensed therapist availability in Raleigh & Wake County. Join the interest list and a coordinator will reach out the moment booking opens.",
          },
          {
            id: "pt-insurance",
            question: "Is this covered by insurance?",
            answer:
              "Coverage varies by plan. This is an INTERNAL DRAFT demo and does not process real bookings, quotes, or insurance claims.",
          },
        ],
        viewAll: { label: "View Full FAQ", href: "/faq" },
      },
      {
        type: "cta",
        eyebrow: "Coming Soon · Raleigh & Wake County",
        title: "Physical Therapy Is Coming Home.",
        body: "Be the first to know when licensed physical therapists are available in your area. No commitment required — just your name and a way to reach you.",
        primaryCta: {
          label: "Join the Interest List",
          href: "/waitlist?service=physical-therapy",
        },
        secondaryCta: { label: "Learn How It Works", href: "#how-it-works" },
      },
    ],
  },

  /* ───────────────────── Speech Therapy (Coming Soon) ──────────────────
   * Coming-soon service: no booking flow. The hero + every CTA route to the
   * in-page interest-list form (#interest-list-heading); "Session Pricing"
   * shows DRAFT tiers; an interest-list form stands in for the configurator.
   * Draft prices mirror the coming-soon tiers in pricing-page.config.ts
   * (Evaluation $175 / Follow-Up $95).
   */
  "speech-therapy": {
    slug: "speech-therapy",
    hero: {
      variant: "dark",
      eyebrow: "Coming Soon",
      title: "In-Home Speech Therapy",
      subtitle:
        "Professional speech therapy services are being prepared for future availability through Elevate.",
      primaryCta: { label: "Join Interest List", href: "#interest-list-heading" },
      secondaryCta: { label: "Learn How It Works", href: "/how-it-works" },
      image: {
        caption: {
          title: "Speech therapy session photo placeholder",
          lines: ["Provider + client · real home", "Natural light · warm residential"],
        },
      },
    },
    sections: [
      {
        type: "cards",
        variant: "stacked",
        heading: "What to Expect",
        subheading:
          "Educational overview only. Not a clinical description of treatment.",
        columns: 4,
        items: [
          {
            icon: "ClipboardCheck",
            title: "Initial Evaluation",
            description:
              "A licensed speech-language pathologist assesses communication, language, and swallowing function in your home environment.",
            footnote: "Educational overview only. Not a clinical promise.",
          },
          {
            icon: "RefreshCw",
            title: "Follow-Up Visits",
            description:
              "Subsequent sessions build on the evaluation findings, working toward individualized goals at a pace that suits the client.",
            footnote: "Session structure subject to individual plan.",
          },
          {
            icon: "HandHelping",
            title: "Personalized Support",
            description:
              "Every plan is developed around the individual — their goals, environment, and comfort — not a one-size-fits-all protocol.",
            footnote: "No treatment outcomes guaranteed.",
          },
          {
            icon: "Home",
            title: "Home-Based Convenience",
            description:
              "Sessions take place in the familiar setting of your home, reducing anxiety and increasing engagement for many clients.",
            footnote: "Home suitability assessed at intake.",
          },
        ],
      },
      {
        type: "cards",
        variant: "stacked",
        surface: "inverse",
        heading: "Why Home-Based Speech Therapy?",
        columns: 4,
        items: [
          {
            icon: "Home",
            title: "Familiar Environment",
            description:
              "Therapy in your own home reduces anxiety and creates a more natural, effective setting for communication work.",
          },
          {
            icon: "Car",
            title: "Reduced Travel",
            description:
              "No driving to a clinic. Your therapist brings everything needed directly to your door.",
          },
          {
            icon: "CalendarDays",
            title: "Flexible Scheduling",
            description:
              "Sessions fit around your life — early mornings, evenings, or weekends available through partner therapists.",
          },
          {
            icon: "Target",
            title: "Personalized Attention",
            description:
              "Full one-on-one time with your therapist, without waiting rooms or shared therapy gym time.",
          },
        ],
      },
      {
        type: "pricingTiers",
        eyebrow: "Service Tiers",
        heading: "Session Pricing",
        subheading:
          "All pricing is draft and shown for planning purposes only. Final rates are confirmed when service availability opens in your area.",
        draftNote:
          "DRAFT PRICING — Do not use for financial decisions. Availability not yet confirmed for your area.",
        tiers: [
          {
            featured: true,
            badge: "Initial Session",
            name: "Evaluation Visit",
            price: { amount: 17500, currency: "USD" },
            duration: "60–90 minutes",
            included: [
              "Comprehensive communication assessment",
              "Medical & developmental history review",
              "Individualized goals framework",
              "Initial home-environment consultation",
            ],
            footnote: "Evaluation required before follow-up sessions.",
            cta: { label: "Join the Interest List", href: "#interest-list-heading" },
          },
          {
            badge: "Ongoing Sessions",
            name: "Follow-Up Visit",
            price: { amount: 9500, currency: "USD" },
            duration: "45–60 minutes",
            included: [
              "Structured session based on evaluation plan",
              "Communication and language exercises",
              "Caregiver coaching and guidance",
              "Progress documentation",
            ],
            footnote: "Follow-up frequency based on individual plan.",
            cta: { label: "Join the Interest List", href: "#interest-list-heading" },
          },
        ],
      },
      {
        type: "comingSoonConfigurator",
        surface: "muted",
        eyebrow: "Plan Your Visit",
        heading: "Build your visit (preview)",
        subheading:
          "Explore the options below — this is an illustrative preview only. Nothing is submitted, and a coordinator confirms final pricing.",
        groups: [
          {
            id: "visit-type",
            label: "Visit Type",
            icon: "ClipboardCheck",
            control: "radio",
            options: [
              { id: "evaluation", label: "Evaluation" },
              { id: "follow-up", label: "Follow-Up" },
            ],
          },
          {
            id: "age-group",
            label: "Age Group",
            icon: "Users",
            control: "radio",
            options: [
              { id: "child", label: "Child" },
              { id: "adult", label: "Adult" },
            ],
          },
          {
            id: "area-of-support",
            label: "Area of Support",
            icon: "MessageCircle",
            control: "radio",
            options: [
              { id: "speech-clarity", label: "Speech Clarity" },
              { id: "language-development", label: "Language Development" },
              { id: "communication-skills", label: "Communication Skills" },
              { id: "other", label: "Other" },
            ],
          },
        ],
        notes: {
          label: "Notes",
          placeholder: "Anything your provider should know (optional)",
        },
        tiers: [
          { id: "evaluation", name: "Evaluation", price: { amount: 17500, currency: "USD" } },
          { id: "follow-up", name: "Follow-Up", price: { amount: 9500, currency: "USD" } },
        ],
        footnote: "Coordinator will confirm final pricing.",
      },
      {
        type: "interestList",
        eyebrow: "Interest List",
        heading: "Be First to Know When Speech Therapy Launches",
        subheading:
          "A coordinator will contact you when service availability opens in Wake County.",
        serviceId: "speech-therapy",
        bullets: [
          { icon: "MapPin", text: "Serving Raleigh & Wake County" },
          { icon: "Handshake", text: "No commitment — interest list only" },
          { icon: "ShieldCheck", text: "Your info is never shared or sold" },
        ],
        submitLabel: "Join the Interest List",
        footnote:
          "By submitting, you agree to be contacted about Speech Therapy availability. This is an INTERNAL DRAFT stub — nothing is sent or stored.",
      },
      {
        type: "testimonials",
        surface: "inverse",
        heading: "What Clients Are Saying",
        subheading:
          "Illustrative samples for demonstration purposes — names and stories do not represent real customers.",
        items: [
          {
            id: "speech-1",
            quote:
              "I was nervous about having someone come to our home for my son's sessions, but it made such a difference. He was relaxed, engaged, and the sessions felt natural.",
            author: "A.M.",
            role: "Speech Therapy · Pediatric Language",
            isSample: true,
          },
          {
            id: "speech-2",
            quote:
              "After my stroke, getting to a clinic three times a week wasn't realistic. Having therapy in my own environment was a game-changer.",
            author: "R.T.",
            role: "Speech Therapy · Post-Stroke Recovery",
            isSample: true,
          },
          {
            id: "speech-3",
            quote:
              "The convenience alone made it worth it, but the personalized pace was what really helped. My therapist knew exactly what I needed in each session.",
            author: "S.K.",
            role: "Speech Therapy · Adult Communication",
            isSample: true,
          },
        ],
      },
      {
        type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            id: "speech-launch",
            question: "When will Speech Therapy launch?",
            answer:
              "Speech Therapy is currently in the interest phase for Raleigh and Wake County. Join the interest list to be among the first notified when availability opens. We do not have a confirmed launch date at this time.",
          },
          {
            id: "speech-pricing",
            question: "How does pricing work?",
            answer:
              "Pricing shown is for planning purposes only and is marked DRAFT. A care coordinator reviews and confirms final pricing individually — there is no live pricing calculator for this service yet.",
          },
          {
            id: "speech-after-list",
            question: "What happens after joining the list?",
            answer:
              "You'll receive an update when Speech Therapy becomes available in your area, and a coordinator may reach out to confirm your needs. Joining creates no commitment.",
          },
          {
            id: "speech-coordinator",
            question: "Will a coordinator contact me?",
            answer:
              "Yes — when availability opens, a coordinator would follow up to confirm your needs and next steps. This is an INTERNAL DRAFT demo and does not send real messages.",
          },
        ],
        viewAll: { label: "View Full FAQ", href: "/faq" },
      },
      {
        type: "cta",
        eyebrow: "Coming Soon · Raleigh & Wake County",
        title: "Be the first to know when Speech Therapy launches.",
        body: "Professional speech therapy services are coming to Raleigh and Wake County. Join the interest list to be contacted when availability opens near you.",
        primaryCta: { label: "Join the Interest List", href: "#interest-list-heading" },
        secondaryCta: { label: "Learn How It Works", href: "/how-it-works" },
      },
    ],
  },
};
