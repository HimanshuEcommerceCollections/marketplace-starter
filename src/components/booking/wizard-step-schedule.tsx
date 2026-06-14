"use client";

import { useBookingDraft } from "./booking-provider";
import { TimeWindowSelector } from "./time-window-selector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Flexibility } from "@/lib/booking/enums";

const FLEX: { id: Flexibility; label: string }[] = [
  { id: "exact", label: "Exact date" },
  { id: "flexible", label: "Flexible" },
  { id: "asap", label: "As soon as possible" },
];

export function WizardStepSchedule() {
  const { state, dispatch } = useBookingDraft();
  const date = state.scheduleDates[0] ?? "";
  const window = state.timeWindows[0] ?? "anytime";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">When works for you?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us your preferred date and time window.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule-date">Preferred date</Label>
        <Input
          id="schedule-date"
          type="date"
          value={date}
          onChange={(e) =>
            dispatch({
              type: "SET_SCHEDULE",
              dates: e.target.value ? [e.target.value] : [],
              windows: state.timeWindows,
              flexibility: state.flexibility,
            })
          }
          className="max-w-48"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Preferred time window</p>
        <TimeWindowSelector
          value={window}
          onChange={(w) =>
            dispatch({
              type: "SET_SCHEDULE",
              dates: state.scheduleDates,
              windows: [w],
              flexibility: state.flexibility,
            })
          }
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Flexibility</legend>
        <RadioGroup
          value={state.flexibility}
          onValueChange={(v) =>
            dispatch({
              type: "SET_SCHEDULE",
              dates: state.scheduleDates,
              windows: state.timeWindows,
              flexibility: v as Flexibility,
            })
          }
          className="sm:grid-cols-3"
        >
          {FLEX.map((f) => (
            <Label
              key={f.id}
              htmlFor={`flex-${f.id}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-input p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            >
              <RadioGroupItem id={`flex-${f.id}`} value={f.id} />
              <span className="text-sm">{f.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>
    </div>
  );
}
