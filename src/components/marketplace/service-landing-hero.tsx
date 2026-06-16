import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { SampleBadge } from "@/components/shared/sample-badge";
import type { NavItem } from "@/lib/brand/types";

export interface ServiceLandingHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Pre-formatted, e.g. "From $109.00". Rendered with a [Sample] badge. */
  priceLabel?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
  trustIndicators?: string[];
  /** Real image when `src` is set; otherwise the caption placeholder shows. */
  image?: {
    src?: string;
    alt?: string;
    caption?: { title: string; lines: string[] };
  };
}

/**
 * Dark, full-bleed service landing hero. Server component, token-only.
 * Desktop: copy left, image right · Mobile/tablet: copy first, image below.
 */
export function ServiceLandingHero({
  eyebrow,
  title,
  subtitle,
  priceLabel,
  primaryCta,
  secondaryCta,
  trustIndicators = [],
  image,
}: ServiceLandingHeroProps) {
  const showImage = !!image?.src && !image.src.toLowerCase().endsWith(".svg");
  const caption = image?.caption;

  return (
    <section
      aria-labelledby="service-hero-heading"
      className="bg-surface-inverse text-surface-inverse-foreground"
    >
      <Container className="grid grid-cols-1 items-center gap-10 py-16 md:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <span className="inline-flex w-fit items-center rounded-full bg-highlight/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-highlight">
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
              <p className="max-w-prose text-lg leading-relaxed text-surface-inverse-foreground/80">
                {subtitle}
              </p>
            ) : null}
          </div>

          {priceLabel ? (
            <p className="flex flex-wrap items-center gap-3">
              <span className="font-heading text-2xl font-semibold text-highlight md:text-3xl">
                {priceLabel}
              </span>
              <SampleBadge className="border-surface-inverse-foreground/30 text-surface-inverse-foreground/80" />
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full bg-highlight text-highlight-foreground hover:bg-highlight/90 focus-visible:ring-offset-surface-inverse sm:w-auto"
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            {secondaryCta ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-surface-inverse-foreground/40 bg-transparent text-surface-inverse-foreground hover:bg-surface-inverse-foreground/10 hover:text-surface-inverse-foreground focus-visible:ring-offset-surface-inverse sm:w-auto"
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-surface-inverse-foreground/20 bg-surface-inverse-foreground/5 px-3 py-1 text-xs font-medium text-surface-inverse-foreground/90"
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

        <div className="relative overflow-hidden rounded-2xl border border-surface-inverse-foreground/15 bg-surface-inverse-foreground/5">
          <AspectRatio ratio={4 / 3}>
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
                <p className="text-xs font-semibold uppercase tracking-wide text-surface-inverse-foreground/70">
                  {caption.title}
                </p>
                {caption.lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm text-surface-inverse-foreground/60"
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
