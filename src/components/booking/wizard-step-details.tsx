"use client";

import * as React from "react";
import { useBookingDraft } from "./booking-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { AREA_OPTIONS } from "@/lib/auth/areas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FieldErrors } from "@/lib/forms/validate";

/** Hourly time options 8:00 AM – 8:00 PM (24h value, 12h label). */
const TIME_OPTIONS = Array.from({ length: 13 }, (_, i) => {
  const h = i + 8;
  const value = `${String(h).padStart(2, "0")}:00`;
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { value, label: `${h12}:00 ${period}` };
});

const SELECT_CLS =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
      {errors[0]}
    </p>
  );
}

export function WizardStepDetails({ errors }: { errors?: FieldErrors }) {
  const { state, dispatch } = useBookingDraft();
  const { user } = useAuth();

  const setField = (
    field: "firstName" | "lastName" | "email" | "phone" | "address" | "area",
    value: string,
  ) => dispatch({ type: "SET_FIELD", field, value });

  // Pre-fill area when the signed-in customer covers exactly one town.
  React.useEffect(() => {
    if (!state.area && user?.area?.length === 1) {
      dispatch({ type: "SET_FIELD", field: "area", value: user.area[0] });
    }
  }, [user, state.area, dispatch]);

  return (
    <div className="space-y-8">
      {/* Contact */}
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            className="mt-2"
            value={state.firstName}
            aria-invalid={!!errors?.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
          />
          <FieldError id="firstName" errors={errors?.firstName} />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            className="mt-2"
            value={state.lastName}
            aria-invalid={!!errors?.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
          />
          <FieldError id="lastName" errors={errors?.lastName} />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            className="mt-2"
            value={state.email}
            aria-invalid={!!errors?.email}
            onChange={(e) => setField("email", e.target.value)}
          />
          <FieldError id="email" errors={errors?.email} />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            className="mt-2"
            value={state.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="address">Home Address / Location</Label>
          <Input
            id="address"
            className="mt-2"
            value={state.address}
            onChange={(e) => setField("address", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="area">Your Area</Label>
          <select
            id="area"
            className={cn(SELECT_CLS, "mt-2", !state.area && "text-muted-foreground")}
            value={state.area}
            onChange={(e) => setField("area", e.target.value)}
          >
            <option value="">Select your area</option>
            {AREA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scheduling windows */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Preferred Scheduling Windows
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Provide up to 3 windows. A coordinator will confirm availability.
        </p>

        <div className="mt-4 space-y-6">
          {state.windows.map((w, i) => (
            <div key={i}>
              <p className="text-sm font-medium text-foreground">
                Preferred Time Window {i + 1}
              </p>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <Input
                  type="date"
                  aria-label={`Window ${i + 1} date`}
                  value={w.date}
                  aria-invalid={i === 0 ? !!errors?.window1 : undefined}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_WINDOW",
                      index: i,
                      patch: { date: e.target.value },
                    })
                  }
                />
                <select
                  aria-label={`Window ${i + 1} time`}
                  className={cn(SELECT_CLS, !w.time && "text-muted-foreground")}
                  value={w.time}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_WINDOW",
                      index: i,
                      patch: { time: e.target.value },
                    })
                  }
                >
                  <option value="">Select time</option>
                  {TIME_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              {i === 0 ? <FieldError id="window1" errors={errors?.window1} /> : null}
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes for Your Coordinator</Label>
        <Textarea
          id="notes"
          className="mt-2"
          rows={3}
          placeholder="e.g. entrance code, parking instructions, specific concerns..."
          value={state.notes}
          onChange={(e) => dispatch({ type: "SET_NOTES", notes: e.target.value })}
        />
      </div>
    </div>
  );
}
