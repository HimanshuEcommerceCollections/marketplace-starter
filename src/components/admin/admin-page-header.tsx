import * as React from "react";

export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
}

/** Standard page title block for admin screens. */
export function AdminPageHeader({ title, subtitle }: AdminPageHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      ) : null}
    </header>
  );
}
