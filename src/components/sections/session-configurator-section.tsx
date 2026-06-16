"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConfiguratorGroup } from "@/lib/services/landing";
import type { NavItem } from "@/lib/brand/types";

export interface SessionConfiguratorSectionProps {
  heading?: string;
  subheading?: string;
  groups: ConfiguratorGroup[];
  cta?: NavItem;
}

const GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function Pill({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "w-full cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {label}
    </button>
  );
}

function optionText(label: string, note?: string) {
  return note ? `${label} (${note})` : label;
}

/**
 * Session Configurator Preview — interactive option preview before booking.
 * Client component, token-only, fully data-driven via `groups`. No API calls;
 * selections are local state only.
 * Desktop: up to 4 columns · Tablet: 2 columns · Mobile: single-column.
 */
export function SessionConfiguratorSection({
  heading = "Configure your session",
  subheading = "Exact pricing updates live in the booking flow. This is a preview of available options.",
  groups,
  cta,
}: SessionConfiguratorSectionProps) {
  // Initialise selections: single -> default/first option id; multi -> [].
  const [selections, setSelections] = React.useState<
    Record<string, string | string[]>
  >(() =>
    Object.fromEntries(
      groups.map((g) => [
        g.id,
        g.type === "single"
          ? (g.defaultOptionId ?? g.options[0]?.id ?? "")
          : [],
      ]),
    ),
  );

  const setSingle = (groupId: string, optionId: string) =>
    setSelections((current) => ({ ...current, [groupId]: optionId }));

  const toggleMulti = (groupId: string, optionId: string) =>
    setSelections((current) => {
      const list = Array.isArray(current[groupId])
        ? (current[groupId] as string[])
        : [];
      return {
        ...current,
        [groupId]: list.includes(optionId)
          ? list.filter((id) => id !== optionId)
          : [...list, optionId],
      };
    });

  const isSelected = (group: ConfiguratorGroup, optionId: string) => {
    const value = selections[group.id];
    return group.type === "single"
      ? value === optionId
      : Array.isArray(value) && value.includes(optionId);
  };

  return (
    <section
      aria-labelledby="configurator-heading"
      className="py-16 md:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2
            id="configurator-heading"
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            {heading}
          </h2>
          {subheading ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {subheading}
            </p>
          ) : null}
        </div>

        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-muted p-8 shadow-sm md:p-10">
          <div
            className={cn(
              "grid grid-cols-1 gap-8 lg:gap-10",
              GRID_COLS[Math.min(groups.length, 4)],
            )}
          >
            {groups.map((group) => (
              <div
                key={group.id}
                role="group"
                aria-labelledby={`config-${group.id}`}
              >
                <p
                  id={`config-${group.id}`}
                  className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  {group.label}
                </p>
                <div className="flex flex-col gap-2">
                  {group.options.map((option) => (
                    <Pill
                      key={option.id}
                      label={optionText(option.label, option.note)}
                      selected={isSelected(group, option.id)}
                      onToggle={() =>
                        group.type === "single"
                          ? setSingle(group.id, option.id)
                          : toggleMulti(group.id, option.id)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {cta ? (
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
