import type { Metadata } from "next";
import { ServicesGridSection } from "@/components/sections/services-grid-section";
import { getServicesPage } from "@/lib/brand/load";
import { getServices } from "@/lib/catalog/load";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  const config = getServicesPage();
  const services = getServices();

  return <ServicesGridSection {...config} services={services} />;
}
