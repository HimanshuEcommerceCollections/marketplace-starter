"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FieldErrors } from "@/lib/forms/validate";
import {
  createArea,
  updateArea,
  type CreateAreaInput,
  type UpdateAreaInput,
} from "@/lib/admin/areas";
import { CoverageApiError, type AreaResponse } from "@/lib/coverage/types";
import { CoverageAlert } from "./coverage-alert";
import { CoverageField } from "./coverage-field";

/** Browser-side slug preview only; the server derives and validates the real one. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ArchivedConflict {
  message: string;
  archivedId: string;
  field: string | null;
}

export interface AreaFormProps {
  mode: "create" | "edit";
  initial?: AreaResponse;
  onSaved: (area: AreaResponse, mode: "create" | "edit") => void;
  onCancel: () => void;
  /**
   * The admin chose "Restore instead" after colliding with an ARCHIVED area. The
   * page performs the restore (it owns the list refresh and the selection).
   */
  onRestoreArchived: (archivedId: string) => void;
}

/**
 * Create / edit an area. Two required concepts and three optional ones, so it
 * stays a single column inside the detail pane.
 *
 * The load-bearing behaviour is the ARCHIVED collision. A retired area keeps its
 * name and slug slot forever (the unique indexes are global and archiving frees
 * nothing), so "Raleigh" can collide with a market no list is showing. The server
 * answers that with `AREA_ARCHIVED_EXISTS` + `details.archivedId` precisely so the
 * UI can offer one click out instead of a dead end that needs a support ticket.
 */
