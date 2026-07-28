"use client";

import * as React from "react";
import { Check, MoreHorizontal, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CoverageConfirmDialog } from "@/components/admin/coverage/coverage-confirm-dialog";
import type { CoverageAreaEntry } from "@/lib/coverage/types";
import {
  fallbackSummaryLine,
  modeBadgeLabel,
  modeGlyph,
  removeConfirmCopy,
  zipCountLabel,
} from "./coverage-copy";

export interface CoverageAreaCardProps {
  entry: CoverageAreaEntry;
  serviceName: string;
  serviceIsLive: boolean;
  expanded: boolean;
  /** This card's save is in flight. */
  saving: boolean;
  /** Transient confirmation after a successful save. */
  justSaved: boolean;
  /** Another card is saving, or a version conflict is unresolved. */
  disabled: boolean;
  /** A market being added: it has no server-computed counts yet. */
  pending?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onRemove: () => void;
  /** The expanded editor. */
  children?: React.ReactNode;
}

/**
 * One market, one row.
 *
 * The subtitle is `entry.summaryLine` — server-authored prose, rendered
 * verbatim. That is deliberate and load-bearing: the moment the client composes
 * the sentence out of mode + list length, the first change to the resolution
 * rules makes this screen lie, and coverage lies stay invisible until a customer
 * cannot book. Same for the "12 of 14 ZIP codes" pair, which only formats two
 * numbers the server rolled up.
 */
export function CoverageAreaCard({
  entry,
  serviceName,
  serviceIsLive,
  expanded,
  saving,
  justSaved,
  disabled,
  pending = false,
  onEdit,
  onCancel,
  onRemove,
  children,
}: CoverageAreaCardProps) {
  const [confirmingRemove, setConfirmingRemove] = React.useState(false);
  const editorId = `${React.useId()}-editor`;
  const summary = entry.summaryLine || fallbackSummaryLine(entry);
  const confirm = removeConfirmCopy(entry, serviceName, serviceIsLive);
  const removable = !pending && entry.mode !== "NONE";

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span aria-hidden className="text-sm leading-none text-primary">
              {modeGlyph(entry.mode)}
            </span>
            <span className="font-medium text-foreground">{entry.name}</span>
            {!pending ? (
              <Badge variant="outline">{modeBadgeLabel(entry.mode)}</Badge>
            ) : null}
            {entry.status === "INACTIVE" ? (
              <Badge variant="warning">Area paused</Badge>
            ) : entry.status === "ARCHIVED" ? (
              <Badge variant="destructive">Area archived</Badge>
            ) : null}
            {pending ? <Badge variant="secondary">Not saved yet</Badge> : null}
            {justSaved ? (
              <span
                role="status"
                className="inline-flex items-center gap-1 text-xs font-medium text-success"
              >
                <Check className="size-3.5" aria-hidden />
                Saved
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!pending ? (
            <span className="text-sm tabular-nums text-muted-foreground">
              {zipCountLabel(entry)}
            </span>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={expanded}
            // Only claim to control the region while it is on the page.
            aria-controls={expanded ? editorId : undefined}
            disabled={disabled && !expanded}
            onClick={expanded ? onCancel : onEdit}
          >
            {expanded ? "Close" : "Edit"}
            <span className="sr-only"> {entry.name} coverage</span>
          </Button>
          {removable ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`More actions for ${entry.name}`}
                  disabled={disabled || saving}
                >
                  <MoreHorizontal className="size-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setConfirmingRemove(true)}>
                  Remove from coverage
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {entry.warning ? (
        <p className="flex items-start gap-2 border-t border-border bg-warning/10 px-4 py-2.5 text-xs text-foreground">
          <TriangleAlert
            className="mt-0.5 size-3.5 shrink-0 text-warning"
            aria-hidden
          />
          {entry.warning}
        </p>
      ) : null}

      {/*
        A real modal, not the inline strip this used to be. The strip's stated
        justification ("there is no dialog primitive in this repo") stopped being
        true once `CoverageConfirmDialog` landed on `@radix-ui/react-dialog`, and
        without a focus trap the destructive question could be left hanging while
        the admin expanded the editor or opened another card's menu — then
        answered against a context that had moved.
      */}
      <CoverageConfirmDialog
        open={confirmingRemove}
        title={confirm.title}
        body={confirm.body}
        confirmLabel={confirm.confirmLabel}
        destructive
        busy={saving}
        confirmDisabled={disabled}
        onConfirm={() => {
          setConfirmingRemove(false);
          onRemove();
        }}
        onCancel={() => setConfirmingRemove(false)}
      />

      {expanded ? (
        <div id={editorId} role="group" aria-label={`${entry.name} coverage`}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
