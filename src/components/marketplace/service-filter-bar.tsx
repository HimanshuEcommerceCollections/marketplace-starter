"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ServiceFilterBarProps {
  categories: { id: string; title: string }[];
}

/** Category filter synced to the URL (?category=) for shareable, RSC-friendly state. */
export function ServiceFilterBar({ categories }: ServiceFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("category");

  function select(id: string | null) {
    const next = new URLSearchParams(params.toString());
    if (id) next.set("category", id);
    else next.delete("category");
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div
      role="group"
      aria-label="Filter services by category"
      className="flex flex-wrap gap-2"
    >
      <Button
        size="sm"
        variant={active ? "outline" : "default"}
        onClick={() => select(null)}
        aria-pressed={!active}
      >
        All
      </Button>
      {categories.map((c) => (
        <Button
          key={c.id}
          size="sm"
          variant={active === c.id ? "default" : "outline"}
          onClick={() => select(c.id)}
          aria-pressed={active === c.id}
          className={cn(active === c.id && "font-semibold")}
        >
          {c.title}
        </Button>
      ))}
    </div>
  );
}
