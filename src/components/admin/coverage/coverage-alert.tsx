"use client";

import * as React from "react";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CoverageApiError } from "@/lib/coverage/types";

export type CoverageAlertTone = "error" | "success" | "info";

const TONE: Record<CoverageAlertTone, { wrapper: string; icon: string }> = {
  error: { wrapper: "bg-destructive/10 text-destructive", icon: "text-destructive" },
  success: { wrapper: "bg-success/10 text-foreground", icon: "text-success" },
  info: { wrapper: "bg-muted text-muted-foreground", icon: "text-muted-foreground" },
};

export interface CoverageAlertProps {
  tone: CoverageAlertTone;
  children: React.ReactNode;
  /** An inline remedy, e.g. "Restore instead" — the whole point of the codes. */
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

/**
 * The one place coverage feedback renders. Errors and results always appear in
 * the same strip at the top of the panel (`role="alert"` for errors,
 * `role="status"` for outcomes) — there is no toast system in this repo and
 * adding one here would be scope creep.
 */
export function CoverageAlert({
  tone,
  children,
  action,
  onDismiss,
  className,
}: CoverageAlertProps) {
  const Icon = tone === "error" ? TriangleAlert : tone === "success" ? CircleCheck : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-md px-3 py-2 text-sm",
        TONE[tone].wrapper,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", TONE[tone].icon)} aria-hidden />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="space-y-1">{children}</div>
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
      {onDismiss ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Dismiss"
          className="-my-1 -mr-1 size-8 shrink-0"
          onClick={onDismiss}
        >
          <X className="size-4" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}

export interface CoverageErrorAlertProps {
  /** A `CoverageApiError` (rendered verbatim) or any thrown value. */
  error: unknown;
  fallback: string;
  action?: React.ReactNode;
  onDismiss?: () => void;
}

/**
 * Renders the SERVER's message verbatim, never a paraphrase, plus the structured
 * detail the server bothered to send: the services that blocked a move, and the
 * remedy for each. Swallowing these is how "the rules look right but the customer
 * can't book" tickets get made.
 */
export function CoverageErrorAlert({
  error,
  fallback,
  action,
  onDismiss,
}: CoverageErrorAlertProps) {
  const api = error instanceof CoverageApiError ? error : null;
  const message = api?.message ?? fallback;
  const blocking = api?.blockingServices ?? [];
  /**
   * Form-level lines belong to an UNCODED failure only (a zod 422 whose issue
   * carries no `path`). A coded 4xx is rendered from `message` plus the remedy
   * built from `details`, so echoing `_form` there would only repeat the
   * headline. Never echo the headline back either way.
   */
  const formErrors =
    api !== null && api.code === null
      ? (api.fieldErrors._form ?? []).filter((line) => line !== message)
      : [];

  return (
    <CoverageAlert tone="error" action={action} onDismiss={onDismiss}>
      <p className="font-medium">{message}</p>
      {formErrors.map((line) => (
        <p key={line}>{line}</p>
      ))}
      {/* Coordinators reach this section (the /admin guard is staff-wide) but
          `/areas/:id/{archive,restore}` and `/zip-codes/:id/{archive,restore}`
          are admin-only upstream. Naming the gate turns a bare "Forbidden" into
          something the coordinator can act on. */}
      {api?.status === 403 ? (
        <p>
          Archiving and restoring are limited to system admins. Pause it instead, or
          ask an admin to run this.
        </p>
      ) : null}
      {blocking.length > 0 ? (
        <>
          <p>
            Blocked by {blocking.length} service
            {blocking.length === 1 ? "" : "s"} with a rule pinned to this ZIP code:
          </p>
          <ul className="list-inside list-disc">
            {blocking.map((service) => (
              <li key={service.id}>
                {service.name}
                {service.effect === "DENY"
                  ? " — this ZIP is excluded"
                  : service.effect === "ALLOW"
                    ? " — this ZIP is opted in"
                    : ""}
              </li>
            ))}
          </ul>
          <p>
            Remedy: open each service&apos;s Coverage tab, clear that ZIP code from its
            current area&apos;s rules, then move the ZIP.
          </p>
        </>
      ) : null}
      {api?.code === "ZIP_MOVE_BLOCKED_BY_COVERAGE" && blocking.length === 0 ? (
        <p>
          Remedy: clear this ZIP code&apos;s per-service rules under its current area,
          then move it.
        </p>
      ) : null}
    </CoverageAlert>
  );
}
