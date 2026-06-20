import Link from "next/link";
import { Shapes, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Premium empty state shown when no services exist yet. */
export function ServiceEmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span
        aria-hidden
        className="inline-flex size-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
      >
        <Shapes className="size-8" />
      </span>
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          No services created yet
        </h2>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Services are what customers book on the marketplace. Create your
          first one to get started.
        </p>
      </div>
      <Button asChild>
        <Link href="/admin/services/new">
          <Plus aria-hidden />
          Create Your First Service
        </Link>
      </Button>
    </Card>
  );
}
