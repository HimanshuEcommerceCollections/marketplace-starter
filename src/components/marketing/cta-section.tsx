import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/brand/types";

export interface CtaSectionProps {
  title: string;
  body?: string;
  cta: NavItem;
  variant?: "solid" | "subtle";
}

export function CtaSection({
  title,
  body,
  cta,
  variant = "solid",
}: CtaSectionProps) {
  const solid = variant === "solid";
  return (
    <section aria-labelledby="cta-heading" className="py-12 md:py-16">
      <Container>
        <div
          className={cn(
            "rounded-2xl px-6 py-12 text-center md:px-12",
            solid
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-secondary/40",
          )}
        >
          <h2 id="cta-heading" className="text-2xl font-bold md:text-3xl">
            {title}
          </h2>
          {body ? (
            <p
              className={cn(
                "mx-auto mt-3 max-w-prose",
                solid ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {body}
            </p>
          ) : null}
          <div className="mt-6">
            <Button asChild size="lg" variant={solid ? "secondary" : "default"}>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
