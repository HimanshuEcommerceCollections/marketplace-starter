"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface FaqSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearLabel: string;
}

/** Controlled FAQ search field — search icon + input + clear button. */
export function FaqSearch({
  value,
  onChange,
  placeholder,
  clearLabel,
}: FaqSearchProps) {
  return (
    <div className="relative">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 pl-10 pr-24"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden className="size-3.5" />
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
}
