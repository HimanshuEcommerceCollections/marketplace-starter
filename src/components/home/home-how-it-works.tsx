"use client";

import { Container } from "@/components/layout/container";
import { useGsap } from "@/lib/anim/use-gsap";
import type { HowItWorksStep } from "@/lib/brand/types";

export interface HomeHowItWorksProps {
  heading: string;
  subheading?: string;
  steps: HowItWorksStep[];
}

export function HomeHowItWorks({ heading, subheading, steps }: HomeHowItWorksProps) {
  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".home-step"), {
      scrollTrigger: { trigger: scope.querySelector(".home-how-grid"), start: "top 82%" },
      y: 40,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.14,
      ease: "power2.out",
    });
  }, []);

  return (
    <section ref={scope} className="border-y border-border py-20 md:py-28">
      <Container>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-highlight">
          The process
        </p>
        <h2 className="font-display text-3xl font-normal tracking-tight text-foreground md:text-5xl">
          {heading}
        </h2>
        {subheading ? (
          <p className="mt-3 max-w-xl text-base text-muted-foreground">{subheading}</p>
        ) : null}

        <ol className="home-how-grid mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="home-step group">
              <div className="font-display text-7xl leading-none tracking-tight text-border transition-colors duration-500 group-hover:text-highlight">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                <span className="sr-only">{`Step ${i + 1}: `}</span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
