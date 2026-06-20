/**
 * Client-side mirror of the server's upload.config — limits used to reject bad
 * files before they're sent. Single source of truth for the assets panel and
 * the create-category staging UI so the two never drift.
 */
export const ICON = {
  maxBytes: 50 * 1024,
  accept: ".svg",
  mimes: ["image/svg+xml"] as const,
};

export const COVER = {
  maxBytes: 500 * 1024,
  max: 5,
  accept: ".webp,.png,.jpg,.jpeg",
  mimes: ["image/webp", "image/png", "image/jpeg"] as const,
};

/** Human-friendly KB label, e.g. 51200 -> "50 KB". */
export function kb(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}

/** Lowercased extension including the dot, e.g. ".webp" (or "" if none). */
export function ext(name: string): string {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

/** Validate a candidate icon file; returns an error message or null if valid. */
export function validateIconFile(file: File): string | null {
  if (ext(file.name) !== ".svg" || !ICON.mimes.includes(file.type as never)) {
    return "Icon must be an .svg file.";
  }
  if (file.size > ICON.maxBytes) {
    return `Icon must be ${kb(ICON.maxBytes)} or smaller.`;
  }
  return null;
}

/** Validate a candidate cover file; returns an error message or null if valid. */
export function validateCoverFile(file: File): string | null {
  if (!COVER.mimes.includes(file.type as never) || !COVER.accept.includes(ext(file.name))) {
    return `${file.name}: unsupported image type.`;
  }
  if (file.size > COVER.maxBytes) {
    return `${file.name}: exceeds ${kb(COVER.maxBytes)}.`;
  }
  return null;
}