export function AreaForm({
  mode,
  initial,
  onSaved,
  onCancel,
  onRestoreArchived,
}: AreaFormProps) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = React.useState(mode === "edit");
  const [stateCode, setStateCode] = React.useState(initial?.stateCode ?? "");
  const [timezone, setTimezone] = React.useState(initial?.timezone ?? "");
  const [sortOrder, setSortOrder] = React.useState(
    initial ? String(initial.sortOrder) : "",
  );
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [archivedConflict, setArchivedConflict] =
    React.useState<ArchivedConflict | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Auto-derive the slug from the name until the admin edits it directly.
  React.useEffect(() => {
    if (!slugEdited) setSlug(slugify(name));
  }, [name, slugEdited]);

  const fieldError = (key: string) => errors[key]?.[0];

  function validate(): (CreateAreaInput & UpdateAreaInput) | null {
    const next: FieldErrors = {};
    const trimmedName = name.trim();
    if (trimmedName.length < 2) next.name = ["Name must be at least 2 characters"];

    const trimmedState = stateCode.trim();
    if (trimmedState !== "" && !/^[A-Za-z]{2}$/.test(trimmedState)) {
      next.stateCode = ["State code must be 2 letters (USPS, e.g. NC)"];
    }

    const trimmedSort = sortOrder.trim();
    let parsedSort: number | undefined;
    if (trimmedSort !== "") {
      const value = Number(trimmedSort);
      if (!Number.isInteger(value)) {
        next.sortOrder = ["Sort order must be a whole number"];
      } else {
        parsedSort = value;
      }
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return null;

    const trimmedSlug = slug.trim();
    const trimmedTimezone = timezone.trim();
    return {
      name: trimmedName,
      ...(trimmedSlug !== "" ? { slug: trimmedSlug } : {}),
      ...(trimmedState !== "" ? { stateCode: trimmedState } : {}),
      ...(trimmedTimezone !== "" ? { timezone: trimmedTimezone } : {}),
      ...(parsedSort !== undefined ? { sortOrder: parsedSort } : {}),
    };
  }

  /**
   * Branch on the server's machine `code` FIRST, never on the human message.
   *
   * `code` and `fieldErrors` are two different failure shapes, not two views of
   * one: the areas module puts a bare `{ code, field, archivedId }` in `errors`
   * with no per-field sentence, while a zod 422 puts `{ path, message }` and no
   * code. So a coded failure is rendered from `err.message` plus the recovery
   * affordance its `details` unlock, and only an UNCODED failure is distributed
   * to fields. Reversing this order swallows every recovery path below.
   */
  function applyApiError(err: CoverageApiError) {
    switch (err.code) {
      case "AREA_ARCHIVED_EXISTS": {
        const archivedId = err.archivedId;
        if (archivedId !== null) {
          const field = err.detail("field");
          setArchivedConflict({
            message: err.message,
            archivedId,
            field: typeof field === "string" ? field : null,
          });
          return;
        }
        setFormError(err.message);
        return;
      }
      case "AREA_NAME_EXISTS":
        setErrors({ name: [err.message] });
        return;
      case "AREA_SLUG_EXISTS":
      case "AREA_SLUG_UNDERIVABLE":
        setErrors({ slug: [err.message] });
        return;
      default:
        break;
    }

    if (err.code === null && Object.keys(err.fieldErrors).length > 0) {
      const { _form, ...rest } = err.fieldErrors;
      setErrors(rest);
      // Only surface a form-level line when there is one, or when nothing landed
      // on a field — otherwise "Validation failed" duplicates the field messages.
      if (_form !== undefined) setFormError(_form[0] ?? err.message);
      else if (Object.keys(rest).length === 0) setFormError(err.message);
      return;
    }
    setFormError(err.message);
  }

  async function submit() {
    if (submitting) return;
    setFormError(null);
    setArchivedConflict(null);
    const input = validate();
    if (!input) return;
    setSubmitting(true);
    try {
      const saved =
        mode === "edit" && initial
          ? await updateArea(initial.id, input)
          : await createArea(input);
      onSaved(saved, mode);
    } catch (err) {
      if (err instanceof CoverageApiError) applyApiError(err);
      else setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const idPrefix = mode === "create" ? "area-new" : `area-${initial?.id ?? "edit"}`;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      {formError ? <CoverageAlert tone="error">{formError}</CoverageAlert> : null}

      {archivedConflict ? (
        <CoverageAlert
          tone="error"
          action={
            <>
              <Button
                type="button"
                size="sm"
                onClick={() => onRestoreArchived(archivedConflict.archivedId)}
              >
                Restore that area instead
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setArchivedConflict(null);
                  setSlugEdited(true);
                }}
              >
                Use a different {archivedConflict.field === "name" ? "name" : "slug"}
              </Button>
            </>
          }
        >
          <p className="font-medium">{archivedConflict.message}</p>
          <p>
            Restoring brings it back paused, with its ZIP codes and service coverage
            intact — then rename or activate it. Creating a second area is almost never
            what you want here.
          </p>
        </CoverageAlert>
      ) : null}

      <CoverageField
        label="Area name"
        htmlFor={`${idPrefix}-name`}
        error={fieldError("name")}
        hint="The town or city customers recognise, e.g. Raleigh."
        required
      >
        <Input
          id={`${idPrefix}-name`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Raleigh"
          aria-invalid={Boolean(fieldError("name"))}
          autoFocus
        />
      </CoverageField>

      <CoverageField
        label="Slug"
        htmlFor={`${idPrefix}-slug`}
        error={fieldError("slug")}
        hint="Auto-generated from the name — edit for a custom URL."
      >
        <Input
          id={`${idPrefix}-slug`}
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value);
            setSlugEdited(true);
          }}
          placeholder="raleigh"
          aria-invalid={Boolean(fieldError("slug"))}
        />
      </CoverageField>

      <div className="grid gap-4 sm:grid-cols-2">
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

        <CoverageField
          label="Sort order"
          htmlFor={`${idPrefix}-sort`}
          error={fieldError("sortOrder")}
          hint="Lower shows first."
          optional
        >
          <Input
            id={`${idPrefix}-sort`}
            value={sortOrder}
            inputMode="numeric"
            onChange={(event) => setSortOrder(event.target.value)}
            placeholder="10"
            aria-invalid={Boolean(fieldError("sortOrder"))}
          />
        </CoverageField>
      </div>

      <CoverageField
        label="Time zone"
        htmlFor={`${idPrefix}-timezone`}
        error={fieldError("timezone")}
        hint="IANA name, e.g. America/New_York. Operating hours will read this."
        optional
      >
        <Input
          id={`${idPrefix}-timezone`}
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
          placeholder="America/New_York"
          aria-invalid={Boolean(fieldError("timezone"))}
        />
      </CoverageField>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {mode === "create" ? "Create area" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
