"use client";

import { Progress } from "@/components/ui/progress";
import { WIZARD_STEPS, type WizardStep } from "./booking-provider";
import { cn } from "@/lib/utils";

const LABELS: Record<WizardStep, string> = {
  config: "Configure",
  schedule: "Schedule",
  contact: "Details",
  review: "Review",
  success: "Done",
};

export function WizardStepper({ step }: { step: WizardStep }) {
  const index = WIZARD_STEPS.indexOf(step);
  const pct = (index / (WIZARD_STEPS.length - 1)) * 100;
  return (
    <div>
      <ol className="flex items-center justify-between gap-2 text-xs">
        {WIZARD_STEPS.map((s, i) => (
          <li
            key={s}
            aria-current={s === step ? "step" : undefined}
            className={cn(
              "flex items-center gap-1.5",
              i <= index ? "font-medium text-primary" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs",
                i <= index
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border",
              )}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{LABELS[s]}</span>
          </li>
        ))}
      </ol>
      <Progress
        value={pct}
        className="mt-3"
        aria-label={`Step ${index + 1} of ${WIZARD_STEPS.length}: ${LABELS[step]}`}
      />
    </div>
  );
}
