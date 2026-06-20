"use client";

import * as React from "react";
import {
  UploadCloud,
  Trash2,
  ImageOff,
  ArrowUp,
  ArrowDown,
  Star,
  TriangleAlert,
  CheckCircle2,
  X,
  GripVertical,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CategoryApiError } from "@/lib/admin/categories";
import {
  getCategoryAssets,
  createCategoryAssets,
  updateCategoryAssets,
  deleteCategoryAssets,
  deleteCategoryCover,
  reorderCategoryCovers,
  coverFilename,
  type CategoryAssets,
  type UploadProgress,
} from "@/lib/admin/category-assets";
import {
  ICON,
  COVER,
  kb,
  validateIconFile,
  validateCoverFile,
} from "@/lib/admin/asset-constraints";

type Notice = { kind: "success" | "error"; message: string } | null;

export function CategoryAssetsPanel({ slug }: { slug: string }) {
  const [assets, setAssets] = React.useState<CategoryAssets | null>(null);
  const [covers, setCovers] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<Notice>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<number | null>(null);

  // Staged (not-yet-uploaded) selections.
  const [pendingIcon, setPendingIcon] = React.useState<File | null>(null);
  const [pendingIconUrl, setPendingIconUrl] = React.useState<string | null>(null);
  const [pendingCovers, setPendingCovers] = React.useState<File[]>([]);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const iconInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const apply = React.useCallback((next: CategoryAssets) => {
    setAssets(next);
    setCovers(next.coverImages);
  }, []);

  const load = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      apply(await getCategoryAssets(slug));
    } catch (err) {
      setLoadError(
        err instanceof CategoryApiError ? err.message : "Failed to load assets.",
      );
    } finally {
      setLoading(false);
    }
  }, [slug, apply]);

  React.useEffect(() => {
    void load();
  }, [load]);

  // Revoke the object URL when the staged icon changes / unmounts.
  React.useEffect(() => {
    return () => {
      if (pendingIconUrl) URL.revokeObjectURL(pendingIconUrl);
    };
  }, [pendingIconUrl]);

  function fail(err: unknown) {
    setNotice({
      kind: "error",
      message:
        err instanceof CategoryApiError ? err.message : "Something went wrong.",
    });
  }

  /** Run a mutation with shared busy/notice/progress handling. */
  async function run(
    fn: () => Promise<CategoryAssets>,
    successMessage: string,
    withProgress = false,
  ) {
    setBusy(true);
    setNotice(null);
    if (withProgress) setProgress(0);
    try {
      apply(await fn());
      setNotice({ kind: "success", message: successMessage });
      return true;
    } catch (err) {
      fail(err);
      return false;
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  // POST (create) when the category has no assets yet; PUT (update) thereafter.
  function sendAssets(form: FormData, opts?: UploadProgress) {
    const empty = !assets?.iconPath && (assets?.coverImages.length ?? 0) === 0;
    return (empty ? createCategoryAssets : updateCategoryAssets)(slug, form, opts);
  }

  // ---- Icon ---------------------------------------------------------------
  function onPickIcon(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    const err = validateIconFile(file);
    if (err) {
      setNotice({ kind: "error", message: err });
      return;
    }
    if (pendingIconUrl) URL.revokeObjectURL(pendingIconUrl);
    setPendingIcon(file);
    setPendingIconUrl(URL.createObjectURL(file));
    setNotice(null);
  }

  function clearPendingIcon() {
    if (pendingIconUrl) URL.revokeObjectURL(pendingIconUrl);
    setPendingIcon(null);
    setPendingIconUrl(null);
  }

  async function uploadIcon() {
    if (!pendingIcon) return;
    const form = new FormData();
    form.append("icon", pendingIcon);
    const ok = await run(
      () => sendAssets(form, { onProgress: setProgress }),
      "Icon uploaded.",
      true,
    );
    if (ok) clearPendingIcon();
  }

  async function removeIcon() {
    const form = new FormData();
    form.append("removeIcon", "true");
    await run(() => updateCategoryAssets(slug, form), "Icon removed.");
  }

  // ---- Covers -------------------------------------------------------------
  function onPickCovers(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    const accepted: File[] = [];
    for (const f of files) {
      const err = validateCoverFile(f);
      if (err) {
        setNotice({ kind: "error", message: err });
        continue;
      }
      accepted.push(f);
    }
    const room = Math.max(0, COVER.max - covers.length - pendingCovers.length);
    const truncated = accepted.length > room;
    if (truncated) accepted.splice(room);

    if (accepted.length) {
      setPendingCovers((prev) => [...prev, ...accepted]);
      // Only clear an earlier error if nothing was skipped; otherwise explain
      // the partial accept so the message and behavior don't contradict.
      setNotice(
        truncated
          ? {
              kind: "error",
              message: `Only ${room} more image(s) allowed (max ${COVER.max}); extra files were skipped.`,
            }
          : null,
      );
    } else if (room === 0) {
      setNotice({
        kind: "error",
        message: `Maximum of ${COVER.max} cover images reached — delete one to add more.`,
      });
    }
  }

  function removePendingCover(index: number) {
    setPendingCovers((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadCovers() {
    if (!pendingCovers.length) return;
    const form = new FormData();
    for (const c of pendingCovers) form.append("covers", c);
    const ok = await run(
      () => sendAssets(form, { onProgress: setProgress }),
      `${pendingCovers.length} cover image(s) uploaded.`,
      true,
    );
    if (ok) setPendingCovers([]);
  }

  async function deleteCover(coverUrl: string) {
    await run(
      () => deleteCategoryCover(slug, coverFilename(coverUrl)),
      "Cover image deleted.",
    );
  }

  async function persistOrder(next: string[]) {
    const prev = covers; // last server-confirmed order
    setCovers(next); // optimistic
    const ok = await run(() => reorderCategoryCovers(slug, next), "Cover order updated.");
    if (!ok) setCovers(prev); // roll back so the UI matches the server on failure
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= covers.length || from === to) return;
    const next = [...covers];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    void persistOrder(next);
  }

  function onDrop(target: number) {
    if (dragIndex === null) return;
    move(dragIndex, target);
    setDragIndex(null);
  }

  async function deleteAll() {
    if (
      !window.confirm(
        "Delete the icon and all cover images for this category? This cannot be undone.",
      )
    ) {
      return;
    }
    const ok = await run(() => deleteCategoryAssets(slug), "All assets deleted.");
    if (ok) {
      clearPendingIcon();
      setPendingCovers([]);
    }
  }

  if (loading) {
    return <Card className="h-40 animate-pulse bg-muted/60" />;
  }
  if (loadError) {
    return (
      <Card className="flex items-center gap-2 px-4 py-6 text-sm text-destructive">
        <TriangleAlert className="size-4 shrink-0" aria-hidden />
        {loadError}
      </Card>
    );
  }

  const hasIcon = Boolean(assets?.iconPath);
  const remaining = COVER.max - covers.length - pendingCovers.length;

  return (
    <Card className="space-y-6 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Category assets
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Icon and cover images shown on the marketplace. Managed on the
            filesystem — not the database.
          </p>
        </div>
        {(hasIcon || covers.length > 0) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => void deleteAll()}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 aria-hidden />
            Delete all
          </Button>
        )}
      </div>

      {notice && (
        <p
          role="status"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
            notice.kind === "success"
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {notice.kind === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
          ) : (
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
          )}
          {notice.message}
        </p>
      )}

      {progress !== null && (
        <div aria-label="Upload progress">
          <Progress value={progress} />
        </div>
      )}

      {/* Icon ---------------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Icon</h3>
          <span className="text-xs text-muted-foreground">
            SVG · max {kb(ICON.maxBytes)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <IconPreview url={pendingIconUrl ?? assets?.iconPath ?? null} />
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
                disabled={busy}
                onClick={() => iconInputRef.current?.click()}
              >
                <UploadCloud aria-hidden />
                {hasIcon ? "Replace icon" : "Choose SVG"}
              </Button>
              {pendingIcon && (
                <Button type="button" size="sm" disabled={busy} onClick={() => void uploadIcon()}>
                  Upload icon
                </Button>
              )}
              {pendingIcon && (
                <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={clearPendingIcon}>
                  Cancel
                </Button>
              )}
              {hasIcon && !pendingIcon && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() => void removeIcon()}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 aria-hidden />
                  Delete icon
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingIcon
                ? `Selected: ${pendingIcon.name} (${kb(pendingIcon.size)}) — not yet saved`
                : hasIcon
                  ? "Showing the uploaded icon."
                  : "No icon uploaded — the default placeholder is used."}
            </p>
          </div>
        </div>
      </section>

      {/* Covers -------------------------------------------------------------- */}
      <section className="space-y-3 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Cover images{" "}
            <span className="font-normal text-muted-foreground">
              ({covers.length}/{COVER.max})
            </span>
          </h3>
          <span className="text-xs text-muted-foreground">
            WEBP/PNG/JPG · max {kb(COVER.maxBytes)} · 1200×800 (3:2)
          </span>
        </div>

        {covers.length === 0 && pendingCovers.length === 0 ? (
          <div className="flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            <ImageOff className="size-4 shrink-0" aria-hidden />
            No cover images yet. The default placeholder is used until you add
            one.
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {covers.map((url, i) => (
              <li
                key={url}
                draggable={!busy}
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(i)}
                className={cn(
                  "group relative overflow-hidden rounded-md border border-border bg-muted",
                  dragIndex === i && "opacity-50",
                )}
              >
                <CoverThumb url={url} index={i} />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-primary px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                    <Star className="size-3" aria-hidden />
                    Default
                  </span>
                )}
                <div className="absolute right-1.5 top-1.5 flex gap-1">
                  <IconButton
                    label="Delete cover"
                    disabled={busy}
                    onClick={() => void deleteCover(url)}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </IconButton>
                </div>
                <div className="flex items-center justify-between gap-1 bg-surface-inverse/0 px-1.5 py-1">
                  <span className="inline-flex items-center text-muted-foreground">
                    <GripVertical className="size-3.5 cursor-grab" aria-hidden />
                  </span>
                  <span className="flex gap-1">
                    <IconButton label="Move left" disabled={busy || i === 0} onClick={() => move(i, i - 1)}>
                      <ArrowUp className="size-3.5 -rotate-90" aria-hidden />
                    </IconButton>
                    <IconButton
                      label="Move right"
                      disabled={busy || i === covers.length - 1}
                      onClick={() => move(i, i + 1)}
                    >
                      <ArrowDown className="size-3.5 -rotate-90" aria-hidden />
                    </IconButton>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pending (not-yet-uploaded) covers */}
        {pendingCovers.length > 0 && (
          <div className="space-y-2 rounded-md border border-dashed border-highlight/50 bg-highlight/5 p-3">
            <p className="text-xs font-medium text-foreground">
              {pendingCovers.length} image(s) ready to upload
            </p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pendingCovers.map((file, i) => (
                <li key={`${file.name}-${i}`} className="relative overflow-hidden rounded-md border border-border">
                  <PendingThumb file={file} />
                  <div className="absolute right-1.5 top-1.5">
                    <IconButton label="Remove" disabled={busy} onClick={() => removePendingCover(i)}>
                      <X className="size-3.5" aria-hidden />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Button type="button" size="sm" disabled={busy} onClick={() => void uploadCovers()}>
                <UploadCloud aria-hidden />
                Upload {pendingCovers.length} image(s)
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => setPendingCovers([])}>
                Clear
              </Button>
            </div>
          </div>
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
          disabled={busy || remaining <= 0}
          onClick={() => coverInputRef.current?.click()}
        >
          <UploadCloud aria-hidden />
          Add images
        </Button>
        {remaining <= 0 && (
          <span className="ml-2 text-xs text-muted-foreground">
            Maximum reached — delete an image to add more.
          </span>
        )}
      </section>
    </Card>
  );
}

function IconPreview({ url }: { url: string | null }) {
  return (
    <span className="flex size-16 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin asset preview
        <img src={url} alt="Category icon preview" className="size-9" />
      ) : (
        <ImageOff className="size-6" aria-hidden />
      )}
    </span>
  );
}

function CoverThumb({ url, index }: { url: string; index: number }) {
  return (
    <div className="aspect-[3/2] w-full">
      {/* eslint-disable-next-line @next/next/no-img-element -- admin asset preview */}
      <img
        src={url}
        alt={`Cover image ${index + 1}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

function PendingThumb({ file }: { file: File }) {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return (
    <div className="aspect-[3/2] w-full bg-muted">
      {url && (
        // eslint-disable-next-line @next/next/no-img-element -- staged upload preview
        <img src={url} alt={file.name} className="h-full w-full object-cover" />
      )}
    </div>
  );
}

function IconButton({
  label,
  children,
  disabled,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-7 items-center justify-center rounded bg-surface-inverse/70 text-surface-inverse-foreground backdrop-blur transition-colors hover:bg-surface-inverse disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  );
}
