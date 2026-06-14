import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import type { Service } from "@/lib/catalog/types";

export function ServiceCard({ service }: { service: Service }) {
  const href = `/services/${service.id}`;
  return (
    <Card className="relative flex h-full flex-col">
      <CardHeader className="flex-1">
        <Badge variant="secondary" className="w-fit">
          {service.category}
        </Badge>
        <CardTitle className="mt-2">
          <Link
            href={href}
            className="rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {service.title}
          </Link>
        </CardTitle>
        <CardDescription>{service.summary}</CardDescription>
      </CardHeader>
      <CardFooter className="relative justify-between">
        {service.from_price != null ? (
          <p className="text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-semibold">
              {formatMoney({
                amount: service.from_price,
                currency: service.currency,
              })}
            </span>
          </p>
        ) : (
          <span />
        )}
        <Button asChild size="sm" variant="outline">
          <Link href={href}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
