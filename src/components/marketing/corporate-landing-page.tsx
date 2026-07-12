import Image from "next/image";
import { CorporateInquiryForm } from "@/components/corporate/corporate-inquiry-form";
import type { CorporatePageConfig } from "@/lib/corporate/page";

export interface CorporateLandingPageProps {
  config: CorporatePageConfig;
}

/**
 * "Corporate Wellness" page — the destination of the Corporate navbar link.
 * A focused proposal-request (inquiry) page: a shared full-bleed hero
 * (.ssp-hero* + .hero-*), a stub inquiry form with a "what happens next"
 * sidebar, and a stats band. Renders inside the site chrome (navbar + footer).
 */
export function CorporateLandingPage({ config }: CorporateLandingPageProps) {
  const { hero, nextSteps, contact, stats } = config;
  return (
    <>
      {/* Hero — shared full-bleed treatment (matches every other page). */}
      <section className="ssp-hero" aria-labelledby="corp-hero-title">
        <div aria-hidden className="ssp-hero-bg">
          <Image src={hero.image.src} alt="" fill priority sizes="100vw" />
        </div>
        <div className="ssp-hero-inner">
          {hero.eyebrow ? <p className="hero-eyebrow">{hero.eyebrow}</p> : null}
          <h1 id="corp-hero-title" className="hero-title">
            {hero.title}
            {hero.titleAccent ? (
              <>
                <br />
                <em>{hero.titleAccent}</em>
              </>
            ) : null}
          </h1>
          {hero.sub ? <p className="hero-sub">{hero.sub}</p> : null}
        </div>
      </section>

      {/* Inquiry form + "what happens next" sidebar. */}
      <div className="corp-wrap">
        <CorporateInquiryForm config={config.form} />

        <aside className="corp-side">
          <div className="corp-card">
            <h3>{nextSteps.heading}</h3>
            {nextSteps.steps.map((step) => (
              <div key={step.num} className="corp-step">
                <div aria-hidden className="corp-step-num">
                  {step.num}
                </div>
                <div>
                  <b>{step.title}</b>
                  <span>{step.body}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="corp-card corp-contact">
            <h3>{contact.heading}</h3>
            {contact.blurb ? <p>{contact.blurb}</p> : null}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`tel:${contact.phone}`}>{contact.phoneDisplay}</a>
          </div>
        </aside>
      </div>

      {/* Stats band. */}
      <section className="corp-stats" aria-labelledby="corp-stats-title">
        <div className="corp-stats-inner">
          <h2 id="corp-stats-title">
            {stats.heading}
            {stats.headingAccent ? (
              <>
                <br />
                <em>{stats.headingAccent}</em>
              </>
            ) : null}
          </h2>
          {stats.sub ? <p className="corp-stats-sub">{stats.sub}</p> : null}
          <div className="corp-stats-chips">
            {stats.items.map((item) => (
              <div key={item.label} className="corp-stat">
                <div className="n">{item.value}</div>
                <div className="l">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
