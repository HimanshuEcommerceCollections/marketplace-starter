import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface PricingCardProps {
  title: string;
  icon?: string;
  status: "active" | "coming-soon";
  /** Pre-formatted "From $X" for active services. */
  priceLabel?: string;
  minimumBadge?: string;
  minimumNote?: string;
  /** Coming-soon FROM bands, e.g. [{ label: "Follow-Up", value: "From $135" }]. */
  tiers?: { label: string; value: string }[];
  comingSoonNote?: string;
}

/**
 * A single service pricing card. Token-only, equal-height. Always shows a DRAFT
 * badge; coming-soon services show FROM bands instead of a live price.
 */
export function PricingCard({
  title,
  icon,
  status,
  priceLabel,
  minimumBadge,
  minimumNote,
  tiers,
  comingSoonNote,
}: PricingCardProps) {
  const Icon = getIcon(icon);
  const comingSoon = status === "coming-soon";

  return (
    <Card
      className={cn(
        "flex h-full flex-col gap-3 rounded-xl p-5",
        comingSoon && "border-transparent bg-muted",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="uppercase tracking-wide">
          Draft
        </Badge>
        {comingSoon ? (
          <Badge className="border-transparent bg-surface-inverse text-surface-inverse-foreground">
            Coming Soon
          </Badge>
        ) : null}
        {minimumBadge ? (
          <Badge variant="secondary" className="bg-highlight/10 text-highlight">
            {minimumBadge}
          </Badge>
        ) : null}
      </div>

      <span
        aria-hidden
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-full",
          comingSoon
            ? "bg-muted-foreground/15 text-muted-foreground"
            : "bg-surface-inverse text-surface-inverse-foreground",
        )}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>

      <h3
        className={cn(
          "font-heading text-lg font-semibold",
          comingSoon ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {title}
      </h3>

      {comingSoon ? (
        <div className="mt-auto space-y-1.5">
          {tiers?.map((t) => (
            <p key={t.label} className="flex items-baseline justify-between gap-2 text-sm">
              <span className="text-muted-foreground">{t.label}</span>
              <span className="font-semibold text-foreground">{t.value}</span>
            </p>
          ))}
          {comingSoonNote ? (
            <p className="pt-1 text-xs text-muted-foreground">{comingSoonNote}</p>
          ) : null}
        </div>
      ) : (
        <div className="mt-auto">
          {priceLabel ? (
            <p className="font-heading text-xl font-semibold text-highlight">
              {priceLabel}
            </p>
          ) : null}
          {minimumNote ? (
            <p className="mt-1 text-xs font-medium text-highlight">
              {minimumNote}
            </p>
          ) : null}
        </div>
      )}
    </Card>
  );
}
