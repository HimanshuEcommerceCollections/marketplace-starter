import * as React from "react";
import { cn } from "@/lib/utils";

/** Vertical rhythm wrapper (token spacing). */
export function Section({
  className,
  as: Comp = "section",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }) {
  return <Comp className={cn("py-12 md:py-16", className)} {...props} />;
}
