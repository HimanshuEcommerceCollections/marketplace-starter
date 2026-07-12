import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Service } from "@/lib/catalog/types";

/**
 * Generic service-detail hero for the fallback /services/[slug] route (services
 * with no bespoke landing page). Reuses the shared showcase hero styling
 * (`.ssp-hero*` in service-showcase.css) so it matches the bespoke landing
 * pages: full-bleed cover photo + dark scrim, translucent eyebrow, off-white
 * DM Serif title, summary subline, and the shared buttons. Falls back to a
 * solid dark band (`.ssp-hero-bg` background-color) when the service has no
 * cover image.
 */
export function ServiceHero({ service }: { service: Service }) {
  const cover = service.cover_images?.[0];
  return (
    <section className="ssp-hero" aria-labelledby="svc-hero-title">
      <div aria-hidden className="ssp-hero-bg">
        {cover ? (
          <Image src={cover} alt="" fill priority sizes="100vw" />
        ) : null}
      </div>
      <div className="ssp-hero-inner">
        {service.category ? (
          <p className="hero-eyebrow">{service.category}</p>
        ) : null}
        <h1 id="svc-hero-title" className="hero-title">
          {service.title}
        </h1>
        {service.summary ? (
          <p className="hero-sub">{service.summary}</p>
        ) : null}
        <div className="ssp-hero-btns">
          <Link href={`/book?service=${service.id}`} className="ssp-btn-p">
            Book now →
          </Link>
          {service.from_price != null ? (
            <p className="hero-price">
              From{" "}
              <strong>
                {formatMoney({
                  amount: service.from_price,
                  currency: service.currency,
                })}
              </strong>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
