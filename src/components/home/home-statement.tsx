"use client";

import { Container } from "@/components/layout/container";
import { useGsap } from "@/lib/anim/use-gsap";

export interface HomeStatementProps {
  lead: string;
  emphasis: string;
  sub?: string;
}

export function HomeStatement({ lead, emphasis, sub }: HomeStatementProps) {
  const words = [
    ...lead.split(/\s+/).map((w) => ({ w, em: false })),
    ...emphasis.split(/\s+/).map((w) => ({ w, em: true })),
  ];

  const scope = useGsap<HTMLElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelectorAll(".home-word-inner"), {
      scrollTrigger: { trigger: scope, start: "top 75%" },
      yPercent: 110,
      duration: 0.6,
      stagger: 0.04,
      ease: "power3.out",
    });
    gsap.from(scope.querySelectorAll(".js-statement-sub"), {
      scrollTrigger: { trigger: scope, start: "top 62%" },
      autoAlpha: 0,
      y: 12,
      duration: 0.7,
      ease: "power2.out",
    });
  }, []);

  return (
    <section ref={scope} className="border-b border-border py-24 text-center md:py-32">
      <Container size="md">
        <h2 className="home-statement-title text-foreground">
          {words.map((item, i) => (
            <span key={`${item.w}-${i}`}>
              <span className="home-word">
                <span
                  className={item.em ? "home-word-inner italic text-highlight" : "home-word-inner"}
                >
                  {item.w}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        {sub ? (
          <p className="js-statement-sub mt-5 text-base text-muted-foreground">{sub}</p>
        ) : null}
      </Container>
    </section>
  );
}
