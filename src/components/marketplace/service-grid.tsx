import { ServiceCard } from "./service-card";
import type { Service } from "@/lib/catalog/types";

export interface ServiceGridProps {
  services: Service[];
  emptyMessage?: string;
}

export function ServiceGrid({ services, emptyMessage }: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {emptyMessage ?? "No services match your filters."}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
