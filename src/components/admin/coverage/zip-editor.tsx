"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldErrors } from "@/lib/forms/validate";
import {
  createZipCode,
  updateZipCode,
  type CreateZipCodeInput,
  type UpdateZipCodeInput,
} from "@/lib/admin/zip-codes";
import {
  CoverageApiError,
  type AreaResponse,
  type ZipCodeResponse,
} from "@/lib/coverage/types";
import { AreaSelect } from "./area-select";
import { CoverageAlert, CoverageErrorAlert } from "./coverage-alert";
import { CoverageField } from "./coverage-field";
import { normalizeZipInput } from "./zip-paste";

export interface ZipEditorProps {
  mode: "create" | "edit";
  initial?: ZipCodeResponse;
  areas: AreaResponse[];
  areasLoading?: boolean;
  areasTruncated?: boolean;
  /** Preselected target when creating from a filtered view. */
  defaultAreaId?: string | null;
  onSaved: (zipCode: ZipCodeResponse, mode: "create" | "edit") => void;
  onCancel: () => void;
  /** Restore the ARCHIVED ZIP that already owns this code. */
  onRestoreArchived: (archivedId: string) => void;
}

/**
 * Create or edit one ZIP code, including MOVING it to another area.
 *
 * Two conflict paths matter and both are surfaced, never swallowed:
 *
 *  - `ZIP_CODE_EXISTS` — `zipCode` is unique GLOBALLY, not per area, so the code
 *    already belongs to some other market. The server sends `existingId` +
 *    `areaName`, so the remedy is one click: move that row here.
 *  - `ZIP_MOVE_BLOCKED_BY_COVERAGE` — the composite FK
 *    `ServiceZipCoverage (zipCodeId, areaId)` refuses to let a ZIP leave an area
 *    while any service rule references it there. The server names the services;
 *    the fix is to clear those rules first. The move is REFUSED, not silently
 *    reinterpreted, which is the whole point of that FK.
 */
