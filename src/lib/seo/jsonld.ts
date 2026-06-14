/** Typed schema.org builders. Return plain objects for <JsonLd>. */
export type JsonLdThing = Record<string, unknown> & {
  "@context"?: string;
  "@type": string;
};

export function organization(input: {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  legalName?: string;
  contactType?: string;
  email?: string;
}): JsonLdThing {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    legalName: input.legalName,
    url: input.url,
    logo: input.logo,
    sameAs: input.sameAs,
    contactPoint: input.contactType
      ? {
          "@type": "ContactPoint",
          contactType: input.contactType,
          email: input.email,
        }
      : undefined,
  };
}

export function service(input: {
  name: string;
  description: string;
  provider: string;
  url?: string;
  serviceType?: string;
  areaServed?: string;
}): JsonLdThing {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    areaServed: input.areaServed,
    url: input.url,
    provider: { "@type": "Organization", name: input.provider },
  };
}

export function breadcrumbList(
  items: { name: string; url: string }[],
): JsonLdThing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function faqPage(qas: { q: string; a: string }[]): JsonLdThing {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

export function productOffer(input: {
  name: string;
  description?: string;
  priceMinor: number;
  currency: string;
  availability?: string;
}): JsonLdThing {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    offers: {
      "@type": "Offer",
      price: (input.priceMinor / 100).toFixed(2),
      priceCurrency: input.currency,
      availability: input.availability ?? "https://schema.org/InStock",
    },
  };
}
