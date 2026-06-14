"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DURATIONS = ["60 min", "90 min", "120 min"];
const SESSION_TYPES = ["Swedish", "Deep Tissue", "Prenatal", "Sports"];
const ADD_ONS = ["Hot Stones", "Aromatherapy", "Targeted Focus"];

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

/**
 * Session Configurator Preview — interactive option preview before booking.
 * Client component, token-only. No API calls; selections are local state.
 * Desktop: 3 columns · Tablet: 2 columns · Mobile: single-column, full-width.
 */
export function SessionConfiguratorSection() {
  const [selectedDuration, setSelectedDuration] =
    React.useState<string>("60 min");
  const [selectedSessionType, setSelectedSessionType] =
    React.useState<string>("Swedish");
  const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>([]);

  const toggleAddOn = (addOn: string) =>
    setSelectedAddOns((current) =>
      current.includes(addOn)
        ? current.filter((item) => item !== addOn)
        : [...current, addOn],
    );

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
            Configure your session
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Exact pricing updates live in the booking flow. This is a preview of
            available options.
          </p>
        </div>

        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-muted p-8 shadow-sm md:p-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {/* Duration — single select */}
            <div role="group" aria-labelledby="config-duration">
              <p
                id="config-duration"
                className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Duration
              </p>
              <div className="flex flex-col gap-2">
                {DURATIONS.map((option) => (
                  <Pill
                    key={option}
                    label={option}
                    selected={selectedDuration === option}
                    onToggle={() => setSelectedDuration(option)}
                  />
                ))}
              </div>
            </div>

            {/* Session type — single select */}
            <div role="group" aria-labelledby="config-session-type">
              <p
                id="config-session-type"
                className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Session Type
              </p>
              <div className="flex flex-col gap-2">
                {SESSION_TYPES.map((option) => (
                  <Pill
                    key={option}
                    label={option}
                    selected={selectedSessionType === option}
                    onToggle={() => setSelectedSessionType(option)}
                  />
                ))}
              </div>
            </div>

            {/* Add-ons — multi select */}
            <div role="group" aria-labelledby="config-add-ons">
              <p
                id="config-add-ons"
                className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Add-ons
              </p>
              <div className="flex flex-col gap-2">
                {ADD_ONS.map((option) => (
                  <Pill
                    key={option}
                    label={option}
                    selected={selectedAddOns.includes(option)}
                    onToggle={() => toggleAddOn(option)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/book">Book Massage</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