export function ZipEditor({
  mode,
  initial,
  areas,
  areasLoading,
  areasTruncated,
  defaultAreaId,
  onSaved,
  onCancel,
  onRestoreArchived,
}: ZipEditorProps) {
  const [zipCode, setZipCode] = React.useState(initial?.zipCode ?? "");
  const [city, setCity] = React.useState(initial?.city ?? "");
  const [stateCode, setStateCode] = React.useState(initial?.stateCode ?? "");
  const [areaId, setAreaId] = React.useState<string | null>(
    initial?.area.id ?? defaultAreaId ?? null,
  );
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [apiError, setApiError] = React.useState<CoverageApiError | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const fieldError = (key: string) => errors[key]?.[0];
  const idPrefix = mode === "create" ? "zip-new" : `zip-${initial?.id ?? "edit"}`;

  const movingAway =
    mode === "edit" && initial !== undefined && areaId !== null && areaId !== initial.area.id;
  const targetArea = areaId === null ? null : areas.find((area) => area.id === areaId);

  function resetErrors() {
    setErrors({});
    setApiError(null);
    setFormError(null);
  }

  /**
   * A CODED failure always goes to the alert strip, because that is where the
   * remedy button lives (`ZIP_CODE_EXISTS` -> "Move it here",
   * `ZIP_CODE_ARCHIVED_EXISTS` -> "Restore instead").
   *
   * Only an UNCODED failure is distributed to fields: the zip-codes module sends
   * `{ code, existingId, areaName }` with no per-field sentence, while a zod 422
   * sends `{ path, message }` with no code. Checking `fieldErrors` first would
   * therefore drop the remedy and show a bare validation line instead.
   */
  function applyApiError(err: CoverageApiError) {
    if (err.code === null && Object.keys(err.fieldErrors).length > 0) {
      const { _form, ...rest } = err.fieldErrors;
      setErrors(rest);
      if (_form !== undefined) setFormError(_form[0] ?? err.message);
      else if (Object.keys(rest).length === 0) setFormError(err.message);
      return;
    }
    setApiError(err);
  }

  async function save() {
    if (submitting) return;
    resetErrors();

    const next: FieldErrors = {};
    const normalized = normalizeZipInput(zipCode);
    if (normalized === null) next.zipCode = ["Enter a valid 5-digit ZIP code"];
    const trimmedState = stateCode.trim();
    if (trimmedState !== "" && !/^[A-Za-z]{2}$/.test(trimmedState)) {
      next.stateCode = ["State must be a 2-letter USPS code"];
    }
    if (areaId === null) next.areaId = ["Choose the area this ZIP code belongs to"];
    if (Object.keys(next).length > 0 || normalized === null || areaId === null) {
      setErrors(next);
      return;
    }

    const trimmedCity = city.trim();

    setSubmitting(true);
    try {
      if (mode === "edit" && initial) {
        const patch: UpdateZipCodeInput = {};
        if (normalized !== initial.zipCode) patch.zipCode = normalized;
        if (trimmedCity !== (initial.city ?? "")) {
          patch.city = trimmedCity === "" ? null : trimmedCity;
        }
        if (trimmedState !== "" && trimmedState.toUpperCase() !== initial.stateCode) {
          patch.stateCode = trimmedState;
        }
        if (areaId !== initial.area.id) patch.areaId = areaId;

        if (Object.keys(patch).length === 0) {
          setFormError("Nothing has changed yet.");
          return;
        }
        onSaved(await updateZipCode(initial.id, patch), "edit");
        return;
      }

      const input: CreateZipCodeInput = {
        areaId,
        zipCode: normalized,
        ...(trimmedCity !== "" ? { city: trimmedCity } : {}),
        ...(trimmedState !== "" ? { stateCode: trimmedState } : {}),
      };
      onSaved(await createZipCode(input), "create");
    } catch (err) {
      if (err instanceof CoverageApiError) applyApiError(err);
      else setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /** `ZIP_CODE_EXISTS` remedy: move the row that already owns the code to here. */
  async function moveExisting(existingId: string, target: string) {
    if (submitting) return;
    resetErrors();
    setSubmitting(true);
    try {
      onSaved(await updateZipCode(existingId, { areaId: target }), "edit");
    } catch (err) {
      if (err instanceof CoverageApiError) applyApiError(err);
      else setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // `ZIP_CODE_EXISTS` carries `details.existingId` — the live row that already
  // owns this code — so the dead end becomes a one-click move.
  const existingIdDetail = apiError?.detail("existingId");
  const existingId = typeof existingIdDetail === "string" ? existingIdDetail : null;

  let remedy: React.ReactNode = null;
  if (apiError?.code === "ZIP_CODE_ARCHIVED_EXISTS" && apiError.archivedId !== null) {
    const archivedId = apiError.archivedId;
    remedy = (
      <Button type="button" size="sm" onClick={() => onRestoreArchived(archivedId)}>
        Restore that ZIP code instead
      </Button>
    );
  } else if (
    apiError?.code === "ZIP_CODE_EXISTS" &&
    existingId !== null &&
    areaId !== null
  ) {
    const moveId = existingId;
    const target = areaId;
    remedy = (
      <Button
        type="button"
        size="sm"
        disabled={submitting}
        onClick={() => void moveExisting(moveId, target)}
      >
        Move it to {targetArea?.name ?? "this area"}
      </Button>
    );
  }

  return (
    <Card className="mb-5 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {mode === "create" ? "Add a ZIP code" : `Edit ${initial?.zipCode ?? "ZIP code"}`}
        </h2>
        {mode === "edit" && initial ? (
          <span className="text-xs text-muted-foreground">
            Currently in {initial.area.name}
          </span>
        ) : null}
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        {formError ? (
          <CoverageAlert tone="error" onDismiss={() => setFormError(null)}>
            {formError}
          </CoverageAlert>
        ) : null}

        {apiError ? (
          <CoverageErrorAlert
            error={apiError}
            fallback="Could not save this ZIP code."
            action={remedy}
            onDismiss={() => setApiError(null)}
          />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CoverageField
            label="ZIP code"
            htmlFor={`${idPrefix}-code`}
            error={fieldError("zipCode")}
            hint="5 digits. ZIP+4 is trimmed."
            required
          >
            <Input
              id={`${idPrefix}-code`}
              value={zipCode}
              inputMode="numeric"
              maxLength={10}
              className="font-mono"
              onChange={(event) => setZipCode(event.target.value)}
              placeholder="27601"
              aria-invalid={Boolean(fieldError("zipCode"))}
              autoFocus
            />
          </CoverageField>

          <CoverageField
            label="City"
            htmlFor={`${idPrefix}-city`}
            error={fieldError("city")}
            hint="Display only — never used to resolve an area."
            optional
          >
            <Input
              id={`${idPrefix}-city`}
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Raleigh"
              aria-invalid={Boolean(fieldError("city"))}
            />
          </CoverageField>

          <CoverageField
            label="State"
            htmlFor={`${idPrefix}-state`}
            error={fieldError("stateCode")}
            hint="2-letter USPS code."
            optional
          >
            <Input
              id={`${idPrefix}-state`}
              value={stateCode}
              maxLength={2}
              onChange={(event) => setStateCode(event.target.value.toUpperCase())}
              placeholder="NC"
              aria-invalid={Boolean(fieldError("stateCode"))}
            />
          </CoverageField>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${idPrefix}-area`}>
              Area
              <span className="ml-1.5 text-destructive" aria-hidden>
                *
              </span>
            </Label>
            <AreaSelect
              id={`${idPrefix}-area`}
              ariaLabel="Area this ZIP code belongs to"
              value={areaId}
              onChange={setAreaId}
              areas={areas}
              loading={areasLoading}
              truncated={areasTruncated}
              invalid={Boolean(fieldError("areaId"))}
              size="default"
              className="w-full"
            />
            {fieldError("areaId") ? (
              <p className="text-xs text-destructive">{fieldError("areaId")}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Every ZIP belongs to exactly one area.
              </p>
            )}
          </div>
        </div>

        {movingAway && initial ? (
          <CoverageAlert tone="info">
            <p className="text-foreground">
              This moves {initial.zipCode} from {initial.area.name} to{" "}
              {targetArea?.name ?? "the chosen area"}.
            </p>
            {initial.serviceOverrideCount > 0 ? (
              <p>
                {initial.serviceOverrideCount} service
                {initial.serviceOverrideCount === 1 ? "" : "s"} currently{" "}
                {initial.serviceOverrideCount === 1 ? "has" : "have"} a rule pinned to this
                ZIP code under {initial.area.name}. The move will be refused until those
                rules are cleared — a rule saying &ldquo;exclude {initial.zipCode} from{" "}
                {initial.area.name}&rdquo; must not silently become a rule about{" "}
                {targetArea?.name ?? "another area"}.
              </p>
            ) : (
              <p>
                No service has a rule pinned to this ZIP code, so nothing blocks the move.
                It will inherit {targetArea?.name ?? "the new area"}&apos;s coverage.
              </p>
            )}
          </CoverageAlert>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {mode === "create"
              ? "Add ZIP code"
              : movingAway
                ? "Save and move"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
