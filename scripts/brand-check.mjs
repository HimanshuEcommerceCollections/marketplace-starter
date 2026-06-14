#!/usr/bin/env node
/**
 * Validates every brand folder against the starter contracts:
 * - required files present
 * - theme.css is scoped to [data-brand="<slug>"] and defines required tokens
 * - services.json / pricing.v1.json parse and cross-reference correctly
 * - proof content is [Sample]-labelled; footer carries INTERNAL DRAFT
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BRANDS = ["elevate", "apex", "events", "education"];
const REQUIRED_FILES = [
  "brand.config.ts",
  "content.config.ts",
  "services.json",
  "pricing.v1.json",
  "theme.css",
];
const REQUIRED_TOKENS = [
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--accent",
  "--ring",
  "--radius",
  "--brand-font-sans",
  "--brand-font-heading",
];

let errors = 0;
const err = (msg) => {
  errors++;
  console.error(`✖ ${msg}`);
};

// Global rule: footer must contain INTERNAL DRAFT.
const footer = join(ROOT, "src/components/layout/footer.tsx");
if (!existsSync(footer) || !readFileSync(footer, "utf8").includes("INTERNAL DRAFT")) {
  err('Footer is missing the required "INTERNAL DRAFT" marker.');
}

for (const slug of BRANDS) {
  const dir = join(ROOT, "brands", slug);
  for (const f of REQUIRED_FILES) {
    if (!existsSync(join(dir, f))) err(`[${slug}] missing required file: ${f}`);
  }

  // theme.css scope + token completeness
  const themePath = join(dir, "theme.css");
  if (existsSync(themePath)) {
    const css = readFileSync(themePath, "utf8");
    if (!css.includes(`[data-brand="${slug}"]`)) {
      err(`[${slug}] theme.css must scope tokens under [data-brand="${slug}"].`);
    }
    for (const t of REQUIRED_TOKENS) {
      if (!css.includes(t)) err(`[${slug}] theme.css missing token: ${t}`);
    }
  }

  // content proof labelling
  const contentPath = join(dir, "content.config.ts");
  if (existsSync(contentPath)) {
    const content = readFileSync(contentPath, "utf8");
    const testimonials = (content.match(/quote:/g) || []).length;
    const samples = (content.match(/isSample:\s*true/g) || []).length;
    if (testimonials > 0 && samples < testimonials) {
      err(`[${slug}] every testimonial must set isSample: true (${samples}/${testimonials}).`);
    }
  }

  // services <-> pricing cross-reference
  const servicesPath = join(dir, "services.json");
  const pricingPath = join(dir, "pricing.v1.json");
  if (existsSync(servicesPath) && existsSync(pricingPath)) {
    let services, pricing;
    try {
      services = JSON.parse(readFileSync(servicesPath, "utf8"));
      pricing = JSON.parse(readFileSync(pricingPath, "utf8"));
    } catch (e) {
      err(`[${slug}] JSON parse error: ${e.message}`);
      continue;
    }
    if (services.brand !== slug) err(`[${slug}] services.json brand="${services.brand}" should be "${slug}".`);

    for (const svc of services.services ?? []) {
      const sp = pricing.services?.[svc.pricing_ref];
      if (!sp) {
        err(`[${slug}] service "${svc.id}" pricing_ref "${svc.pricing_ref}" not found in pricing.v1.json.`);
        continue;
      }
      const modifiers = sp.modifiers ?? [];
      for (const opt of svc.config_options ?? []) {
        if (opt.input === "quantity") continue; // tracked via configuration.quantity
        const mod = modifiers.find((m) => m.id === opt.id);
        if (!mod) {
          err(`[${slug}] service "${svc.id}" option "${opt.id}" has no matching pricing modifier.`);
          continue;
        }
        if (opt.input === "select" || opt.input === "multiselect") {
          for (const choice of opt.choices ?? []) {
            if (!(mod.options ?? []).some((o) => o.id === choice.id)) {
              err(`[${slug}] service "${svc.id}" option "${opt.id}" choice "${choice.id}" has no pricing option.`);
            }
          }
        }
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n✖ brand:check failed with ${errors} error(s).`);
  process.exit(1);
}
console.log("✔ brand:check: all brands valid.");
