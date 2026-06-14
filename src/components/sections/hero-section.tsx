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
  const isSvg = imageSrc?.toLowerCase().endsWith(".svg") ?? false;

  return (
    <section aria-labelledby="hero-heading" className="py-16 md:py-20 lg:py-28">
      <Container className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-10 lg:gap-16">
        <div className="flex flex-col gap-6">
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
                  <Check aria-hidden className="size-3.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
          <AspectRatio ratio={4 / 5}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(min-width: 48rem) 50vw, 100vw"
                className="object-cover"
                unoptimized={isSvg}
              />
            ) : null}

            {imageCaption ? (
              <div className="absolute inset-x-0 bottom-0 m-3 rounded-xl border border-border bg-background/80 p-3 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {imageCaption.title}
                </p>
                <div className="mt-1 flex flex-col gap-0.5">
                  {imageCaption.lines.map((line) => (
                    <p key={line} className="text-sm text-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </AspectRatio>
        </div>
      </Container>
    </section>
  );
}
