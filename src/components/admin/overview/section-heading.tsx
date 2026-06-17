import * as React from "react";

export interface SectionHeadingProps {
  title: string;
  /** Optional small count badge rendered next to the title. */
  count?: React.ReactNode;
  subtitle?: string;
}

/**
 * Consistent block heading for the overview dashboard sections:
 * a heading-font title, an optional count pill, and an optional sub-line.
 */
export function SectionHeading({ title, count, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {title}
        </h2>
        {count !== undefined ? (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-warning px-2 py-0.5 text-xs font-semibold text-warning-foreground">
            {count}
          </span>
        ) : null}
      </div>
      {subtitle ? (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
