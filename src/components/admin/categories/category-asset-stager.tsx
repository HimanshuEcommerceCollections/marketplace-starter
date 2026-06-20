"use client";

import * as React from "react";
import { UploadCloud, Trash2, ImageOff, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ICON,
  COVER,
  kb,
  validateIconFile,
  validateCoverFile,
} from "@/lib/admin/asset-constraints";

/**
 * Controlled staging UI for a category's icon + cover images, used in the
 * create-category flow. It only SELECTS and previews files (client-side
 * validated); the parent uploads them after the category is created, because
 * the asset API is keyed by slug and requires the category to exist first.
 */
export interface CategoryAssetStagerProps {
  icon: File | null;
  onIconChange: (file: File | null) => void;
  covers: File[];
  onCoversChange: (files: File[]) => void;
  /** Surface a validation message to the parent form's error region. */
  onNotice: (message: string) => void;
  disabled?: boolean;
}

export function CategoryAssetStager({
  icon,
  onIconChange,
  covers,
  onCoversChange,
  onNotice,
  disabled,
}: CategoryAssetStagerProps) {
  const iconInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);
  const [iconUrl, setIconUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!icon) {
      setIconUrl(null);
      return;
    }
    const url = URL.createObjectURL(icon);
    setIconUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [icon]);

  function onPickIcon(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const err = validateIconFile(file);
    if (err) return onNotice(err);
    onIconChange(file);
  }

  function onPickCovers(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    const accepted: File[] = [];
    for (const f of files) {
      const err = validateCoverFile(f);
      if (err) {
        onNotice(err);
        continue;
      }
      accepted.push(f);
    }
    const room = Math.max(0, COVER.max - covers.length);
    if (accepted.length > room) {
      accepted.splice(room);
      onNotice(`Only ${room} more image(s) allowed (max ${COVER.max}); extra files were skipped.`);
    }
    if (accepted.length) onCoversChange([...covers, ...accepted]);
  }

  function removeCover(index: number) {
    onCoversChange(covers.filter((_, i) => i !== index));
  }

  const remaining = COVER.max - covers.length;

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-muted/30 p-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Images (optional)</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Added after the category is created. You can also manage them later from
          the category page.
        </p>
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Icon</span>
          <span className="text-xs text-muted-foreground">SVG · max {kb(ICON.maxBytes)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
            {iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- staged icon preview
              <img src={iconUrl} alt="Selected icon preview" className="size-9" />
            ) : (
              <ImageOff className="size-6" aria-hidden />
            )}
          </span>
          <div className="flex flex-col gap-2">
            <input
              ref={iconInputRef}
              type="file"
              accept={ICON.accept}
              className="sr-only"
              onChange={onPickIcon}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => iconInputRef.current?.click()}
              >
                <UploadCloud aria-hidden />
                {icon ? "Replace icon" : "Choose SVG"}
              </Button>
              {icon && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  onClick={() => onIconChange(null)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 aria-hidden />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {icon ? `${icon.name} (${kb(icon.size)})` : "No icon selected."}
            </p>
          </div>
        </div>
      </div>

      {/* Covers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Cover images{" "}
            <span className="font-normal text-muted-foreground">
              ({covers.length}/{COVER.max})
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            WEBP/PNG/JPG · max {kb(COVER.maxBytes)} · 1200×800 (3:2)
          </span>
        </div>

        {covers.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {covers.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="relative overflow-hidden rounded-md border border-border"
              >
                <StagedThumb file={file} />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                    <Star className="size-3" aria-hidden />
                    Default
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  title="Remove"
                  disabled={disabled}
                  onClick={() => removeCover(i)}
                  className="absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded bg-surface-inverse/70 text-surface-inverse-foreground backdrop-blur transition-colors hover:bg-surface-inverse disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        <input
          ref={coverInputRef}
          type="file"
          accept={COVER.accept}
          multiple
          className="sr-only"
          onChange={onPickCovers}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || remaining <= 0}
          onClick={() => coverInputRef.current?.click()}
        >
          <UploadCloud aria-hidden />
          Add images
        </Button>
        {remaining <= 0 && (
          <span className="ml-2 text-xs text-muted-foreground">Maximum reached.</span>
        )}
      </div>
    </div>
  );
}

function StagedThumb({ file }: { file: File }) {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return (
    <div className="aspect-[3/2] w-full bg-muted">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element -- staged cover preview
        <img src={url} alt={file.name} className="h-full w-full object-cover" />
      )}
    </div>
  );
}
