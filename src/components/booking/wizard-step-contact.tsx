"use client";

import { useBookingDraft } from "./booking-provider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FieldErrors } from "@/lib/forms/validate";
import type { ContactMethod, LocationMode } from "@/lib/booking/enums";

const METHODS: { id: ContactMethod; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "sms", label: "SMS" },
];

const MODE_LABELS: Record<LocationMode, string> = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={`${id}-error`} className="text-xs text-destructive">
      {errors[0]}
    </p>
  );
}

export function WizardStepContact({ errors }: { errors?: FieldErrors }) {
  const { state, dispatch, service } = useBookingDraft();
  const c = state.contact;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Your details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Stub form — nothing is submitted to a backend.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          value={c.name ?? ""}
          aria-invalid={!!errors?.name}
          aria-describedby={errors?.name ? "contact-name-error" : undefined}
          onChange={(e) =>
            dispatch({ type: "SET_CONTACT", patch: { name: e.target.value } })
          }
        />
        <FieldError id="contact-name" errors={errors?.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={c.email ?? ""}
            aria-invalid={!!errors?.email}
            aria-describedby={errors?.email ? "contact-email-error" : undefined}
            onChange={(e) =>
              dispatch({
                type: "SET_CONTACT",
                patch: { email: e.target.value },
              })
            }
          />
          <FieldError id="contact-email" errors={errors?.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input
            id="contact-phone"
            type="tel"
            value={c.phone ?? ""}
            onChange={(e) =>
              dispatch({
                type: "SET_CONTACT",
                patch: { phone: e.target.value },
              })
            }
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Preferred contact method</legend>
        <RadioGroup
          value={c.preferred_method ?? "email"}
          onValueChange={(v) =>
            dispatch({
              type: "SET_CONTACT",
              patch: { preferred_method: v as ContactMethod },
            })
          }
          className="sm:grid-cols-3"
        >
          {METHODS.map((m) => (
            <Label
              key={m.id}
              htmlFor={`method-${m.id}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-input p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            >
              <RadioGroupItem id={`method-${m.id}`} value={m.id} />
              <span className="text-sm">{m.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Location</legend>
        <RadioGroup
          value={state.locationMode}
          onValueChange={(v) =>
            dispatch({ type: "SET_LOCATION_MODE", mode: v as LocationMode })
          }
          className="sm:grid-cols-3"
        >
          {service.location_modes.map((mode) => (
            <Label
              key={mode}
              htmlFor={`loc-${mode}`}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-input p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            >
              <RadioGroupItem id={`loc-${mode}`} value={mode} />
              <span className="text-sm">{MODE_LABELS[mode]}</span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="contact-notes">Notes (optional)</Label>
        <Textarea
          id="contact-notes"
          value={state.notes}
          onChange={(e) =>
            dispatch({ type: "SET_NOTES", notes: e.target.value })
          }
        />
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={c.consent_marketing ?? false}
          onChange={(e) =>
            dispatch({
              type: "SET_CONTACT",
              patch: { consent_marketing: e.target.checked },
            })
          }
          className="size-4 accent-primary"
        />
        Keep me updated about offers (optional).
      </label>
    </div>
  );
}
