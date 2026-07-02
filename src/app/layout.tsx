import type { Metadata } from "next";
import { DM_Serif_Display, Fraunces, Inter, Lora, Montserrat } from "next/font/google";
import "@/styles/globals.css";

import { getActiveBrandId } from "@/lib/brand/registry";
import { getBrandConfig, getBrandContent } from "@/lib/brand/load";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SiteChrome } from "@/components/layout/site-chrome";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { JsonLd } from "@/lib/seo/json-ld";
import { organization } from "@/lib/seo/jsonld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});
// Editorial display serif for the redesigned Elevate homepage headings.
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});
// Heavy grotesque for the homepage hero wordmark (MOVE. HEAL. THRIVE.).
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

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
    <html
      lang={config.locale}
      data-brand={brandId}
      className={`${inter.variable} ${fraunces.variable} ${lora.variable} ${dmSerifDisplay.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <Providers config={config} content={content}>
          <PageViewTracker />
          <SiteChrome
            navbar={
              <Navbar
                brandName={config.shortName}
                logoSublabel={config.logoSublabel}
                cta={{ label: "Book Now", href: "/book" }}
              />
            }
            footer={
              <Footer
                brandName={config.shortName}
                tagline={content.hero.title}
                columns={config.footerColumns}
                legalLinks={config.legalLinks}
              />
            }
          >
            {children}
          </SiteChrome>
        </Providers>
        <JsonLd data={orgJsonLd} />
      </body>
    </html>
  );
}
