import Link from "next/link";
import { Check } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/shared/sample-badge";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/brand/types";

export interface PricingFeature {
  label: string;
  included: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  priceLabel: string;
  period?: string;
  description?: string;
  features: PricingFeature[];
  highlighted?: boolean;
  cta: NavItem;
}

export function PricingTierCard({ tier }: { tier: PricingTier }) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col",
        tier.highlighted && "ring-2 ring-primary",
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{tier.name}</CardTitle>
          {tier.highlighted ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              Popular
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold">{tier.priceLabel}</span>
          {tier.period ? (
            <span className="text-sm text-muted-foreground">
              /{tier.period}
            </span>
          ) : null}
        </div>
        <SampleBadge className="mt-2 w-fit" />
        {tier.description ? (
          <CardDescription className="mt-2">
            {tier.description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {tier.features.map((f) => (
            <li
              key={f.label}
              className={cn(
                "flex items-start gap-2 text-sm",
                !f.included && "text-muted-foreground line-through",
              )}
            >
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {f.label}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full"
          variant={tier.highlighted ? "default" : "outline"}
        >
          <Link href={tier.cta.href}>{tier.cta.label}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
