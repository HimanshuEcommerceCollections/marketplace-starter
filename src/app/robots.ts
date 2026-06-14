import type { MetadataRoute } from "next";
import { isEnabled } from "@/lib/flags/resolve";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function robots(): MetadataRoute.Robots {
  // While in demo mode, discourage indexing of the INTERNAL DRAFT site.
  const demo = isEnabled("demoBanner");
  return {
    rules: { userAgent: "*", [demo ? "disallow" : "allow"]: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
