import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/brand/types";

/** A meta line beneath the hero subtitle, e.g. { label: "Last Updated", value: "TBD" }. */
export interface PageHeroMeta {
  label: string;
  value: string;
}

export interface PageHeroProps {
  /** Surface treatment: "brand" = sage band, "dark" = espresso, "light" = warm. */
  variant?: "brand" | "dark" | "light";
  /** Breadcrumb trail rendered above the eyebrow, e.g. Home › Terms. */
  breadcrumb?: NavItem[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: NavItem;
  secondaryCta?: NavItem;
  /** Render a short accent rule beneath the subtitle (e.g. legal pages). */
  divider?: boolean;
  /** Meta lines beneath the subtitle, e.g. Last Updated / Effective Date. */
  meta?: PageHeroMeta[];
  /** Full-width callout rendered below the hero column (e.g. a NoticeCallout). */
  notice?: ReactNode;
}

const STYLES = {
  brand: {
    section: "bg-surface-brand text-surface-brand-foreground",
    subtitle: "text-surface-brand-foreground/85",
    eyebrow: "bg-surface-brand-foreground/10 text-surface-brand-foreground",
    ringOffset: "focus-visible:ring-offset-surface-brand",
    primaryBtn: "bg-highlight text-highlight-foreground hover:bg-highlight/90",
    outlineBtn:
      "border-surface-brand-foreground/40 bg-transparent text-surface-brand-foreground hover:bg-surface-brand-foreground/10 hover:text-surface-brand-foreground",
  },
  dark: {
    section: "bg-surface-inverse text-surface-inverse-foreground",
    subtitle: "text-surface-inverse-foreground/80",
    eyebrow: "bg-highlight/15 text-highlight",
    ringOffset: "focus-visible:ring-offset-surface-inverse",
    primaryBtn: "bg-highlight text-highlight-foreground hover:bg-highlight/90",
    outlineBtn:
      "border-surface-inverse-foreground/40 bg-transparent text-surface-inverse-foreground hover:bg-surface-inverse-foreground/10 hover:text-surface-inverse-foreground",
  },
  light: {
    section: "bg-secondary/30 text-foreground",
    subtitle: "text-muted-foreground",
    eyebrow: "bg-muted text-muted-foreground",
    ringOffset: "focus-visible:ring-offset-background",
    primaryBtn: "",
    outlineBtn: "",
  },
} as const;

/**
 * Centered page hero — eyebrow + title + subtitle + optional accent rule, meta
 * lines, up to two CTAs, and a full-width notice callout, on a full-width
 * surface band. Server component, token-only. Use for content pages (FAQ,
 * legal, etc.) that don't need the two-column image hero of ServiceLandingHero.
 */
export function PageHero({
  variant = "brand",
  breadcrumb,
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  divider,
  meta,
  notice,
}: PageHeroProps) {
  const s = STYLES[variant];

  return (
    <section
      aria-labelledby="page-hero-heading"
      className={cn("relative", s.section)}
    >
      <Container className="py-16 text-center md:py-20 lg:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          {breadcrumb && breadcrumb.length > 0 ? (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center justify-center gap-2 text-sm">
                {breadcrumb.map((crumb, i) => {
                  const isLast = i === breadcrumb.length - 1;
                  return (
                    <li
                      key={crumb.label}
                      className="inline-flex items-center gap-2"
                    >
                      {i > 0 ? (
                        <ChevronRight
                          aria-hidden
                          className={cn("size-3.5 opacity-50", s.subtitle)}
                        />
                      ) : null}
                      {isLast ? (
                        <span aria-current="page" className="font-medium">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className={cn(
                            "rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            s.subtitle,
                          )}
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : null}
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
            id="page-hero-heading"
            className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          {subtitle ? (
            <p className={cn("text-lg leading-relaxed", s.subtitle)}>
              {subtitle}
            </p>
          ) : null}

          {divider ? (
            <span aria-hidden className="h-0.5 w-12 rounded-full bg-highlight" />
          ) : null}

          {meta && meta.length > 0 ? (
            <dl className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
              {meta.map((item, i) => (
                <Fragment key={item.label}>
                  {i > 0 ? (
                    <span aria-hidden className={cn("opacity-50", s.subtitle)}>
                      •
                    </span>
                  ) : null}
                  <div className="inline-flex items-center gap-1">
                    <dt className={s.subtitle}>{item.label}:</dt>
                    <dd className="font-medium">{item.value}</dd>
                  </div>
                </Fragment>
              ))}
            </dl>
          ) : null}

          {primaryCta || secondaryCta ? (
            <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {primaryCta ? (
                <Button
                  asChild
                  size="lg"
                  className={cn("w-full sm:w-auto", s.ringOffset, s.primaryBtn)}
                >
                  <Link href={primaryCta.href}>{primaryCta.label}</Link>
                </Button>
              ) : null}
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
          ) : null}
        </div>

        {notice ? <div className="mt-10 text-left">{notice}</div> : null}
      </Container>
    </section>
  );
}
