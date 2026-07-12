"use client";

import Image from "next/image";
import Link from "next/link";
import { getPhosphorIcon } from "@/lib/icons-phosphor";
import type { CorporatePageConfig } from "@/lib/corporate/page";

export interface CorporateLandingPageProps {
  config: CorporatePageConfig;
}

/**
 * "Corporate Wellness" marketing landing — the Corporate navbar destination.
 * A shared full-bleed hero (.ssp-hero* + .hero-*) over programs, how-it-works,
 * and a closing CTA band that funnels to /corporate/inquiry. Styled by
 * src/styles/corporate.css. Renders inside the site chrome (navbar + footer).
 */
export function CorporateLandingPage({ config }: CorporateLandingPageProps) {
  const { hero, programs, process, cta } = config;
  return (
    <>
      {/* Hero — shared full-bleed treatment. */}
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

      {/* Programs — three ways to bring us in. */}
      <section className="corp-programs" aria-labelledby="corp-programs-title">
        <div className="corp-programs-inner">
          <div className="corp-programs-head">
            {programs.eyebrow ? (
              <p className="corp-kicker">{programs.eyebrow}</p>
            ) : null}
            <h2 id="corp-programs-title" className="corp-sec-title">
              {programs.heading}
              {programs.headingAccent ? (
                <>
                  {" "}
                  <em>{programs.headingAccent}</em>
                </>
              ) : null}
            </h2>
            {programs.intro ? (
              <p className="corp-programs-intro">{programs.intro}</p>
            ) : null}
          </div>
          <div className="corp-prog-grid">
            {programs.items.map((item) => {
              const Icon = getPhosphorIcon(item.icon);
              return (
                <article key={item.title} className="corp-prog-card">
                  <div aria-hidden className="corp-prog-icon">
                    <Icon weight="regular" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works — numbered process. */}
      <section className="corp-how" aria-labelledby="corp-how-title">
        <div className="corp-how-inner">
          {process.eyebrow ? (
            <p className="corp-kicker">{process.eyebrow}</p>
          ) : null}
          <h2 id="corp-how-title" className="corp-sec-title">
            {process.heading}
            {process.headingAccent ? (
              <>
                {" "}
                <em>{process.headingAccent}</em>
              </>
            ) : null}
          </h2>
          <div className="corp-how-grid">
            {process.steps.map((step) => (
              <div key={step.num} className="corp-how-step">
                <div aria-hidden className="corp-how-num">
                  {step.num}
                </div>
                <div className="corp-how-step-title">{step.title}</div>
                <p className="corp-how-desc">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band — funnels to the inquiry page. */}
      <section className="corp-cta" aria-labelledby="corp-cta-title">
        <div className="corp-cta-inner">
          {cta.eyebrow ? <p className="corp-cta-eyebrow">{cta.eyebrow}</p> : null}
          <h2 id="corp-cta-title" className="corp-cta-heading">
            {cta.title}
            {cta.titleAccent ? (
              <>
                {" "}
                <em>{cta.titleAccent}</em>
              </>
            ) : null}
          </h2>
          {cta.sub ? <p className="corp-cta-sub">{cta.sub}</p> : null}
          <div className="corp-cta-btns">
            <Link href={cta.primaryCta.href} className="corp-cta-p">
              {cta.primaryCta.label} →
            </Link>
            {cta.secondaryCta ? (
              <Link href={cta.secondaryCta.href} className="corp-cta-ghost">
                {cta.secondaryCta.label} →
              </Link>
            ) : null}
          </div>
          {cta.chips?.length ? (
            <div className="corp-cta-chips">
              {cta.chips.map((chip) => (
                <span key={chip} className="corp-cta-chip">
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
