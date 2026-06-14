import Link from "next/link";
import { Container } from "./container";
import { Separator } from "@/components/ui/separator";
import type { FooterColumn, NavItem } from "@/lib/brand/types";

export interface FooterProps {
  brandName: string;
  columns: FooterColumn[];
  legalLinks: NavItem[];
}

/** Site footer. RULE: MUST render the literal string "INTERNAL DRAFT". */
export function Footer({ brandName, columns, legalLinks }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-muted/30">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-base font-semibold">{brandName}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              A Fable Portfolio marketplace.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="text-sm font-semibold">{col.heading}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            © {year} {brandName}
          </p>
        </div>

        {/* RULE: non-removable internal-draft marker. */}
        <p
          data-testid="internal-draft"
          className="mt-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          INTERNAL DRAFT
        </p>
      </Container>
    </footer>
  );
}
