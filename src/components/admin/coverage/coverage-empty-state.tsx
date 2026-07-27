import * as React from "react";
import { MapPin, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CoverageEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  actions?: React.ReactNode;
}

function EmptyShell({ icon, title, body, actions }: CoverageEmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span
        aria-hidden
        className="inline-flex size-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
      >
        {icon}
      </span>
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{body}</p>
      </div>
      {actions ? <div className="flex flex-wrap justify-center gap-2">{actions}</div> : null}
    </Card>
  );
}

/** Areas, none ever created. */
export function AreaEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyShell
      icon={<MapPin className="size-8" />}
      title="No service areas yet"
      body="Areas are the towns and cities you operate in. Add one, then add its ZIP codes — a service can cover an area area-wide even before its ZIPs are loaded."
      actions={
        <Button type="button" onClick={onCreate}>
          <Plus aria-hidden />
          Create area
        </Button>
      }
    />
  );
}

/** ZIP codes, none ever created anywhere. */
export function ZipEmptyState({
  onImport,
  onAdd,
  canAdd,
}: {
  onImport: () => void;
  onAdd: () => void;
  canAdd: boolean;
}) {
  return (
    <EmptyShell
      icon={<MapPin className="size-8" />}
      title="No ZIP codes yet"
      body={
        canAdd
          ? "ZIP codes are the only bookable unit — every coverage question is answered about one. Add them one at a time, or paste a list."
          : "Create an area first: every ZIP code belongs to exactly one area."
      }
      actions={
        canAdd ? (
          <>
            <Button type="button" onClick={onImport}>
              <Upload aria-hidden />
              Paste a list
            </Button>
            <Button type="button" variant="outline" onClick={onAdd}>
              <Plus aria-hidden />
              Add one ZIP
            </Button>
          </>
        ) : null
      }
    />
  );
}
