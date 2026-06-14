import * as React from "react";
import { Container } from "@/components/layout/container";

export interface ServiceDetailLayoutProps {
  children: React.ReactNode; // main content (description, FAQ, etc.)
  sidebar: React.ReactNode; // PriceSummaryCard / book CTA
}

/** Two-column detail scaffold: content + sticky sidebar (single column on mobile). */
export function ServiceDetailLayout({
  children,
  sidebar,
}: ServiceDetailLayoutProps) {
  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">{children}</div>
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">{sidebar}</div>
        </aside>
      </div>
    </Container>
  );
}
