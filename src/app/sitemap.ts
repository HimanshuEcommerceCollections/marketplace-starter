import type { MetadataRoute } from "next";
import { getServices } from "@/lib/catalog/load";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/pricing",
    "/about",
    "/faq",
    "/contact",
    "/book",
    "/waitlist",
    "/pros/apply",
  ];
  const serviceRoutes = getServices().map((s) => `/services/${s.id}`);
  return [...staticRoutes, ...serviceRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
