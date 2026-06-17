/**
 * Data-driven configuration for the standalone "Services" page. Brand-specific
 * copy lives in brands/<slug>/services-page.config.ts; the page is a thin
 * composition of the shared ServicesGridSection — the same card grid used on
 * the home page — with cards sourced from the catalog (services.json).
 */
export interface ServicesPageConfig {
  heading: string;
  subheading?: string;
  draftNote?: string;
}
