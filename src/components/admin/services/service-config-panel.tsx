"use client";

import * as React from "react";
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatCents } from "@/lib/admin/format";
import { ServiceApiError } from "@/lib/admin/services";
import {
  listConfigGroups,
  createConfigGroup,
  updateConfigGroup,
  deleteConfigGroup,
  reorderConfigGroups,
  createConfigOption,
  updateConfigOption,
  deleteConfigOption,
  reorderConfigOptions,
  type ConfigGroup,
  type ConfigOption,
  type ConfigSelectionType,
} from "@/lib/admin/service-config";

/** Browser-side key preview; the server validates + enforces uniqueness. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Return the id order after swapping item `index` with its neighbour in `dir`. */
function reordered<T extends { id: string }>(items: T[], index: number, dir: -1 | 1): string[] {
  const next = [...items];
  const j = index + dir;
  if (j < 0 || j >= next.length) return next.map((i) => i.id);
  [next[index], next[j]] = [next[j], next[index]];
  return next.map((i) => i.id);
}

const SELECTION_LABEL: Record<ConfigSelectionType, string> = {
  SINGLE_SELECT: "Single select",
  MULTI_SELECT: "Multi-select",
};

function priceLabel(cents: number): string {
  return cents === 0 ? "No charge" : `+ ${formatCents(cents)}`;
}

export interface ServiceConfigPanelProps {
  serviceId: string;
}

/**
 * Admin Configurations manager for a service: create/edit/delete/reorder
 * configuration groups and their options, toggle ACTIVE/INACTIVE status, and a
 * read-only pricing preview. All mutations re-fetch from the server so the UI
 * always reflects persisted state (including server-enforced rules like
 * "a group needs ≥ 1 option before it can be activated").
 */
