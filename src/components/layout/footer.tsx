import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Container } from "./container";
import type { FooterColumn, NavItem } from "@/lib/brand/types";

export interface FooterProps {
  brandName: string;
  tagline?: string;
  columns: FooterColumn[];
  legalLinks: NavItem[];
}

const SOCIALS = [
  { label: "Instagram", Icon: Instagram },
  { label: "Facebook", Icon: Facebook },
  { label: "LinkedIn", Icon: Linkedin },
];

/** Site footer (dark). RULE: MUST render the literal string "INTERNAL DRAFT". */
export function Footer({ brandName, tagline, columns, legalLinks }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-inverse text-surface-inverse-foreground">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-heading text-lg font-semibold">{brandName}</p>
            {tagline ? (
              <p className="mt-2 text-sm text-surface-inverse-foreground/70">
                {tagline}
              </p>
            ) : null}
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="text-sm font-semibold">{col.heading}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={`${col.heading}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-inverse-foreground/70 transition-colors hover:text-surface-inverse-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="my-8 border-t border-surface-inverse-foreground/15" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs text-surface-inverse-foreground/70">
              © {year} {brandName}
            </p>
            <ul className="flex flex-wrap gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-surface-inverse-foreground/70 transition-colors hover:text-surface-inverse-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex gap-3">
            {SOCIALS.map(({ label, Icon }) => (
              <li key={label}>
                <Link
                  href="#"
                  aria-label={label}
                  className="inline-flex rounded-md p-1 text-surface-inverse-foreground/70 transition-colors hover:text-surface-inverse-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="size-4" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p
          data-testid="internal-draft"
          className="mt-6 text-center text-xs font-semibold uppercase tracking-widest text-surface-inverse-foreground/60"
        >
          INTERNAL DRAFT
        </p>
      </Container>
    </footer>
  );
}
