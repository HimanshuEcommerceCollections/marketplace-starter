import type { Service } from "@/lib/catalog/types";
import {
  service as serviceLd,
  breadcrumbList,
  faqPage,
  productOffer,
  type JsonLdThing,
} from "@/lib/seo/jsonld";
import { isEnabled } from "@/lib/flags/resolve";
import type { ShowcasePageConfig } from "@/lib/service-showcase/page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export interface ShowcaseJsonLdInput {
  page: ShowcasePageConfig;
  /** Static catalog entry (summary / category / service_type). */
  svc?: Service;
  /** Brand display name used as the JSON-LD provider. */
  provider: string;
  /** Live base price (minor units) — omitted when the API was unreachable. */
  displayedPrice?: number;
  currency: string;
}

/** Service + breadcrumb (+ offer + FAQ) JSON-LD for a showcase page. */
export function showcaseJsonLd({
  page,
  svc,
  provider,
  displayedPrice,
  currency,
}: ShowcaseJsonLdInput): JsonLdThing[] {
  const url = `${SITE_URL}/services/${page.slug}`;
  const jsonLd: JsonLdThing[] = [
    serviceLd({
      name: page.displayName,
      description: svc?.summary ?? page.hero.sub ?? "",
      provider,
      url,
      serviceType: svc?.service_type,
    }),
    breadcrumbList([
      { name: "Home", url: SITE_URL },
      { name: "Services", url: `${SITE_URL}/services` },
      { name: page.hero.title.replace(/\.$/, ""), url },
    ]),
  ];
  if (displayedPrice != null) {
    jsonLd.push(
      productOffer({
        name: page.displayName,
        description: svc?.summary ?? undefined,
        priceMinor: displayedPrice,
        currency,
      }),
    );
  }
  if (isEnabled("faqJsonLd") && page.faq.items.length > 0) {
    jsonLd.push(
      faqPage(page.faq.items.map((f) => ({ q: f.question, a: f.answer }))),
    );
  }
  return jsonLd;
}
