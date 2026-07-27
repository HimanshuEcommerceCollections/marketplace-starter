"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CoverageConfirmDialogProps {
  open: boolean;
  title: string;
  /** Blast-radius copy. Pass a node so the caller can show a loading pulse. */
  body: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  /**
   * When set, the admin must type this value exactly before Confirm enables.
   * Set it only when the action has real blast radius — friction proportional to
   * consequence, or it just trains people to click through.
   */
  requireTypedValue?: string;
  busy?: boolean;
  /** Disables Confirm while fresh counts are still loading. */
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirm dialog for coverage lifecycle actions.
 *
 * Built directly on the installed `@radix-ui/react-dialog` (focus trap, Escape,
 * scroll lock, `aria-modal`) rather than on a `ui/dialog.tsx` wrapper, which does
 * not exist in this repo and belongs to another workstream. `window.confirm`
 * cannot render a blast-radius count or a type-to-confirm field, which is the
 * entire reason this component exists.
 */
export function CoverageConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive,
  requireTypedValue,
  busy,
  confirmDisabled,
  onConfirm,
  onCancel,
}: CoverageConfirmDialogProps) {
  const [typed, setTyped] = React.useState("");

  // A fresh dialog must never inherit the previous target's typed confirmation.
  React.useEffect(() => {
    if (open) setTyped("");
  }, [open, requireTypedValue]);

  const typedOk =
    requireTypedValue === undefined ||
    typed.trim().toLowerCase() === requireTypedValue.trim().toLowerCase();
  const blocked = Boolean(busy) || Boolean(confirmDisabled) || !typedOk;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-modal bg-foreground/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-x-4 top-1/2 z-modal mx-auto max-h-svh max-w-lg -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-card p-5 text-card-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:p-6">
          <DialogPrimitive.Title className="font-heading text-lg font-semibold text-foreground">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description asChild>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">{body}</div>
          </DialogPrimitive.Description>

          {requireTypedValue !== undefined ? (
            <div className="mt-4 flex flex-col gap-1.5">
              <Label htmlFor="coverage-confirm-typed">
                Type <span className="font-semibold text-foreground">{requireTypedValue}</span>{" "}
                to confirm
              </Label>
              <Input
                id="coverage-confirm-typed"
                value={typed}
                autoComplete="off"
                onChange={(event) => setTyped(event.target.value)}
                aria-invalid={typed.length > 0 && !typedOk}
              />
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={destructive ? "destructive" : "default"}
              disabled={blocked}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
