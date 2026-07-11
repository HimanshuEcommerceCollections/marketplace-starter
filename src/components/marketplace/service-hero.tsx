import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";
import type { Service } from "@/lib/catalog/types";

export function ServiceHero({ service }: { service: Service }) {
  return (
    <section className="border-b border-border bg-secondary/30">
      <Container className="flex flex-col items-center py-10 text-center md:py-14">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link href="/services" className="hover:text-foreground">
            Services
          </Link>
          <span aria-hidden> / </span>
          <span className="text-foreground">{service.title}</span>
        </nav>
        <Badge variant="secondary">{service.category}</Badge>
        <h1 className="mt-3 font-display text-4xl font-normal tracking-tight md:text-5xl">
          {service.title}
        </h1>
        <p className="mt-3 max-w-prose text-muted-foreground">
          {service.summary}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href={`/book?service=${service.id}`}>Book now</Link>
          </Button>
          {service.from_price != null ? (
            <p className="text-sm">
              <span className="text-muted-foreground">From </span>
              <span className="text-lg font-semibold">
                {formatMoney({
                  amount: service.from_price,
                  currency: service.currency,
                })}
              </span>
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
