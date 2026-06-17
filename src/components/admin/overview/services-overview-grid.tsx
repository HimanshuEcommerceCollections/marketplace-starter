import * as React from "react";
import { Card } from "@/components/ui/card";
import type { ServicesOverviewItem } from "@/lib/admin/types";

export interface ServicesOverviewGridProps {
  items: ServicesOverviewItem[];
}

/** Compact category cards summarising active / pending service counts. */
export function ServicesOverviewGrid({ items }: ServicesOverviewGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <Card key={item.name} className="p-4">
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="mt-2 text-sm font-medium text-primary">
            {item.active} active
          </p>
          {item.pending > 0 ? (
            <p className="mt-0.5 text-sm font-medium text-highlight">
              {item.pending} pending
            </p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
