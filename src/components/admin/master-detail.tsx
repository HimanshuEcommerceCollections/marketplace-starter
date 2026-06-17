"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MasterDetailProps {
  list: React.ReactNode;
  detail: React.ReactNode;
  detailOpen: boolean;
  onClose: () => void;
  emptyState?: React.ReactNode;
  detailLabel?: string;
}

/**
 * Two-pane master/detail layout. On lg+ the list and a sticky detail aside sit
 * side by side. Below lg the list is full width and the detail surfaces as a
 * slide-in sheet from the right when `detailOpen`. The list node is rendered
 * exactly once (inside the flex child, which is block/full-width on mobile).
 */
export function MasterDetail({
  list,
  detail,
  detailOpen,
  onClose,
  emptyState,
  detailLabel,
}: MasterDetailProps) {
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Escape closes (both panes). On mobile only — where the detail surfaces as a
  // modal sheet — lock body scroll, move focus into the sheet on open, and
  // restore focus to the triggering element on close.
  React.useEffect(() => {
    if (!detailOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const isSheet = window.innerWidth < 1024;
    let restoreSheet = () => {};
    if (isSheet) {
      const previouslyFocused = document.activeElement as HTMLElement | null;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      sheetRef.current?.focus();
      restoreSheet = () => {
        document.body.style.overflow = prevOverflow;
        previouslyFocused?.focus?.();
      };
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      restoreSheet();
    };
  }, [detailOpen, onClose]);

  return (
    <>
      <div className="lg:flex lg:items-start lg:gap-6">
        <div className="lg:min-w-0 lg:flex-1">{list}</div>
        <aside className="hidden lg:block lg:w-96 lg:shrink-0 lg:sticky lg:top-20">
          {detailOpen ? detail : emptyState}
        </aside>
      </div>

      {/* Mobile sheet */}
      {detailOpen ? (
        <>
          <div
            className="fixed inset-0 z-modal bg-foreground/50 lg:hidden"
            onClick={onClose}
            aria-hidden
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-label={detailLabel}
            aria-modal="true"
            tabIndex={-1}
            className="fixed inset-y-0 right-0 z-modal flex w-full max-w-md flex-col overflow-y-auto bg-card outline-none animate-in slide-in-from-right lg:hidden"
          >
            <div className="sticky top-0 z-sticky flex items-center gap-2 border-b border-border bg-card px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close detail"
                onClick={onClose}
              >
                <ArrowLeft className="size-5" aria-hidden />
              </Button>
              <span className="text-sm font-medium text-foreground">
                {detailLabel ?? "Details"}
              </span>
            </div>
            <div className="flex-1">{detail}</div>
          </div>
        </>
      ) : null}
    </>
  );
}
