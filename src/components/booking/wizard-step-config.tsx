"use client";

import { useBookingDraft } from "./booking-provider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatMoney, addMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { ConfigOption } from "@/lib/catalog/types";
import type { Money } from "@/lib/booking/contract";

/** Whole-dollar money (e.g. "$109"). */
function money(m: Money): string {
  return formatMoney(m).replace(/\.00$/, "");
}

const ROW_BASE =
  "flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 transition";

export function WizardStepConfig() {
  const { state, dispatch, service, pricing } = useBookingDraft();

  const sp = pricing.services[service.id];
  const base: Money = sp?.base_price ?? { amount: 0, currency: service.currency };
  const modifierOf = (id: string) => sp?.modifiers.find((m) => m.id === id);
  const deltaOf = (modId: string, choiceId: string) =>
    modifierOf(modId)?.options?.find((o) => o.id === choiceId)?.delta;
  const groupAffectsPrice = (modId: string) =>
    (modifierOf(modId)?.options ?? []).some(
      (o) => o.delta && o.delta.amount !== 0,
    );

  return (
    <div className="space-y-8">
      {service.config_options.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No options for this service — continue to the next step.
        </p>
      ) : null}

      {service.config_options.map((option) => (
        <OptionGroup key={option.id} option={option} />
      ))}
    </div>
  );

  function OptionGroup({ option }: { option: ConfigOption }) {
    if (option.input === "quantity") {
      return (
        <fieldset className="space-y-2">
          <Label htmlFor={`opt-${option.id}`} className="text-sm font-semibold">
            {option.label}
          </Label>
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
        </fieldset>
      );
    }

    const Heading = (
      <>
        <legend className="text-sm font-semibold text-foreground">
          {option.label}
        </legend>
        {option.input === "multiselect" ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Optional enhancements — pricing shown as DRAFT estimate.
          </p>
        ) : null}
      </>
    );

    // Multi-select (add-ons): checkbox rows with "+$X DRAFT".
    if (option.input === "multiselect") {
      const selected = Array.isArray(state.selections[option.id])
        ? (state.selections[option.id] as string[])
        : [];
      const toggle = (id: string, checked: boolean) =>
        dispatch({
          type: "SET_SELECTION",
          key: option.id,
          value: checked
            ? [...selected, id]
            : selected.filter((x) => x !== id),
        });

      return (
        <fieldset>
          {Heading}
          <div className="mt-3 space-y-3">
            {option.choices?.map((c) => {
              const isOn = selected.includes(c.id);
              const delta = deltaOf(option.id, c.id);
              return (
                <label
                  key={c.id}
                  className={cn(
                    ROW_BASE,
                    isOn
                      ? "border-highlight bg-highlight/5"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={(e) => toggle(c.id, e.target.checked)}
                      className="size-4 accent-primary"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {c.label}
                    </span>
                  </span>
                  {delta && delta.amount !== 0 ? (
                    <span className="text-sm font-medium">
                      <span className="text-highlight">+{money(delta)}</span>{" "}
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Draft
                      </span>
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>
      );
    }

    if (option.input === "toggle") {
      const isOn = state.selections[option.id] === true;
      const delta = modifierOf(option.id)?.delta;
      return (
        <fieldset>
          {Heading}
          <label
            className={cn(
              ROW_BASE,
              "mt-3",
              isOn
                ? "border-highlight bg-highlight/5"
                : "border-border hover:border-primary/40",
            )}
          >
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isOn}
                onChange={(e) =>
                  dispatch({
                    type: "SET_SELECTION",
                    key: option.id,
                    value: e.target.checked,
                  })
                }
                className="size-4 accent-primary"
              />
              <span className="text-sm font-medium text-foreground">
                {option.label}
              </span>
            </span>
            {delta && delta.amount !== 0 ? (
              <span className="text-sm font-medium text-highlight">
                +{money(delta)}
              </span>
            ) : null}
          </label>
        </fieldset>
      );
    }

    // Single-select (default): radio rows, optional "From $X" per choice.
    const current = String(state.selections[option.id] ?? "");
    const showPrice = groupAffectsPrice(option.id);
    return (
      <fieldset>
        {Heading}
        <RadioGroup
          value={current}
          onValueChange={(v) =>
            dispatch({ type: "SET_SELECTION", key: option.id, value: v })
          }
          aria-label={option.label}
          className="mt-3 flex flex-col gap-3"
        >
          {option.choices?.map((c) => {
            const isOn = current === c.id;
            const delta = deltaOf(option.id, c.id);
            const price = showPrice ? money(delta ? addMoney(base, delta) : base) : null;
            return (
              <Label
                key={c.id}
                htmlFor={`${option.id}-${c.id}`}
                className={cn(
                  ROW_BASE,
                  isOn
                    ? "border-highlight bg-highlight/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <span className="flex items-center gap-3">
                  <RadioGroupItem id={`${option.id}-${c.id}`} value={c.id} />
                  <span className="text-sm font-medium text-foreground">
                    {c.label}
                  </span>
                </span>
                {price ? (
                  <span className="text-sm font-medium text-highlight">
                    From {price}
                  </span>
                ) : null}
              </Label>
            );
          })}
        </RadioGroup>
      </fieldset>
    );
  }
}
