import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/brand/types";

export interface ServiceLandingHeroProps {
  /** "dark" = inverse/espresso surface; "light" = warm default surface. */
  variant?: "dark" | "light";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Pre-formatted, e.g. "From $109.00". */
  priceLabel?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
  trustIndicators?: string[];
  image?: {
    src?: string;
    alt?: string;
    caption?: { title: string; lines: string[] };
    gradient?: boolean;
  };
}

const STYLES = {
  dark: {
    section: "bg-surface-inverse text-surface-inverse-foreground",
    subtitle: "text-surface-inverse-foreground/80",
    eyebrow: "bg-highlight/15 text-highlight",
    ringOffset: "focus-visible:ring-offset-surface-inverse",
    primaryBtn:
      "bg-highlight text-highlight-foreground hover:bg-highlight/90",
    outlineBtn:
      "border-surface-inverse-foreground/40 bg-transparent text-surface-inverse-foreground hover:bg-surface-inverse-foreground/10 hover:text-surface-inverse-foreground",
    trustPill:
      "border-surface-inverse-foreground/20 bg-surface-inverse-foreground/5 text-surface-inverse-foreground/90",
    imageFrame:
      "border-surface-inverse-foreground/15 bg-surface-inverse-foreground/5",
    captionTitle: "text-surface-inverse-foreground/70",
    captionLine: "text-surface-inverse-foreground/60",
  },
  light: {
    section: "bg-secondary/30 text-foreground",
    subtitle: "text-muted-foreground",
    eyebrow: "bg-muted text-muted-foreground",
    ringOffset: "focus-visible:ring-offset-background",
    primaryBtn: "",
    outlineBtn: "",
    trustPill: "border-border bg-card text-muted-foreground",
    imageFrame: "border-border bg-muted",
    captionTitle: "text-muted-foreground",
    captionLine: "text-muted-foreground/80",
  },
} as const;

/**
 * Service landing hero. Server component, token-only.
 * Desktop: copy left, image right · Mobile/tablet: copy first, image below.
 */
export function ServiceLandingHero({
  variant = "dark",
  eyebrow,
  title,
  subtitle,
  priceLabel,
  primaryCta,
  secondaryCta,
  trustIndicators = [],
  image,
}: ServiceLandingHeroProps) {
  const s = STYLES[variant];
  const showImage = !!image?.src && !image.src.toLowerCase().endsWith(".svg");
  const caption = image?.caption;

  return (
    <section
      aria-labelledby="service-hero-heading"
      className={cn("relative", s.section)}
    >
      <Container className="grid grid-cols-1 items-center gap-10 py-16 md:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <span
                className={cn(
                  "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest",
                  s.eyebrow,
                )}
              >
                {eyebrow}
              </span>
            ) : null}
            <h1
              id="service-hero-heading"
              className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl"
            >
              {title}
            </h1>
            {subtitle ? (
              <p className={cn("max-w-prose text-lg leading-relaxed", s.subtitle)}>
                {subtitle}
              </p>
            ) : null}
          </div>

          {priceLabel ? (
            <p className="flex flex-wrap items-center gap-3">
              <span className="font-heading text-2xl font-semibold text-highlight md:text-3xl">
                {priceLabel}
              </span>
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className={cn("w-full sm:w-auto", s.ringOffset, s.primaryBtn)}
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            {secondaryCta ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className={cn("w-full sm:w-auto", s.ringOffset, s.outlineBtn)}
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>

          {trustIndicators.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {trustIndicators.map((item) => (
                <li
                  key={item}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                    s.trustPill,
                  )}
                >
                  <span
                    aria-hidden
                    className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-highlight text-highlight-foreground"
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border",
            s.imageFrame,
          )}
        >
          <AspectRatio ratio={4 / 3}>
            {image?.gradient ? (
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-primary via-surface-brand to-highlight opacity-90"
              />
            ) : null}
            {showImage ? (
              <Image
                src={image!.src!}
                alt={image?.alt ?? ""}
                fill
                priority
                sizes="(min-width: 64rem) 50vw, 100vw"
                className="object-cover"
              />
            ) : caption ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-6 text-center">
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    image?.gradient ? "text-highlight-foreground/90" : s.captionTitle,
                  )}
                >
                  {caption.title}
                </p>
                {caption.lines.map((line) => (
                  <p
                    key={line}
                    className={cn(
                      "text-sm",
                      image?.gradient
                        ? "text-highlight-foreground/80"
                        : s.captionLine,
                    )}
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : null}
          </AspectRatio>
        </div>
      </Container>
    </section>
  );
}
