"use client";

import * as React from "react";
import { listAreas } from "@/lib/admin/areas";
import { CoverageApiError, type AreaResponse } from "@/lib/coverage/types";

/** Areas the server will return in one page (`buildPagination` MAX_LIMIT). */
const AREA_OPTIONS_LIMIT = 100;

interface AreaOptionsSnapshot {
  items: AreaResponse[];
  total: number;
}

/**
 * Module-level cache. The area list is small (12 markets today), read by three
 * different controls on the ZIP screen, and changes only when an admin edits an
 * area — so fetching it once per page load and invalidating explicitly beats
 * refetching per control.
 */
let cache: AreaOptionsSnapshot | null = null;
let inflight: Promise<AreaOptionsSnapshot> | null = null;
/**
 * Bumped by every invalidation. A fetch that started BEFORE an area was renamed
 * or archived must not be allowed to repopulate the cache with the pre-write
 * list — that is how a picker ends up offering a market that no longer accepts
 * ZIP codes.
 */
let generation = 0;

/** Call after any area create/rename/lifecycle change. */
export function invalidateAreaOptions(): void {
  cache = null;
  inflight = null;
  generation += 1;
}

function fetchAreaOptions(): Promise<AreaOptionsSnapshot> {
  const gen = generation;
  inflight ??= listAreas({
    limit: AREA_OPTIONS_LIMIT,
    sortBy: "sortOrder",
    sort: "asc",
  })
    .then((result) => {
      const snapshot = { items: result.items, total: result.meta.total };
      if (gen === generation) cache = snapshot;
      return snapshot;
    })
    .finally(() => {
      if (gen === generation) inflight = null;
    });
  return inflight;
}

export interface AreaOptionsState {
  /** ACTIVE + INACTIVE areas (the server's staff default). */
  areas: AreaResponse[];
  /** Server total, so the UI can admit when the list is capped at 100. */
  total: number;
  truncated: boolean;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * The cached area list behind every area picker on the coverage screens.
 *
 * ARCHIVED areas are deliberately absent: they cannot accept ZIP codes
 * (`ZIP_CODE_AREA_ARCHIVED`), so offering them as a target would only produce a
 * 409 the admin cannot act on from that control.
 */
export function useAreaOptions(): AreaOptionsState {
  const [snapshot, setSnapshot] = React.useState<AreaOptionsSnapshot | null>(cache);
  const [loading, setLoading] = React.useState(cache === null);
  const [error, setError] = React.useState<string | null>(null);
  const [nonce, setNonce] = React.useState(0);

  React.useEffect(() => {
    if (cache !== null) {
      setSnapshot(cache);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    fetchAreaOptions()
      .then((result) => {
        if (!active) return;
        setSnapshot(result);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(
          err instanceof CoverageApiError ? err.message : "Failed to load areas.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  const reload = React.useCallback(() => {
    invalidateAreaOptions();
    setNonce((n) => n + 1);
  }, []);

  return {
    areas: snapshot?.items ?? [],
    total: snapshot?.total ?? 0,
    truncated: snapshot !== null && snapshot.total > snapshot.items.length,
    loading,
    error,
    reload,
  };
}
