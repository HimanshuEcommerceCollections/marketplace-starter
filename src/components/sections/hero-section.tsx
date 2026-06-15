import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { NavItem } from "@/lib/brand/types";

export interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
  trustIndicators?: string[];
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: { title: string; lines: string[] };
}

export function HeroSection({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  trustIndicators = [],
  imageSrc,
  imageAlt = "",
  imageCaption,
}: HeroSectionProps) {
  const showImage = !!imageSrc && !imageSrc.toLowerCase().endsWith(".svg");

  return (
    <section aria-labelledby="hero-heading" className="py-16 md:py-20 lg:py-28">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            <h1
              id="hero-heading"
              className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            {secondaryCta ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative order-1 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm lg:order-2">
          <AspectRatio ratio={4 / 3}>
            {showImage ? (
              <Image
                src={imageSrc!}
                alt={imageAlt}
                fill
                priority
                sizes="(min-width: 48rem) 50vw, 100vw"
                className="object-cover"
              />
            ) : imageCaption ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {imageCaption.title}
                </p>
                {imageCaption.lines.map((line) => (
                  <p key={line} className="text-sm text-muted-foreground">
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
