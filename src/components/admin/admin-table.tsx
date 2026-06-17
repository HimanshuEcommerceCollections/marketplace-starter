"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AdminColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  primary?: boolean;
  align?: "left" | "right";
  mobileHidden?: boolean;
  headerClassName?: string;
  cellClassName?: string;
}

export interface AdminTableProps<T> {
  columns: AdminColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  selectedId?: string;
  onRowSelect?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
  actionsHeader?: React.ReactNode;
  emptyMessage?: string;
  caption?: string;
}

function activateOnKey(handler: () => void) {
  return (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handler();
    }
  };
}

/**
 * Responsive data table. Desktop renders a real <table>; below md it collapses
 * into a stack of cards. Rows are selectable when `onRowSelect` is provided.
 * Use a function declaration (not an arrow) so the generic parses cleanly.
 */
export function AdminTable<T>(props: AdminTableProps<T>) {
  const {
    columns,
    rows,
    getRowId,
    selectedId,
    onRowSelect,
    rowActions,
    actionsHeader,
    emptyMessage = "Nothing to show.",
    caption,
  } = props;

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left font-medium",
                    col.align === "right" && "text-right",
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
              {rowActions ? (
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  {actionsHeader ?? "Actions"}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const id = getRowId(row);
              const selected = selectedId !== undefined && id === selectedId;
              const selectable = Boolean(onRowSelect);
              const select = () => onRowSelect?.(row);
              return (
                <tr
                  key={id}
                  {...(selectable
                    ? {
                        role: "button",
                        tabIndex: 0,
                        "aria-pressed": selected,
                        onClick: select,
                        onKeyDown: activateOnKey(select),
                      }
                    : {})}
                  className={cn(
                    "border-t border-border",
                    selectable && "cursor-pointer hover:bg-muted/60",
                    selected && "bg-muted",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 align-middle",
                        col.primary
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                        col.align === "right" && "text-right",
                        col.cellClassName,
                      )}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                  {rowActions ? (
                    <td className="px-4 py-3 text-right align-middle">
                      <span
                        className="inline-flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {rowActions(row)}
                      </span>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => {
          const id = getRowId(row);
          const selected = selectedId !== undefined && id === selectedId;
          const selectable = Boolean(onRowSelect);
          const select = () => onRowSelect?.(row);
          const primary = columns.find((c) => c.primary);
          const detailCols = columns.filter(
            (c) => !c.primary && !c.mobileHidden,
          );
          return (
            <li key={id}>
              <Card
                {...(selectable
                  ? {
                      role: "button",
                      tabIndex: 0,
                      "aria-pressed": selected,
                      onClick: select,
                      onKeyDown: activateOnKey(select),
                    }
                  : {})}
                className={cn(
                  "p-4",
                  selectable &&
                    "cursor-pointer transition-colors hover:bg-muted/60",
                  selected && "ring-2 ring-ring",
                )}
              >
                {primary ? (
                  <div className="font-medium text-foreground">
                    {primary.cell(row)}
                  </div>
                ) : null}
                {detailCols.length > 0 ? (
                  <dl className="mt-3 flex flex-col gap-2">
                    {detailCols.map((col) => (
                      <div
                        key={col.key}
                        className="flex items-center justify-between gap-3"
                      >
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                          {col.header}
                        </dt>
                        <dd className="text-right text-sm text-foreground">
                          {col.cell(row)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {rowActions ? (
                  <div
                    className="mt-4 flex flex-wrap items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {rowActions(row)}
                  </div>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
