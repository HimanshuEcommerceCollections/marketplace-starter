import * as React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { GeoStatus } from "@/lib/coverage/types";

type Variant = NonNullable<BadgeProps["variant"]>;

/**
 * GeoStatus → Badge variant + label.
 *
 * "Paused" rather than "Inactive": INACTIVE is a reversible kill switch that
 * makes everything beneath the row unbookable while keeping every setting, and
 * the word has to say that. "Archived" is the soft delete.
 *
 * Lives here rather than in `@/lib/admin/status.ts` beside `serviceStatusBadge`
 * because that module and `status-pill.tsx` belong to another workstream — see
 * the handoff note about promoting these three exports.
 */
export function geoStatusBadge(status: GeoStatus): { variant: Variant; label: string } {
  switch (status) {
    case "ACTIVE":
      return { variant: "success", label: "Active" };
    case "INACTIVE":
      return { variant: "warning", label: "Paused" };
    case "ARCHIVED":
      return { variant: "destructive", label: "Archived" };
  }
}

export function GeoStatusPill({ status }: { status: GeoStatus }) {
  const { variant, label } = geoStatusBadge(status);
  return <Badge variant={variant}>{label}</Badge>;
}

/**
 * Mirrors the server's `ALLOWED_TRANSITIONS` for Areas and ZIP codes, so the UI
 * only ever offers a transition the API will accept. ARCHIVED has exactly one way
 * out and it is `/restore` — which is what keeps the state space at three.
 */
export const GEO_TRANSITIONS: Record<GeoStatus, GeoStatus[]> = {
  ACTIVE: ["INACTIVE", "ARCHIVED"],
  INACTIVE: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: ["ACTIVE"],
};

/** Verb for moving a row from `from` to `to`. */
export function geoTransitionLabel(from: GeoStatus, to: GeoStatus): string {
  if (from === "ARCHIVED") return "Restore";
  switch (to) {
    case "ACTIVE":
      return "Activate";
    case "INACTIVE":
      return "Pause";
    case "ARCHIVED":
      return "Archive";
  }
}