export function ServiceConfigPanel({ serviceId }: ServiceConfigPanelProps) {
  const [groups, setGroups] = React.useState<ConfigGroup[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [addingGroup, setAddingGroup] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setGroups(await listConfigGroups(serviceId));
    } catch (err) {
      setError(err instanceof ServiceApiError ? err.message : "Failed to load configurations.");
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  /** Run a mutation with shared busy/error handling, then refresh. */
  const run = React.useCallback(
    async (fn: () => Promise<unknown>) => {
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        await fn();
        await load();
        return true;
      } catch (err) {
        setError(err instanceof ServiceApiError ? err.message : "Something went wrong.");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [busy, load],
  );

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Configurations</h2>
          <p className="text-sm text-muted-foreground">
            Booking options customers choose (e.g. Duration, Add-Ons). A group must have at
            least one option before it can be activated.
          </p>
        </div>
        {!addingGroup ? (
          <Button type="button" size="sm" onClick={() => setAddingGroup(true)} disabled={busy}>
            <Plus aria-hidden />
            Add group
          </Button>
        ) : null}
      </div>

      {error ? (
        <p
          role="alert"
          className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <TriangleAlert className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      {addingGroup ? (
        <div className="mb-4">
          <GroupForm
            busy={busy}
            onCancel={() => setAddingGroup(false)}
            onSubmit={async (values) => {
              const ok = await run(() => createConfigGroup(serviceId, values));
              if (ok) setAddingGroup(false);
            }}
          />
        </div>
      ) : null}

      {loading ? (
        <div className="h-24 animate-pulse rounded-md bg-muted/60" />
      ) : !groups || groups.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No configuration groups yet. Add one to let customers customize this service.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {groups.map((group, gi) => (
            <li key={group.id}>
              <GroupCard
                serviceId={serviceId}
                group={group}
                isFirst={gi === 0}
                isLast={gi === groups.length - 1}
                busy={busy}
                run={run}
                onReorder={(dir) =>
                  run(() => reorderConfigGroups(serviceId, reordered(groups, gi, dir)))
                }
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

interface RunFn {
  (fn: () => Promise<unknown>): Promise<boolean | undefined>;
}

function GroupCard({
  serviceId,
  group,
  isFirst,
  isLast,
  busy,
  run,
  onReorder,
}: {
  serviceId: string;
  group: ConfigGroup;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  run: RunFn;
  onReorder: (dir: -1 | 1) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [addingOption, setAddingOption] = React.useState(false);
  const isActive = group.status === "ACTIVE";
  const canActivate = group.options.length > 0;

  return (
    <div className="rounded-lg border border-border">
      {editing ? (
        <div className="p-4">
          <GroupForm
            initial={group}
            busy={busy}
            onCancel={() => setEditing(false)}
            onSubmit={async (values) => {
              const ok = await run(() => updateConfigGroup(serviceId, group.id, values));
              if (ok) setEditing(false);
            }}
          />
        </div>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">{group.label}</span>
              <Badge variant="secondary">{SELECTION_LABEL[group.selectionType]}</Badge>
              {group.isRequired ? <Badge variant="outline">Required</Badge> : null}
              <Badge variant={isActive ? "success" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {group.options.length} option{group.options.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ReorderButtons isFirst={isFirst} isLast={isLast} busy={busy} onReorder={onReorder} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy || (!isActive && !canActivate)}
              title={!isActive && !canActivate ? "Add at least one option first" : undefined}
              onClick={() =>
                run(() =>
                  updateConfigGroup(serviceId, group.id, {
                    status: isActive ? "INACTIVE" : "ACTIVE",
                  }),
                )
              }
            >
              {isActive ? "Deactivate" : "Activate"}
            </Button>
            <IconButton label="Edit group" busy={busy} onClick={() => setEditing(true)}>
              <Pencil className="size-4" aria-hidden />
            </IconButton>
            <IconButton
              label="Delete group"
              busy={busy}
              onClick={() => {
                if (window.confirm(`Delete "${group.label}" and its options?`)) {
                  void run(() => deleteConfigGroup(serviceId, group.id));
                }
              }}
            >
              <Trash2 className="size-4" aria-hidden />
            </IconButton>
          </div>
        </div>
      )}

      {!editing ? (
        <div className="p-4">
          {group.options.length === 0 ? (
            <p className="mb-3 text-sm text-muted-foreground">No options yet.</p>
          ) : (
            <ul className="mb-3 flex flex-col divide-y divide-border">
              {group.options.map((option, oi) => (
                <OptionRow
                  key={option.id}
                  serviceId={serviceId}
                  groupId={group.id}
                  option={option}
                  isFirst={oi === 0}
                  isLast={oi === group.options.length - 1}
                  busy={busy}
                  run={run}
                  onReorder={(dir) =>
                    run(() =>
                      reorderConfigOptions(serviceId, group.id, reordered(group.options, oi, dir)),
                    )
                  }
                />
              ))}
            </ul>
          )}

          {addingOption ? (
            <OptionForm
              busy={busy}
              onCancel={() => setAddingOption(false)}
              onSubmit={async (values) => {
                const ok = await run(() =>
                  createConfigOption(serviceId, group.id, {
                    key: values.key,
                    label: values.label,
                    priceModifier: values.priceModifier,
                    description: values.description ?? undefined,
                  }),
                );
                if (ok) setAddingOption(false);
              }}
            />
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => setAddingOption(true)}
            >
              <Plus aria-hidden />
              Add option
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function OptionRow({
  serviceId,
  groupId,
  option,
  isFirst,
  isLast,
  busy,
  run,
  onReorder,
}: {
  serviceId: string;
  groupId: string;
  option: ConfigOption;
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  run: RunFn;
  onReorder: (dir: -1 | 1) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const isActive = option.status === "ACTIVE";

  if (editing) {
    return (
      <li className="py-3">
        <OptionForm
          initial={option}
          busy={busy}
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            const ok = await run(() =>
              updateConfigOption(serviceId, groupId, option.id, values),
            );
            if (ok) setEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-2.5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">{option.label}</span>
          <span className="text-sm text-muted-foreground">{priceLabel(option.priceModifier)}</span>
          {!isActive ? <Badge variant="secondary">Inactive</Badge> : null}
        </div>
        {option.description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <ReorderButtons isFirst={isFirst} isLast={isLast} busy={busy} onReorder={onReorder} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() =>
            run(() =>
              updateConfigOption(serviceId, groupId, option.id, {
                status: isActive ? "INACTIVE" : "ACTIVE",
              }),
            )
          }
        >
          {isActive ? "Deactivate" : "Activate"}
        </Button>
        <IconButton label="Edit option" busy={busy} onClick={() => setEditing(true)}>
          <Pencil className="size-4" aria-hidden />
        </IconButton>
        <IconButton
          label="Delete option"
          busy={busy}
          onClick={() => {
            if (window.confirm(`Delete option "${option.label}"?`)) {
              void run(() => deleteConfigOption(serviceId, groupId, option.id));
            }
          }}
        >
          <Trash2 className="size-4" aria-hidden />
        </IconButton>
      </div>
    </li>
  );
}

// ── Inline forms ───────────────────────────────────────────────────────────────

interface GroupFormValues {
  key: string;
  label: string;
  selectionType: ConfigSelectionType;
  isRequired: boolean;
}

function GroupForm({
  initial,
  busy,
  onSubmit,
  onCancel,
}: {
  initial?: ConfigGroup;
  busy: boolean;
  onSubmit: (values: GroupFormValues) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = React.useState(initial?.label ?? "");
  const [selectionType, setSelectionType] = React.useState<ConfigSelectionType>(
    initial?.selectionType ?? "SINGLE_SELECT",
  );
  const [isRequired, setIsRequired] = React.useState(initial?.isRequired ?? false);

  const submit = () => {
    const trimmed = label.trim();
    if (trimmed.length < 1) return;
    onSubmit({
      key: initial?.key ?? slugify(trimmed),
      label: trimmed,
      selectionType,
      isRequired,
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cfg-group-label">Group name</Label>
        <Input
          id="cfg-group-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Duration"
          autoFocus
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Selection type</span>
        <div className="flex gap-2">
          {(["SINGLE_SELECT", "MULTI_SELECT"] as const).map((t) => (
            <Button
              key={t}
              type="button"
              size="sm"
              variant={selectionType === t ? "default" : "outline"}
              onClick={() => setSelectionType(t)}
            >
              {SELECTION_LABEL[t]}
            </Button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          className="size-4 rounded border-border accent-primary"
          checked={isRequired}
          onChange={(e) => setIsRequired(e.target.checked)}
        />
        Required (customer must choose)
      </label>
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={submit} disabled={busy || label.trim().length < 1}>
          {initial ? "Save group" : "Add group"}
        </Button>
      </div>
    </div>
  );
}

interface OptionFormValues {
  key: string;
  label: string;
  priceModifier: number;
  description?: string | null;
}

function OptionForm({
  initial,
  busy,
  onSubmit,
  onCancel,
}: {
  initial?: ConfigOption;
  busy: boolean;
  onSubmit: (values: OptionFormValues) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = React.useState(initial?.label ?? "");
  const [price, setPrice] = React.useState(
    initial ? (initial.priceModifier / 100).toString() : "0",
  );
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [localError, setLocalError] = React.useState<string | null>(null);

  const submit = () => {
    const trimmed = label.trim();
    if (trimmed.length < 1) return;
    const dollars = Number.parseFloat(price || "0");
    const priceModifier = Number.isFinite(dollars) ? Math.round(dollars * 100) : NaN;
    if (!Number.isFinite(priceModifier) || priceModifier < 0) {
      setLocalError("Price modifier must be zero or greater.");
      return;
    }
    const trimmedDescription = description.trim();
    onSubmit({
      key: initial?.key ?? slugify(trimmed),
      label: trimmed,
      priceModifier,
      description: trimmedDescription ? trimmedDescription : initial ? null : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-4">
      {localError ? <p className="text-xs text-destructive">{localError}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cfg-option-label">Option name</Label>
          <Input
            id="cfg-option-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. 60 Minutes"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cfg-option-price" className="flex items-center gap-1.5">
            Price modifier (USD)
          </Label>
          <Input
            id="cfg-option-price"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cfg-option-desc" className="flex items-center gap-1.5">
          Description
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="cfg-option-desc"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short note shown with this option"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={submit} disabled={busy || label.trim().length < 1}>
          {initial ? "Save option" : "Add option"}
        </Button>
      </div>
    </div>
  );
}

// ── Shared bits ──────────────────────────────────────────────────────────────

function ReorderButtons({
  isFirst,
  isLast,
  busy,
  onReorder,
}: {
  isFirst: boolean;
  isLast: boolean;
  busy: boolean;
  onReorder: (dir: -1 | 1) => void;
}) {
  return (
    <>
      <IconButton label="Move up" busy={busy || isFirst} onClick={() => onReorder(-1)}>
        <ChevronUp className="size-4" aria-hidden />
      </IconButton>
      <IconButton label="Move down" busy={busy || isLast} onClick={() => onReorder(1)}>
        <ChevronDown className="size-4" aria-hidden />
      </IconButton>
    </>
  );
}

function IconButton({
  label,
  busy,
  onClick,
  children,
}: {
  label: string;
  busy: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      disabled={busy}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
