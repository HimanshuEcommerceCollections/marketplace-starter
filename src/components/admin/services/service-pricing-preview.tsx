"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleBadge } from "@/components/shared/sample-badge";
import { formatCents } from "@/lib/admin/format";
import { ServiceApiError } from "@/lib/admin/services";
import {
  listConfigGroups,
  quoteServicePrice,
  type ConfigGroup,
  type ConfigOption,
  type PriceQuote,
} from "@/lib/admin/service-config";

function priceLabel(cents: number): string {
  return cents === 0 ? "No charge" : `+ ${formatCents(cents)}`;
}

/**
 * Interactive "Option A" pricing preview. Lets an admin pick options (the same
 * way a customer would — single-select as radios, multi-select as checkboxes)
 * and shows the live total computed by the server `/config/price` endpoint, so
 * the same engine that prices a booking is what's previewed here.
 */
export function ServicePricingPreview({
  serviceId,
  basePrice,
}: {
  serviceId: string;
  basePrice: number;
}) {
  const [groups, setGroups] = React.useState<ConfigGroup[] | null>(null);
  const [selected, setSelected] = React.useState<Record<string, string[]>>({});
  const [quote, setQuote] = React.useState<PriceQuote | null>(null);
  const [note, setNote] = React.useState<string | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const activeOptions = React.useCallback(
    (g: ConfigGroup): ConfigOption[] => g.options.filter((o) => o.status === "ACTIVE"),
    [],
  );

  // Load active groups and seed a valid starting selection (first option of each
  // required single-select group) so the initial quote isn't a validation error.
  React.useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const all = await listConfigGroups(serviceId);
        if (!alive) return;
        const active = all.filter(
          (g) => g.status === "ACTIVE" && g.options.some((o) => o.status === "ACTIVE"),
        );
        const seed: Record<string, string[]> = {};
        for (const g of active) {
          if (g.isRequired && g.selectionType === "SINGLE_SELECT") {
            const first = g.options.find((o) => o.status === "ACTIVE");
            if (first) seed[g.id] = [first.id];
          }
        }
        setGroups(active);
        setSelected(seed);
      } catch (err) {
        if (alive) {
          setLoadError(
            err instanceof ServiceApiError ? err.message : "Failed to load configuration.",
          );
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [serviceId]);

  const optionIds = React.useMemo(() => Object.values(selected).flat(), [selected]);

  // Re-quote whenever the selection changes.
  React.useEffect(() => {
    if (groups === null) return;
    let alive = true;
    void (async () => {
      try {
        const q = await quoteServicePrice(serviceId, optionIds);
        if (!alive) return;
        setQuote(q);
        setNote(null);
      } catch (err) {
        if (!alive) return;
        setQuote(null);
        setNote(
          err instanceof ServiceApiError ? err.message : "Could not price this selection.",
        );
      }
    })();
    return () => {
      alive = false;
    };
  }, [serviceId, optionIds, groups]);

  const selectSingle = (groupId: string, optionId: string) =>
    setSelected((s) => ({ ...s, [groupId]: [optionId] }));
  const toggleMulti = (groupId: string, optionId: string) =>
    setSelected((s) => {
      const cur = s[groupId] ?? [];
      return {
        ...s,
        [groupId]: cur.includes(optionId)
          ? cur.filter((x) => x !== optionId)
          : [...cur, optionId],
      };
    });

  if (loadError) {
    return (
      <Card className="flex items-center gap-2 px-4 py-8 text-sm text-destructive">
        <TriangleAlert className="size-4 shrink-0" aria-hidden />
        {loadError}
      </Card>
    );
  }
  if (groups === null) {
    return <Card className="h-40 animate-pulse bg-muted/60" />;
  }
  if (groups.length === 0) {
    return (
      <Card className="p-5 sm:p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Pricing preview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This service has no active configuration groups, so the price is just the base price:{" "}
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            {formatCents(basePrice)} <SampleBadge />
          </span>
          .
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">Pricing preview</h2>
        <p className="text-sm text-muted-foreground">
          Pick options as a customer would; the total is computed live by the booking pricing
          engine.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          {groups.map((g) => {
            const single = g.selectionType === "SINGLE_SELECT";
            const chosen = selected[g.id] ?? [];
            return (
              <fieldset key={g.id} className="flex flex-col gap-2">
                <legend className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                  {g.label}
                  {g.isRequired ? <Badge variant="outline">Required</Badge> : null}
                  <Badge variant="secondary">{single ? "Single select" : "Multi-select"}</Badge>
                </legend>
                {activeOptions(g).map((o) => (
                  <label
                    key={o.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type={single ? "radio" : "checkbox"}
                        name={`grp-${g.id}`}
                        className="size-4 accent-primary"
                        checked={chosen.includes(o.id)}
                        onChange={() =>
                          single ? selectSingle(g.id, o.id) : toggleMulti(g.id, o.id)
                        }
                      />
                      <span className="text-foreground">{o.label}</span>
                    </span>
                    <span className="text-muted-foreground">{priceLabel(o.priceModifier)}</span>
                  </label>
                ))}
              </fieldset>
            );
          })}
        </div>

        <aside className="h-fit rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-semibold text-foreground">Estimated price</h3>
            <SampleBadge />
          </div>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Base</dt>
              <dd className="font-medium text-foreground">{formatCents(basePrice)}</dd>
            </div>
            {quote?.lineItems.map((li) => (
              <div key={li.optionId} className="flex items-center justify-between gap-2">
                <dt className="truncate text-muted-foreground">{li.optionLabel}</dt>
                <dd className="shrink-0 text-foreground">{priceLabel(li.priceModifier)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="text-lg font-semibold text-foreground">
              {quote ? formatCents(quote.total) : "—"}
            </span>
          </div>
          {note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
        </aside>
      </div>
    </Card>
  );
}
