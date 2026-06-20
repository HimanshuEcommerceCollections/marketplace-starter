"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/admin/types";
import type { FieldErrors } from "@/lib/forms/validate";
import {
  createCategory,
  updateCategory,
  CategoryApiError,
} from "@/lib/admin/categories";
import { createCategoryAssets } from "@/lib/admin/category-assets";
import { CategoryAssetStager } from "./category-asset-stager";

/** Browser-side slug preview; the server is the source of truth on save. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CategoryFormProps {
  mode: "create" | "edit";
  initial?: Category;
}

export function CategoryForm({ mode, initial }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = React.useState(initial?.name ?? "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = React.useState(mode === "edit");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [price, setPrice] = React.useState(
    initial ? (initial.basePrice / 100).toString() : "",
  );
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  // Staged assets (create flow only): selected now, uploaded after the category
  // is created since the asset API is keyed by slug.
  const [pendingIcon, setPendingIcon] = React.useState<File | null>(null);
  const [pendingCovers, setPendingCovers] = React.useState<File[]>([]);
  // Set if the category was created but its images failed to upload — the
  // category exists, so we offer a link to its page instead of re-creating.
  const [createdId, setCreatedId] = React.useState<string | null>(null);

  // Auto-derive the slug from the name until the user edits it directly.
  React.useEffect(() => {
    if (!slugEdited) setSlug(slugify(name));
  }, [name, slugEdited]);

  const fieldError = (key: string) => errors[key]?.[0];

  function validate(): { basePrice: number } | null {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = ["Name must be at least 2 characters"];
    const dollars = Number.parseFloat(price);
    const basePrice = Number.isFinite(dollars) ? Math.round(dollars * 100) : NaN;
    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      next.basePrice = ["Base price must be greater than 0"];
    }
    setErrors(next);
    return Object.keys(next).length === 0 ? { basePrice } : null;
  }

  function applyApiError(err: CategoryApiError) {
    if (Object.keys(err.fieldErrors).length > 0) {
      setErrors(err.fieldErrors);
      return;
    }
    // 409 conflicts arrive as a message only — route to the likely field.
    if (/name/i.test(err.message)) setErrors({ name: [err.message] });
    else if (/slug/i.test(err.message)) setErrors({ slug: [err.message] });
    else setFormError(err.message);
  }

  async function submit(publish: boolean) {
    if (submitting || createdId) return; // category already created; don't duplicate
    setFormError(null);
    const valid = validate();
    if (!valid) return;
    setSubmitting(true);
    try {
      const trimmedDescription = description.trim();
      if (mode === "edit") {
        const result = await updateCategory(initial!.id, {
          name: name.trim(),
          slug: slug || undefined,
          description: trimmedDescription ? trimmedDescription : null,
          basePrice: valid.basePrice,
        });
        router.push(`/admin/categories/${result.id}`);
        router.refresh();
        return;
      }

      const created = await createCategory({
        name: name.trim(),
        slug: slug || undefined,
        description: trimmedDescription || undefined,
        basePrice: valid.basePrice,
        publish,
      });

      // Upload any staged icon/covers now that the category (and its slug) exist.
      if (pendingIcon || pendingCovers.length > 0) {
        const assetForm = new FormData();
        if (pendingIcon) assetForm.append("icon", pendingIcon);
        for (const cover of pendingCovers) assetForm.append("covers", cover);
        try {
          await createCategoryAssets(created.slug, assetForm);
        } catch (assetErr) {
          // The category was created; only the images failed. Don't lose it —
          // surface the error and offer a link to its page to retry there.
          setCreatedId(created.id);
          setFormError(
            assetErr instanceof CategoryApiError
              ? `Category created, but the images failed to upload: ${assetErr.message}. Open the category to add them.`
              : "Category created, but the images failed to upload. Open the category to add them.",
          );
          setSubmitting(false);
          return;
        }
      }

      router.push(`/admin/categories/${created.id}`);
      router.refresh();
    } catch (err) {
      if (err instanceof CategoryApiError) applyApiError(err);
      else setFormError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(false);
        }}
      >
        {formError ? (
          <p
            role="alert"
            className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {formError}
          </p>
        ) : null}

        <Field label="Name" htmlFor="cat-name" error={fieldError("name")} required>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bodywork"
            aria-invalid={Boolean(fieldError("name"))}
            autoFocus
          />
        </Field>

        <Field
          label="Slug"
          htmlFor="cat-slug"
          error={fieldError("slug")}
          hint="Auto-generated from the name — edit if you need a custom URL."
        >
          <Input
            id="cat-slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            placeholder="bodywork"
            aria-invalid={Boolean(fieldError("slug"))}
          />
        </Field>

        <Field
          label="Description"
          htmlFor="cat-description"
          error={fieldError("description")}
          optional
        >
          <Textarea
            id="cat-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description shown to customers (optional)"
          />
        </Field>

        <Field
          label="Base price (USD)"
          htmlFor="cat-price"
          error={fieldError("basePrice")}
          hint="Starting price for the category."
          required
        >
          <Input
            id="cat-price"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="75.00"
            aria-invalid={Boolean(fieldError("basePrice"))}
          />
        </Field>

        {mode === "create" ? (
          <CategoryAssetStager
            icon={pendingIcon}
            onIconChange={setPendingIcon}
            covers={pendingCovers}
            onCoversChange={setPendingCovers}
            onNotice={setFormError}
            disabled={submitting || createdId !== null}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {createdId ? (
            // Category was created but image upload failed — let the user open it.
            <Button asChild type="button">
              <Link href={`/admin/categories/${createdId}`}>Go to category</Link>
            </Button>
          ) : (
            <>
              <Button asChild type="button" variant="ghost">
                <Link href="/admin/categories">Cancel</Link>
              </Button>
              {mode === "create" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitting}
                    onClick={() => void submit(false)}
                  >
                    Save as Draft
                  </Button>
                  <Button type="button" disabled={submitting} onClick={() => void submit(true)}>
                    Publish
                  </Button>
                </>
              ) : (
                <Button type="submit" disabled={submitting}>
                  Save Changes
                </Button>
              )}
            </>
          )}
        </div>
      </form>
    </Card>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

function Field({ label, htmlFor, error, hint, required, optional, children }: FieldProps) {
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
