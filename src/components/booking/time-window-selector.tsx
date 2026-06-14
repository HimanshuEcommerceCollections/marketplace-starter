"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { TimeWindowKind } from "@/lib/booking/enums";

const WINDOWS: { id: TimeWindowKind; label: string; hint: string }[] = [
  { id: "morning", label: "Morning", hint: "8am – 12pm" },
  { id: "afternoon", label: "Afternoon", hint: "12pm – 4pm" },
  { id: "evening", label: "Evening", hint: "4pm – 8pm" },
  { id: "anytime", label: "Anytime", hint: "Flexible" },
];

export interface TimeWindowSelectorProps {
  value: TimeWindowKind;
  onChange: (value: TimeWindowKind) => void;
}

/** Single-select preferred time window. Radiogroup keyboard pattern (arrow keys). */
export function TimeWindowSelector({ value, onChange }: TimeWindowSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as TimeWindowKind)}
      aria-label="Preferred time window"
      className="sm:grid-cols-2"
    >
      {WINDOWS.map((w) => (
        <Label
          key={w.id}
          htmlFor={`tw-${w.id}`}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-input p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
        >
          <RadioGroupItem id={`tw-${w.id}`} value={w.id} />
          <span>
            <span className="font-medium">{w.label}</span>
            <span className="block text-xs text-muted-foreground">{w.hint}</span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}
