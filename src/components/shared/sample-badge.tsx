import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * THE single source of truth for the [Sample] proof rule. Every testimonial,
 * stat, or illustrative price MUST render this rather than typing the literal,
 * so the rule can never drift.
 */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("uppercase tracking-wide", className)}
      aria-label="Sample content — not a real customer claim or statistic"
    >
      [Sample]
    </Badge>
  );
}
