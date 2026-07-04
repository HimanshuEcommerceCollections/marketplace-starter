import type { CorporatePageConfig } from "@/lib/corporate/page";

/** "Corporate Wellness" page content for the Elevate brand. */
export const elevateCorporate: CorporatePageConfig = {
  hero: {
    variant: "dark",
    eyebrow: "For Teams & Organizations",
    title: "Corporate Wellness, Coordinated Thoughtfully",
    subtitle:
      "Wellness experiences and services tailored to teams, workplaces, and special events throughout Raleigh and Wake County.",
    primaryCta: { label: "Request a Quote", href: "#quote" },
    secondaryCta: { label: "Speak with a Coordinator", href: "#quote" },
    trustIndicators: [
      "Coordinator-Led",
      "Vetted Professionals",
      "Raleigh & Wake County",
    ],
    image: {
      caption: {
        title: "Corporate wellness",
        lines: ["Coordinated for teams · Raleigh & Wake County"],
      },
    },
  },

  offerings: {
    heading: "Corporate Wellness Offerings",
    subheading:
      "Customizable experiences and services designed for teams of any size. All pricing by coordinator quote.",
    note: "All corporate offerings are priced by coordinator quote. No standard pricing applies to corporate programs.",
    items: [
      {
        icon: "HandHelping",
        title: "Chair Massage Events",
        description:
          "Vetted massage professionals set up at your workplace for scheduled employee sessions. Ideal for office wellness days or team appreciation events.",
        badge: "Most Requested",
        cta: { label: "Inquire about this", href: "#quote" },
      },
      {
        icon: "Flower2",
        title: "Wellness Workshops",
        description:
          "Guided group sessions covering yoga, mindfulness, breathwork, or movement — tailored to your team's goals and fitness levels.",
        cta: { label: "Inquire about this", href: "#quote" },
      },
      {
        icon: "Users",
        title: "Team Wellness Experiences",
        description:
          "Customized multi-service wellness experiences for team offsites, retreats, or special occasions. Coordinator-planned from start to finish.",
        cta: { label: "Inquire about this", href: "#quote" },
      },
      {
        icon: "Package",
        title: "Custom Wellness Programs",
        description:
          "Recurring wellness initiatives tailored to your organization's calendar, headcount, and program goals. Inquire for details.",
        badge: "Custom Quote",
        cta: { label: "Inquire about this", href: "#quote" },
      },
    ],
  },

  whoItsFor: {
    heading: "Who It's For",
    subheading:
      "Corporate wellness inquiries are welcome from organizations of all sizes and industries.",
    items: [
      {
        icon: "Users",
        title: "Small Teams",
        description:
          "5–20 person teams looking to add wellness to a team day, lunch event, or appreciation moment.",
      },
      {
        icon: "TrendingUp",
        title: "Growing Companies",
        description:
          "Mid-size organizations building workplace wellness programs as part of their people operations strategy.",
      },
      {
        icon: "CalendarCheck",
        title: "Employee Events",
        description:
          "HR and People Ops teams planning company-wide wellness activities, health fairs, or seasonal events.",
      },
      {
        icon: "Compass",
        title: "Leadership Retreats",
        description:
          "Executive and leadership teams incorporating wellness into off-site retreats, planning sessions, or team travel.",
      },
    ],
  },

  process: {
    heading: "How the Process Works",
    subheading:
      "Five steps from inquiry to coordinated event. No automated systems — human support throughout.",
    note: "This is a B2B inquiry process — not the standard consumer booking flow. All corporate requests are coordinator-reviewed.",
    steps: [
      {
        title: "Submit Inquiry",
        description:
          "Complete the corporate inquiry form with your event details, headcount, and preferred dates.",
      },
      {
        title: "Coordinator Review",
        description:
          "A coordinator reviews your inquiry and prepares for an initial conversation within one business day.",
      },
      {
        title: "Discovery Call",
        description:
          "The coordinator connects with you to understand your goals, preferences, and any specific requirements.",
      },
      {
        title: "Proposal & Quote",
        description:
          "You receive a tailored proposal with program options and a coordinator-reviewed quote for your event.",
      },
      {
        title: "Event Coordination",
        description:
          "Once confirmed, the coordinator manages scheduling, logistics, and day-of execution.",
      },
    ],
  },

  whyWorkWith: {
    heading: "Why Work with Elevate",
    subheading:
      "A coordinated, human-supported approach to corporate wellness — not a platform or directory.",
    items: [
      {
        icon: "Headphones",
        title: "Coordinator Support",
        description:
          "A dedicated coordinator manages your corporate inquiry from initial contact through event completion.",
      },
      {
        icon: "CalendarDays",
        title: "Flexible Planning",
        description:
          "Corporate events are planned around your schedule, headcount, and venue — not a fixed calendar.",
      },
      {
        icon: "BadgeCheck",
        title: "Trusted Professionals",
        description:
          "Every professional is identity-verified and background-checked before marketplace activation.",
      },
      {
        icon: "MapPin",
        title: "Local Service Coverage",
        description:
          "Elevate serves Raleigh and Wake County — your event stays local with professionals who know the area.",
      },
    ],
  },

  quote: {
    heading: "Request a Corporate Quote",
    subheading:
      "Tell us about your team and event goals. A coordinator will follow up to discuss your options.",
    eventTypes: [
      "Chair Massage Event",
      "Wellness Workshop",
      "Team Wellness Experience",
      "Custom Wellness Program",
      "Not sure yet",
    ],
  },

  testimonials: {
    heading: "What Organizations Say",
    subheading:
      "Feedback from teams and organizations who have worked with Elevate.",
    items: [
      {
        id: "corp-1",
        quote:
          "The coordinator made the entire process seamless. From first contact to the day of our team wellness event, every detail was handled professionally.",
        author: "Director of People Operations",
        role: "Sample Company",
      },
      {
        id: "corp-2",
        quote:
          "We had 40 team members participate in chair massages during our annual offsite. The coordination was flawless and the professionals were excellent.",
        author: "HR Manager",
        role: "Sample Company",
      },
      {
        id: "corp-3",
        quote:
          "Elevate was the right choice for our leadership retreat. The coordinator understood our goals and delivered a tailored wellness experience.",
        author: "Executive Assistant to CEO",
        role: "Sample Company",
      },
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    viewAll: { label: "View FAQ", href: "/faq" },
    items: [
      {
        id: "quoting",
        question: "How does quoting work?",
        answer:
          "After submitting an inquiry, a coordinator will review your request and reach out within one business day. The coordinator will gather more details during a discovery call and provide a tailored proposal and quote.",
      },
      {
        id: "event-types",
        question: "What types of events are supported?",
        answer:
          "Elevate supports chair massage events, wellness workshops, team wellness experiences, and custom programs. Events can be tailored to team size, venue, and organizational goals. Inquire to discuss your specific needs.",
      },
      {
        id: "lead-time",
        question: "How far in advance should we inquire?",
        answer:
          "We recommend submitting an inquiry at least 2–3 weeks before your desired event date. For larger events or complex programs, earlier contact allows more time for planning and professional coordination.",
      },
      {
        id: "coordinator-contact",
        question: "Will a coordinator contact us?",
        answer:
          "Yes. Every corporate inquiry is handled by a coordinator — not an automated system. You will receive a direct follow-up within one business day of submitting your inquiry.",
      },
    ],
  },

  cta: {
    title: "Let's plan something meaningful for your team.",
    body: "Corporate wellness, coordinated thoughtfully. Reach out to get started.",
    primaryCta: { label: "Request a Quote", href: "#quote" },
    secondaryCta: { label: "Speak with a Coordinator", href: "#quote" },
  },
};
