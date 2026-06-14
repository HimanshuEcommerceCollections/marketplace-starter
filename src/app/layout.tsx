import type { Metadata } from "next";
import "@/styles/globals.css";

import { getActiveBrandId } from "@/lib/brand/registry";
import { getBrandConfig, getBrandContent } from "@/lib/brand/load";
import { isEnabled } from "@/lib/flags/resolve";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DemoBanner } from "@/components/layout/demo-banner";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { JsonLd } from "@/lib/seo/json-ld";
import { organization } from "@/lib/seo/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export function generateMetadata(): Metadata {
  const brand = getBrandConfig();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: brand.name, template: `%s | ${brand.name}` },
    description: brand.tagline,
    openGraph: { title: brand.name, description: brand.tagline, type: "website" },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brandId = getActiveBrandId();
  const config = getBrandConfig();
  const content = getBrandContent();

  const orgJsonLd = organization({
    name: config.name,
    legalName: config.organization.legalName,
    url: SITE_URL,
    sameAs: config.organization.sameAs,
    contactType: config.organization.contactType,
    email: config.contactEmail,
  });

  return (
    <html lang={config.locale} data-brand={brandId} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers config={config} content={content}>
          {isEnabled("demoBanner") ? <DemoBanner /> : null}
          <PageViewTracker />
          <Navbar
            brandName={config.shortName}
            links={config.nav}
            cta={content.hero.primaryCta}
          />
          <main className="flex-1">{children}</main>
          <Footer
            brandName={config.shortName}
            columns={config.footerColumns}
            legalLinks={config.legalLinks}
          />
        </Providers>
        <JsonLd data={orgJsonLd} />
      </body>
    </html>
  );
}
