import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NoticeCalloutProps {
  children: ReactNode;
  className?: string;
  /** Hide the leading warning icon. */
  hideIcon?: boolean;
}

/**
 * Draft / placeholder notice bar — `notice`-tinted (terracotta), used to flag
 * demo or pending content (e.g. legal pages awaiting final counsel copy).
 * Server component, token-only.
 */
export function NoticeCallout({ children, className, hideIcon }: NoticeCalloutProps) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border border-notice/30 bg-notice/10 px-4 py-3 text-center text-sm font-medium text-notice",
        className,
      )}
    >
      {hideIcon ? null : <AlertTriangle aria-hidden className="size-4 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}
