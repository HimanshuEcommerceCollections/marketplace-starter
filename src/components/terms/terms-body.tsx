"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useGsap } from "@/lib/anim/use-gsap";
import type { TermsBodyConfig, TermsBullet } from "@/lib/terms/page";

/**
 * Turn email addresses and the support phone number that appear in plain prose
 * into mailto:/tel: links. This keeps the content config free of inline markup
 * (consistent with every other page config) while preserving the design's
 * inline contact links.
 */
const CONTACT_RE = /([\w.+-]+@[\w-]+\.[\w.-]+)|(\(\d{3}\)\s?\d{3}-\d{4})/g;

function renderText(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(CONTACT_RE)) {
    const value = match[0];
    const start = match.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    if (match[1]) {
      parts.push(
        <a key={key++} href={`mailto:${value}`}>
          {value}
        </a>,
      );
    } else {
      parts.push(
        <a key={key++} href={`tel:${value.replace(/\D/g, "")}`}>
          {value}
        </a>,
      );
    }
    last = start + value.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}

function Bullet({ item }: { item: TermsBullet }) {
  return (
    <li>
      {item.lead ? <b>{item.lead}</b> : null}
      {renderText(item.text)}
    </li>
  );
}

/**
 * Two-column legal body: a sticky table of contents (with a scroll-spy that
 * highlights the section in view) beside the numbered policy sections. Each
 * section reveals on scroll; the reveal is skipped under prefers-reduced-motion
 * (via useGsap), while the scroll-spy — being navigation, not motion — always
 * runs.
 */
export function TermsBody({ tocHeading, sections }: TermsBodyConfig) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  const scope = useGsap<HTMLDivElement>(({ gsap, scope }) => {
    gsap.from(scope.querySelector(".terms-toc"), {
      x: -20,
      autoAlpha: 0,
      duration: 0.7,
      delay: 0.35,
      ease: "power3.out",
    });
    scope.querySelectorAll(".terms-section").forEach((section) => {
      gsap.from(section, {
        scrollTrigger: { trigger: section, start: "top 92%", once: true },
        y: 24,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    });
  }, []);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0% -70% 0%" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div ref={scope} className="terms-wrap">
      <aside className="terms-toc">
        <div className="terms-toc-title">{tocHeading}</div>
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={s.id === activeId ? "on" : undefined}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className="terms-legal-body">
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="terms-section"
            aria-labelledby={`${s.id}-heading`}
          >
            <div className="terms-num">{String(i + 1).padStart(2, "0")}</div>
            <h2 id={`${s.id}-heading`}>{s.title}</h2>
            {s.body?.map((paragraph, j) => <p key={j}>{renderText(paragraph)}</p>)}
            {s.bullets && s.bullets.length > 0 ? (
              <ul className="terms-bullets">
                {s.bullets.map((bullet, j) => (
                  <Bullet key={j} item={bullet} />
                ))}
              </ul>
            ) : null}
            {s.callout ? (
              <div className="terms-callout">
                <p>
                  {s.callout.label ? (
                    <>
                      <b>{s.callout.label}</b>{" "}
                    </>
                  ) : null}
                  {renderText(s.callout.body)}
                </p>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
