import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BOOKING_FLOW_STEPS } from "@/lib/booking/flow-steps";

export interface BookingFlowStepperProps {
  /** Zero-based index of the current step. */
  currentIndex: number;
  /** Render every step as completed (the final "Done" state). */
  complete?: boolean;
}

/**
 * 6-step booking progress indicator. Server component, token-only.
 * Desktop/tablet: horizontal numbered steps with connectors.
 * Mobile: "Step N of 6 · Label" + a progress bar.
 */
export function BookingFlowStepper({
  currentIndex,
  complete = false,
}: BookingFlowStepperProps) {
  const steps = BOOKING_FLOW_STEPS;
  const current = steps[currentIndex];
  const pct = complete ? 100 : ((currentIndex + 1) / steps.length) * 100;

  return (
    <div>
      {/* Mobile */}
      <div className="sm:hidden">
        <p className="text-sm font-medium text-foreground">
          <span className="text-muted-foreground">
            Step {currentIndex + 1} of {steps.length} ·{" "}
          </span>
          {current.label}
        </p>
        <Progress
          value={pct}
          className="mt-2"
          aria-label={`Step ${currentIndex + 1} of ${steps.length}: ${current.label}`}
        />
      </div>

      {/* Desktop / tablet */}
      <ol className="hidden items-start sm:flex">
        {steps.map((step, i) => {
          const active = !complete && i === currentIndex;
          const completed = complete || i < currentIndex;
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.id}
              aria-current={active ? "step" : undefined}
              className={cn("flex items-start", !isLast && "flex-1")}
            >
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    active && "bg-highlight text-highlight-foreground",
                    completed && "bg-primary text-primary-foreground",
                    !active && !completed && "bg-muted text-muted-foreground",
                  )}
                >
                  {completed ? (
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    active
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast ? (
                <span aria-hidden className="mt-3.5 h-px flex-1 bg-border" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
