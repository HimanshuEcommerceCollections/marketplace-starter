import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/money";
import type { DisplayedPrice } from "@/lib/booking/contract";

export interface PriceSummaryCardProps {
  breakdown: DisplayedPrice;
  ctaSlot?: React.ReactNode;
}

export function PriceSummaryCard({
  breakdown,
  ctaSlot,
}: PriceSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Price summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          {breakdown.line_items.map((li, i) => (
            <div key={`${li.label}-${i}`} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{li.label}</dt>
              <dd>{formatMoney(li.amount)}</dd>
            </div>
          ))}
        </dl>
        <Separator className="my-3" />
        <div className="flex justify-between text-base font-semibold">
          <span>{breakdown.is_estimate ? "Estimated total" : "Total"}</span>
          <span>{formatMoney(breakdown.total)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Pricing {breakdown.pricing_version} · illustrative estimate, not a
          quote.
        </p>
        {ctaSlot ? <div className="mt-4">{ctaSlot}</div> : null}
      </CardContent>
    </Card>
  );
}
