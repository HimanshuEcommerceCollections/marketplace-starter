import {
  Car,
  Home,
  CalendarDays,
  Sparkles,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";

interface Benefit {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const BENEFITS: Benefit[] = [
  {
    title: "No commute",
    description:
      "Walk from your session directly to your couch. Recovery starts immediately without traffic or travel.",
    Icon: Car,
  },
  {
    title: "Familiar environment",
    description:
      "Recover in your own space with your preferred setup, playlist, and comfort level.",
    Icon: Home,
  },
  {
    title: "Flexible scheduling",
    description:
      "Morning, evening, or weekend availability—your schedule drives the experience.",
    Icon: CalendarDays,
  },
  {
    title: "Personalized experience",
    description:
      "Your preferences are remembered and communicated before every appointment.",
    Icon: Sparkles,
  },
  {
    title: "Vetted professionals",
    description:
      "Background checked and identity verified professionals who meet Elevate standards.",
    Icon: ShieldCheck,
  },
  {
    title: "Coordinator support",
    description:
      "A real person confirms your booking and helps ensure a smooth experience.",
    Icon: Headphones,
  },
];

/**
 * Benefits of In-Home Wellness. Server component, token-only.
 * Desktop: 3x2 · Tablet: 2x3 · Mobile: single column. Equal-height cards.
 */
export function BenefitsSection() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="py-16 md:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2
            id="benefits-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            Why in-home is better
          </h2>
        </div>

        <ul
          role="list"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {BENEFITS.map(({ title, description, Icon }) => (
            <li key={title}>
              <Card className="flex h-full flex-col items-start gap-4 rounded-xl bg-muted p-6 transition hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md">
                <span className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
