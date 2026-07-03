import Link from "next/link";
import { Container } from "@/components/layout/container";
import { getBrandConfig } from "@/lib/brand/load";

/**
 * Dedicated booking-flow header: brand lockup + "Book a Service". Server
 * component, token-only. Replaces the site navbar on /book.
 */
export function BookingHeader() {
  const config = getBrandConfig();

  return (
    <header>
      <div className="border-b border-border bg-background">
        <Container
          size="xl"
          className="flex h-16 items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              aria-hidden
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
            >
              {config.shortName.charAt(0)}
            </span>
            <span className="font-heading text-base font-semibold uppercase tracking-wide text-foreground">
              {config.shortName}
            </span>
          </Link>
          <span className="hidden text-sm font-medium text-muted-foreground sm:block">
            Book a Service
          </span>
        </Container>
      </div>
    </header>
  );
}
