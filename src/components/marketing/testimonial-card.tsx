import { Card, CardContent } from "@/components/ui/card";
import { SampleBadge } from "@/components/shared/sample-badge";
import type { TestimonialItem } from "@/lib/brand/types";

/** RULE: every testimonial card renders a [Sample] badge. */
export function TestimonialCard({ quote, author, role }: TestimonialItem) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <SampleBadge className="w-fit" />
        <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
          “{quote}”
        </blockquote>
        <figcaption className="text-sm">
          <span className="font-medium">{author}</span>
          {role ? (
            <span className="text-muted-foreground"> — {role}</span>
          ) : null}
        </figcaption>
      </CardContent>
    </Card>
  );
}
