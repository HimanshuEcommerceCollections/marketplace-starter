import * as React from "react";
import { Label } from "@/components/ui/label";

export interface CoverageFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

/**
 * Label / control / error row.
 *
 * A local copy of the `Field` helper that is currently private to
 * `services/service-form.tsx`; extracting that one into a shared
 * `components/admin/field.tsx` belongs to another workstream, so the coverage
 * forms carry their own rather than reaching into a file they do not own.
 */
export function CoverageField({
  label,
  htmlFor,
  error,
  hint,
  required,
  optional,
  children,
}: CoverageFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="flex items-center gap-1.5">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        ) : null}
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
