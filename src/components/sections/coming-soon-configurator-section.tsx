"use client";

import * as React from "react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icons";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { ComingSoonConfigGroup, Surface } from "@/lib/services/landing";

export interface ComingSoonConfiguratorSectionProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  groups: ComingSoonConfigGroup[];
  notes?: { label: string; placeholder?: string };
  tiers: { id: string; name: string; price: { amount: number; currency: string } }[];
  footnote?: string;
  surface?: Surface;
}

/** Whole-dollar display, e.g. 16500 USD -> "$165" (drops a trailing ".00"). */
function priceLabel(price: { amount: number; currency: string }): string {
  return formatMoney(price).replace(/\.00$/, "");
}

/**
 * Coming-soon configurator — an illustrative, NON-submitting "plan your visit"
 * preview for services without a live booking flow. Local state only: selecting
 * options and typing notes changes nothing downstream and submits nowhere. The
 * summary shows draft visit-type tiers ("Evaluation … OR Follow-Up …") with a
 * coordinator-confirms footnote — no live total is computed. Token-only.
 */
export function ComingSoonConfiguratorSection({
  eyebrow,
  heading,
  subheading,
  groups,
  notes,
  tiers,
  footnote,
  surface = "default",
}: ComingSoonConfiguratorSectionProps) {
  const [selections, setSelections] = React.useState<Record<string, string>>(
    () => Object.fromEntries(groups.map((g) => [g.id, g.options[0]?.id ?? ""])),
  );
  const [noteText, setNoteText] = React.useState("");

  const select = (groupId: string, optionId: string) =>
    setSelections((current) => ({ ...current, [groupId]: optionId }));

  return (
    <section
      aria-labelledby={heading ? "coming-soon-config-heading" : undefined}
      className={cn(
        "py-16 md:py-20 lg:py-28",
        surface === "muted" && "bg-muted",
      )}
    >
      <Container>
        {heading || eyebrow || subheading ? (
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            {heading ? (
              <h2
                id="coming-soon-config-heading"
                className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl"
              >
                {heading}
              </h2>
            ) : null}
            {subheading ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {subheading}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
          {/* Selectors */}
          <Card className="flex flex-col gap-6 rounded-2xl bg-card p-6 md:p-8">
            {groups.map((group) => {
              const Icon = getIcon(group.icon);
              return (
                <fieldset key={group.id}>
                  <legend className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="text-primary">
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    {group.label}
                  </legend>

                  {group.control === "dropdown" ? (
                    <select
                      aria-label={group.label}
                      value={selections[group.id] ?? ""}
                      onChange={(e) => select(group.id, e.target.value)}
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {group.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {group.options.map((option) => {
                        const selected = selections[group.id] === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => select(group.id, option.id)}
                            className={cn(
                              "cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground hover:border-primary hover:bg-accent hover:text-accent-foreground",
                            )}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </fieldset>
              );
            })}

            {notes ? (
              <div>
                <label
                  htmlFor="cs-notes"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  {notes.label}
                </label>
                <Textarea
                  id="cs-notes"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={notes.placeholder}
                />
              </div>
            ) : null}
          </Card>

          {/* "OR" summary — draft tiers, never a live total */}
          <Card className="flex h-full flex-col gap-4 rounded-2xl border-transparent bg-surface-inverse p-6 text-surface-inverse-foreground md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-surface-inverse-foreground/70">
              Estimated Pricing
            </p>

            <div className="flex flex-col gap-3">
              {tiers.map((tier, i) => (
                <React.Fragment key={tier.id}>
                  {i > 0 ? (
                    <div className="flex items-center gap-3">
                      <span className="h-px flex-1 bg-surface-inverse-foreground/20" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-surface-inverse-foreground/60">
                        or
                      </span>
                      <span className="h-px flex-1 bg-surface-inverse-foreground/20" />
                    </div>
                  ) : null}
                  <div className="rounded-xl bg-surface-inverse-foreground/5 p-4">
                    <p className="text-sm font-semibold text-surface-inverse-foreground">
                      {tier.name}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-surface-inverse-foreground/70">
                        From
                      </span>
                      <span className="font-heading text-2xl font-semibold text-highlight">
                        {priceLabel(tier.price)}
                      </span>
                      <Badge variant="secondary" className="uppercase tracking-wide">
                        Draft
                      </Badge>
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {footnote ? (
              <p className="mt-auto rounded-lg bg-surface-inverse-foreground/5 px-3 py-2 text-xs leading-relaxed text-surface-inverse-foreground/70">
                {footnote}
              </p>
            ) : null}
          </Card>
        </div>
      </Container>
    </section>
  );
}
