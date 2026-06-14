"use client";

import { useBookingDraft } from "./booking-provider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ConfigOption } from "@/lib/catalog/types";

export function WizardStepConfig() {
  const { state, dispatch, service } = useBookingDraft();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Configure {service.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your options. Prices update on the review step.
        </p>
      </div>

      {service.config_options.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No options for this service — continue to scheduling.
        </p>
      ) : null}

      {service.config_options.map((opt) => (
        <OptionField key={opt.id} option={opt} />
      ))}
    </div>
  );

  function OptionField({ option }: { option: ConfigOption }) {
    if (option.input === "quantity") {
      return (
        <div className="space-y-2">
          <Label htmlFor={`opt-${option.id}`}>{option.label}</Label>
          <Input
            id={`opt-${option.id}`}
            type="number"
            min={option.min ?? 1}
            max={option.max}
            value={state.quantity}
            onChange={(e) =>
              dispatch({
                type: "SET_QUANTITY",
                quantity: Number(e.target.value) || 1,
              })
            }
            className="max-w-32"
          />
        </div>
      );
    }

    if (option.input === "toggle") {
      const checked = state.selections[option.id] === true;
      return (
        <label className="flex items-center gap-3 rounded-lg border border-input p-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) =>
              dispatch({
                type: "SET_SELECTION",
                key: option.id,
                value: e.target.checked,
              })
            }
            className="size-4 accent-primary"
          />
          <span className="text-sm font-medium">{option.label}</span>
        </label>
      );
    }

    // select (default)
    const current = String(state.selections[option.id] ?? "");
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{option.label}</legend>
        <RadioGroup
          value={current}
          onValueChange={(v) =>
            dispatch({ type: "SET_SELECTION", key: option.id, value: v })
          }
          aria-label={option.label}
        >
          {option.choices?.map((c) => (
            <Label
              key={c.id}
              htmlFor={`${option.id}-${c.id}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-input p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            >
              <RadioGroupItem id={`${option.id}-${c.id}`} value={c.id} />
              <span className="text-sm">{c.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>
    );
  }
}
