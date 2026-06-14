import Link from "next/link";
import { Container } from "./container";
import { NavbarMobile } from "./navbar-mobile";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/lib/brand/types";

export interface NavbarProps {
  brandName: string;
  links: NavItem[];
  cta?: NavItem;
}

/** Server-rendered top nav. The mobile drawer is a client leaf. */
export function Navbar({ brandName, links, cta }: NavbarProps) {
  return (
    <header className="z-sticky sticky top-0 border-b border-border bg-background/80 backdrop-blur">
      <Container as="nav" aria-label="Primary" className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-md text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {brandName}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {cta ? (
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
          <NavbarMobile links={links} cta={cta} />
        </div>
      </Container>
    </header>
  );
}
