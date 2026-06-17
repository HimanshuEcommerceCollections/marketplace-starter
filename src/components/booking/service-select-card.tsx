import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ServiceSelectItem {
  slug: string;
  title: string;
  icon?: string;
  /** Pre-formatted, e.g. "From $109" (null hides the price line). */
  priceLabel: string | null;
  status: "active" | "coming-soon";
}

export interface ServiceSelectCardProps {
  item: ServiceSelectItem;
  selected: boolean;
  onSelect: () => void;
}

/**
 * A single selectable service card. Token-only, equal-height.
 * - active: dark icon, price + DRAFT, Select / Selected button.
 * - coming-soon: muted, "Coming Soon" badge, "Join Interest List" link, not selectable.
 */
export function ServiceSelectCard({
  item,
  selected,
  onSelect,
}: ServiceSelectCardProps) {
  const Icon = getIcon(item.icon);
  const comingSoon = item.status === "coming-soon";

  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-3 rounded-xl p-5 transition",
        comingSoon
          ? "border-transparent bg-muted"
          : selected
            ? "border-highlight bg-highlight/5 ring-1 ring-highlight"
            : "hover:border-primary/40 hover:shadow-md",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-full",
            comingSoon
              ? "bg-muted-foreground/15 text-muted-foreground"
              : selected
                ? "bg-highlight text-highlight-foreground"
                : "bg-surface-inverse text-surface-inverse-foreground",
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>

        {comingSoon ? (
          <Badge className="border-transparent bg-surface-inverse text-surface-inverse-foreground">
            Coming Soon
          </Badge>
        ) : selected ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-highlight/10 px-2 py-0.5 text-xs font-medium text-highlight">
            <Check className="size-3" aria-hidden />
            Selected
          </span>
        ) : null}
      </div>

      <h3
        className={cn(
          "font-heading text-lg font-semibold",
          comingSoon ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {item.title}
      </h3>

      {item.priceLabel ? (
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <span className="whitespace-nowrap">
            <span className="text-muted-foreground">From </span>
            <span
              className={cn(
                "font-semibold",
                comingSoon ? "text-muted-foreground" : "text-highlight",
              )}
            >
              {item.priceLabel.replace(/^From /, "")}
            </span>
          </span>
          <Badge variant="secondary" className="uppercase tracking-wide">
            Draft
          </Badge>
        </p>
      ) : null}

      <div className="mt-auto pt-1">
        {comingSoon ? (
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/waitlist?service=${item.slug}`}>Join Interest List</Link>
          </Button>
        ) : selected ? (
          <Button
            type="button"
            onClick={onSelect}
            className="w-full bg-highlight text-highlight-foreground hover:bg-highlight/90"
          >
            Selected
            <Check aria-hidden />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSelect}
            className="w-full bg-surface-inverse text-surface-inverse-foreground hover:bg-surface-inverse/90"
          >
            Select
            <ArrowRight aria-hidden />
          </Button>
        )}
      </div>
    </Card>
  );
}
