import Link from "next/link";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { Container } from "./container";
import type { FooterColumn } from "@/lib/brand/types";

export interface FooterProps {
  brandName: string;
  /** Full name for the copyright line (e.g. "Elevate Health & Wellness"). */
  fullName?: string;
  columns: FooterColumn[];
  /** Short brand description shown beside the columns. */
  blurb?: string;
  /** Oversized closing line; `accent` renders as the italic second line. */
  tagline?: { lead: string; accent?: string };
}

const SOCIALS = [
  { label: "Instagram", Icon: Instagram },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Facebook", Icon: Facebook },
];

/** Site footer (dark, editorial): closing line → columns → bottom bar. */
export function Footer({
  brandName,
  fullName,
  columns,
  blurb,
  tagline,
}: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-inverse text-surface-inverse-foreground">
      {tagline ? (
        <div className="border-b border-surface-inverse-foreground/10 px-6 py-14 text-center md:py-16">
          <p className="mx-auto max-w-3xl font-heading text-2xl leading-snug tracking-tight text-surface-inverse-foreground/20 md:text-3xl">
            {tagline.lead}
            {tagline.accent ? (
              <>
                <br />
                <em className="text-highlight/80">{tagline.accent}</em>
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      <Container className="py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2">
            <p className="font-heading text-xl font-semibold text-surface-inverse-foreground/85">
              {brandName}
            </p>
            {blurb ? (
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-surface-inverse-foreground/45">
                {blurb}
              </p>
            ) : null}
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-surface-inverse-foreground/40">
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.heading}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-inverse-foreground/55 transition-colors hover:text-highlight"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-surface-inverse-foreground/10">
        <Container className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-surface-inverse-foreground/50">
            © {year} {fullName ?? brandName}. All rights reserved.
          </p>
          <ul className="flex gap-3">
            {SOCIALS.map(({ label, Icon }) => (
              <li key={label}>
                <Link
                  href="#"
                  aria-label={label}
                  className="inline-flex rounded-md p-1 text-surface-inverse-foreground/45 transition-colors hover:text-highlight"
                >
                  <Icon className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
