"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SampleBadge } from "@/components/shared/sample-badge";
import { cn } from "@/lib/utils";
import type { AdminService } from "@/lib/admin/types";
import { AvailabilityToggle } from "./availability-toggle";

export interface ServiceEditPanelProps {
  service: AdminService;
}

/**
 * Edit form for a single service. Stub-only: all controls drive local state,
 * no fetch/backend. The whole panel is keyed by service id at the call site so
 * state reseeds when a different service is selected.
 */
export function ServiceEditPanel({ service }: ServiceEditPanelProps) {
  const seed = service.availability ?? {
    weekdays: false,
    weekends: false,
    sameDay: false,
  };
  const [weekdays, setWeekdays] = React.useState(seed.weekdays);
  const [weekends, setWeekends] = React.useState(seed.weekends);
  const [sameDay, setSameDay] = React.useState(seed.sameDay);
  const [status, setStatus] = React.useState(service.status);

  const active = status === "active";

  return (
    <Card className="overflow-hidden p-0">
      {/* Header band */}
      <div className="rounded-t-lg bg-primary px-5 py-4 text-primary-foreground">
        <h2 className="font-heading text-lg font-semibold">Edit Service</h2>
        <p className="mt-0.5 text-sm text-primary-foreground/80">
          {service.name}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 bg-card p-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="svc-name">Service name</Label>
          <Input id="svc-name" defaultValue={service.name} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="svc-category">Category</Label>
            <Input id="svc-category" defaultValue={service.category} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="svc-duration">Duration</Label>
            <Input id="svc-duration" defaultValue={service.duration} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="svc-base-price" className="flex items-center gap-2">
              Base price
              <SampleBadge />
            </Label>
            <Input id="svc-base-price" defaultValue={service.basePrice} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="svc-max-price">Max price</Label>
            <Input
              id="svc-max-price"
              defaultValue={service.maxPrice ?? ""}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="svc-description">Description</Label>
          <Textarea
            id="svc-description"
            rows={4}
            defaultValue={service.description ?? ""}
            placeholder="Describe this service…"
          />
        </div>

        {/* Availability group */}
        <fieldset className="rounded-lg border border-border p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Availability
          </legend>
          <div className="flex flex-col gap-3 pt-1">
            <AvailabilityToggle
              id="avail-weekdays"
              label="Monday–Friday"
              checked={weekdays}
              onCheckedChange={setWeekdays}
            />
            <AvailabilityToggle
              id="avail-weekends"
              label="Weekends"
              checked={weekends}
              onCheckedChange={setWeekends}
            />
            <AvailabilityToggle
              id="avail-sameday"
              label="Same-day booking"
              checked={sameDay}
              onCheckedChange={setSameDay}
            />
          </div>
        </fieldset>

        {/* Status row */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-foreground">
            <span
              aria-hidden
              className={cn(
                "inline-block size-2 rounded-full",
                active ? "bg-success" : "bg-muted-foreground",
              )}
            />
            Service is currently {active ? "Active" : "Inactive"}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStatus(active ? "inactive" : "active")}
          >
            {active ? "Deactivate" : "Activate"}
          </Button>
        </div>

        <Button type="button" className="w-full">
          Save Changes
        </Button>
      </div>
    </Card>
  );
}
