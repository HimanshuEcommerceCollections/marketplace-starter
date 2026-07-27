"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const COVERAGE_AREAS_HREF = "/admin/coverage";
export const COVERAGE_ZIPS_HREF = "/admin/coverage/zip-codes";

export interface CoverageTabsProps {
  /** Server-side totals; omit while loading. */
  areaCount?: number;
  zipCount?: number;
}

/**
 * Sub-navigation between the two Coverage screens.
 *
 * `<Link>`s, not Radix `<Tabs>`: each screen owns an independent
 * search / status / page / result state loop, and `TabsContent` unmounts the
 * inactive panel and has no routing concept — so a shared URL, a deep link from
 * the Areas table's ZIP count, and the browser Back button would all break.
 */
export function CoverageTabs({ areaCount, zipCount }: CoverageTabsProps) {
  const pathname = usePathname();
  const tabs = [
    { href: COVERAGE_AREAS_HREF, label: "Areas", count: areaCount, exact: true },
    { href: COVERAGE_ZIPS_HREF, label: "ZIP codes", count: zipCount, exact: false },
  ];

  return (
    <nav aria-label="Coverage sections" className="mb-5 flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : (pathname?.startsWith(tab.href) ?? false);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "bg-surface-inverse text-surface-inverse-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-muted/60",
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined ? (
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                  active
                    ? "bg-surface-inverse-foreground/15 text-surface-inverse-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
